// Todo
// 2.10 sequelize로 DB 구조 1차적 완성. mysql 연결, model 디렉토리 파일들 완성


const express = require('express');             // 웹 프레임워크
const path = require('path');                   // 파일, 디렉토리 다루기 위한 유틸리티 패키지                        
const cors = require('cors');                   // CORS 설정용 미들웨어
const helmet = require('helmet');               // 보안 관련
const hpp = require('hpp');                     // 보안 관련
const morgan = require('morgan');               // http 요청 로깅 용 미들웨어
const mysql = require('mysql2/promise');        // mysql 연결용
require('dotenv').config();                     // .env 파일 로드


console.log("app.js");
const { sequelize } = require('./models'); // Sequelize ORM 연결
const PORT = process.env.PORT || 3001;          // 포트 설정
const app = express();


const config = require(__dirname + '/config/config.json')[process.env.NODE_ENV];

// swagger 관련 세팅
//const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');

//app.use(express.json());

async function startServer() {
    try {
        // mysql에 연결
        const connection = await mysql.createConnection({ host: config.host, user: config.username, password: config.password });

        // DB가 없으면 생성
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
        console.log(`[LOG] 데이터베이스 확인 완료: ${config.database}`);
        
        // Sequelize 연결
        await sequelize.authenticate();
        console.log('[LOG] DB 연결 성공');

        // Sequelize 테이블 동기화
        await sequelize.sync();
        console.log('[LOG] DB 동기화 완료');

        // 5. 주기적으로 DB 연결 유지
        setInterval(() => {
            sequelize.query('SELECT 1')
                .then(() => console.log('[LOG] DB 연결 유지'))
                .catch(err => console.error('[ERROR] DB 연결 체크/유지 실패:', err));
        }, 3600000); // 1시간마다 실행

        // 서버 실행
        app.listen(PORT, () => {
            console.log(`PORT: ${PORT}`);
            console.log(`swagger: `);
            console.log(`server: http://localhost:${PORT}`);
        });        

    } catch (err) {
        console.error('[ERROR] 서버 시작 실패:', err);
        process.exit(1);
        }
}

startServer();


