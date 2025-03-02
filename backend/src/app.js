// Todo production 신경 쓰기 -> 보안 옵션 전부 켜기

const express = require("express"); // 웹 프레임워크
const path = require("path"); // 파일, 디렉토리 다루기 위한 유틸리티 패키지
const cors = require("cors"); // CORS 설정용 미들웨어
const helmet = require("helmet"); // 보안 관련
const hpp = require("hpp"); // 보안 관련
const morgan = require("morgan"); // http 요청 로깅 용 미들웨어
const mysql = require("mysql2/promise"); // mysql 연결용
const fs = require("fs").promises; // fs
const winston = require("winston");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
}); // .env 파일 로드
console.log(`[LOG] NODE_ENV = ${process.env.NODE_ENV}`);

const { sequelize } = require("./models"); // Sequelize ORM 연결
const { exec } = require("child_process");
const PORT = process.env.PORT || 3001; // 포트 설정
const app = express();
const config = require(__dirname + "/config/config");
app.use(express.json());
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN_DEV, // 클라이언트의 Origin
      methods: ["GET", "POST", "OPTIONS"],
    })
  );
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: false }));
} else {
  app.use(
    cors({
      origin: [process.env.CLIENT_ORIGIN_TEST, process.env.CLIENT_ORIGIN_PROD], // 클라이언트의 Origin
      methods: ["GET", "POST", "OPTIONS"],
    })
  );
  app.enable("trust proxy");
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'none'"], // 기본적으로 모든 리소스 차단ㅌㅈ
          connectSrc: [
            "'self'",
            process.env.CLIENT_ORIGIN_TEST,
            process.env.CLIENT_ORIGIN_PROD,
          ], // FE → BE 요청 허용
          frameAncestors: ["'none'"], // iframe 포함 금지
          scriptSrc: ["'none'"], // 악성 스크립트 차단 (XSS 방지 강화)
          styleSrc: ["'none'"], // 외부 스타일 차단
        },
      },
    })
  );
  app.use(helmet.referrerPolicy({ policy: "strict-origin-when-cross-origin" }));
  app.use(helmet.frameguard({ action: "deny" }));
  app.use(helmet.noSniff());
}

// swagger 관련 세팅
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// local test용
const insertDummyData = require("./scripts/dummyData");

// Router 세팅
const recruitRouter = require("./routes/recruit_R2.js");
const seminainfoRouter = require("./routes/semina_info.js");
const featureRouter = require("./routes/feature.js");

// portfolio directory 세팅
/*
const portfolioDir = path.join(__dirname, '../../portfolio/');
async function setupPortfolioDir() {
    try {
        await fs.readdir(portfolioDir);
        console.log('[LOG] Portfolio directory 확인.');
    } catch (error) {
        try {
            await fs.mkdir(portfolioDir, { recursive: true });
            console.log('[LOG] Portfolio directory 생성.');
        } catch (mkdirError) {
            console.error('[LOG] Portfolio directory 생성 실패:', mkdirError);
        }
    }
};
*/

function runMigrations() {
  return new Promise((resolve, reject) => {
    exec(
      "npx sequelize-cli db:migrate --config src/config/config.js --migrations-path migrations",
      (err, stderr) => {
        if (err) {
          console.error(`[ERROR] 마이그레이션 실행 실패: ${stderr}`);
          reject(err);
        } else {
          console.log("[LOG] 마이그레이션 완료");
          resolve();
        }
      }
    );
  });
}

async function startServer() {
  try {
    if (process.env.NODE_ENV === "development") {
      // mysql에 연결
      const connection = await mysql.createConnection({
        host: config.host,
        user: config.username,
        password: config.password,
      });
      // DB가 없으면 생성
      await connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`
      );
      console.log(`[LOG] 데이터베이스 확인 완료: ${config.database}`);

      // 연결 종료(다시 sequelize로 연결할 예정)
      await connection.end();
    }

    // Sequelize 연결
    await sequelize.authenticate();
    console.log("[LOG] DB 연결 성공");

    // Sequelize 테이블 동기화
    await sequelize.sync({ alter: true });
    console.log("[LOG] DB 동기화 완료");

    // migration 실행
    await runMigrations();

    // 주기적으로 DB 연결 유지
    setInterval(async () => {
      try {
        await sequelize.query("SELECT 1");
        console.log("[LOG] DB 연결 유지 로직 작동");
      } catch (err) {
        console.error("[ERROR] DB 연결 체크/유지 실패:", err);
      }
    }, 3600000);

    //local test
    if (process.env.NODE_ENV === "development") {
      await insertDummyData();
    }

    // 서버 실행
    app.listen(PORT, () => {
      console.log(`PORT: ${PORT}`);
      console.log(`swagger: http://localhost:${PORT}/api-docs`);
      console.log(`server: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("[ERROR] 서버 시작 실패:", err);
    process.exit(1);
  }
}
//setupPortfolioDir().then(() => startServer());
startServer();

// API
// {url}/recruit
app.use("/recruit", recruitRouter);

//{url}/semina?current_page=${currentPage}&items_per_page=${itemsPerPage}
app.use("/semina", seminainfoRouter);

//{url}/feature/:feature_name
app.use("/feature", featureRouter);

//{url}/api-docs 개발시에만
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

//error handler
const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: "error.log" })],
});

app.use((err, req, res, next) => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    console.log("[ERROR] error handler 동작");
    console.error(err.stack || err);
  } else {
    logger.error(err.message || "Unexpected error"); // 운영 환경에서는 로그 파일에 저장
  }

  res.status(err.status || 500).json({
    error: {
      message: "Internal Server Error",
    },
  });
});
