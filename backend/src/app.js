// Todo
// 2.10 sequelize로 DB 구조 1차적 완성. mysql 연결, model 디렉토리 파일들 완성

// 해야 할 일: api 생성( 총 2가지)

const express = require('express');             // 웹 프레임워크
const path = require('path');                   // 파일, 디렉토리 다루기 위한 유틸리티 패키지                        
const cors = require('cors');                   // CORS 설정용 미들웨어
const helmet = require('helmet');               // 보안 관련
const hpp = require('hpp');                     // 보안 관련
const morgan = require('morgan');               // http 요청 로깅 용 미들웨어
const mysql = require('mysql2/promise');        // mysql 연결용
const fs = require('fs').promises;              // fs
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });     // .env 파일 로드
console.log(`[LOG] NODE_ENV = ${process.env.NODE_ENV}`);

const { sequelize } = require('./models'); // Sequelize ORM 연결
const { exec } = require('child_process');
const PORT = process.env.PORT || 3001;          // 포트 설정
const app = express();
const config = require(__dirname + '/config/config');


//cors 해결
app.use(cors({
    origin: 'https://quipu-main.vercel.app/', // 클라이언트의 Origin
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true, // 쿠키를 포함한 요청을 허용}));
}));
app.use(express.json());

// swagger 관련 세팅
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// local test용
const insertDummyData = require("./scripts/dummyData");

// Router 세팅
const recruitRouter = require('./routes/recruit.js');
const seminainfoRouter = require('./routes/semina_info.js');

// portfolio directory 세팅
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

function runMigrations() {
    return new Promise((resolve, reject) => {
        exec('npx sequelize-cli db:migrate --config ./src/config/config.js', (err, stderr) => {
            if (err) {
                console.error(`[ERROR] 마이그레이션 실행 실패: ${stderr}`);
                reject(err);
            } else {
                console.log('[LOG] 마이그레이션 완료');
                resolve();
            }
        });
    });
}

async function startServer() {
    try {
        if(process.env.NODE_ENV === "development") {
            // mysql에 연결
            const connection = await mysql.createConnection({ host: config.host, user: config.username, password: config.password });

            // DB가 없으면 생성
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
            console.log(`[LOG] 데이터베이스 확인 완료: ${config.database}`);
        
            // 연결 종료(다시 sequelize로 연결할 예정)
            await connection.end();
        }
        
        // Sequelize 연결
        await sequelize.authenticate();
        console.log('[LOG] DB 연결 성공');
        
        // Sequelize 테이블 동기화
        await sequelize.sync({ alter: true} );
        console.log('[LOG] DB 동기화 완료');

        // migration 실행
        await runMigrations();

        // 주기적으로 DB 연결 유지
        setInterval(async () => {
            try {
                await sequelize.query('SELECT 1');
                console.log('[LOG] DB 연결 유지');
            } catch (err) {
                console.error('[ERROR] DB 연결 체크/유지 실패:', err);
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
        console.error('[ERROR] 서버 시작 실패:', err);
        process.exit(1);
        }
}

setupPortfolioDir().then(() => startServer());




//API

//{url}/recruit
app.use('/recruit', recruitRouter);

//{url}/semina?current_page=${currentPage}&items_per_page=${itemsPerPage}
app.use('/semina', seminainfoRouter);

//{url}/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

