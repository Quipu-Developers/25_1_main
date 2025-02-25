// 동아리 지원 api
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {Member} = require('../models');
const {uploadToR2} = require("../utils/r2"); // R2 모듈 가져오기

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024
    }, // 10MB 제한
});

router.post('/', upload.single('portfolio_pdf'), async (req, res) => {
    try {
        const {
            name,
            student_id,
            grade,
            major,
            phone_number,
            semina,
            dev,
            study,
            external,
            motivation_semina,
            field_dev,
            motivation_study,
            motivation_external,
            github_profile
        } = req.body;

        console.log(
            `[LOG] recruit api 실행, 데이터 전송 완료 - 신청자: ${name}, 학번: ${student_id}`
        );

        // 값 누락 체크
        const requiredFields = {
            name,
            grade,
            student_id,
            major,
            phone_number,
            semina,
            dev,
            study,
            external
        };

        const motivationFields = [
            {
                activity: semina,
                motivation: motivation_semina
            }, {
                activity: dev,
                motivation: field_dev
            }, {
                activity: study,
                motivation: motivation_study
            }, {
                activity: external,
                motivation: motivation_external
            }
        ];

        // 필수 필드 누락 체크
        for (const [field, value] of Object.entries(requiredFields)) {
            if (value === null || value === undefined || value === "") {
                console.log(`[ERROR] ${field}가 누락되었습니다.- 신청자: ${name}, 학번: ${student_id}`);
                return res
                    .status(400)
                    .send(`필수 요소 누락: ${field}`);
            }
        }

        // 활동 선택 시 motivation 필수 입력 체크
        for (const {activity, motivation}
        of motivationFields) {
            if (activity === 1 && (!motivation || motivation.trim() === "")) {
                console.log(`[ERROR] ${activity} 관련 동기 누락- 신청자: ${name}, 학번: ${student_id}`);
                return res
                    .status(400)
                    .send(`필수 요소 누락: ${activity} 관련 동기 입력 필요`);
            }
        }

        // 중복 확인 by student_id
        const Check = await Member.findOne({where: {
                student_id
            }});
        if (Check) {
            console.log(`[ERROR] 중복된 인원 - 신청자: ${name}, 학번: ${student_id}`)
            return res
                .status(409)
                .send(`이미 신청하셨습니다 - 신청자: ${name}, 학번: ${student_id}`);
        }
        console.log(`[LOG] 데이터 검사 완료 - 신청자: ${name}, 학번: ${student_id}`);

        let portfolioPdfFilename = null;
        // 문제 없으면 pdf 이름 변경 후 저장
        if (req.file) {
            if (req.file) {
                const ext = path.extname(req.file.originalname);
                portfolioPdfFilename = `퀴푸_25_1-${student_id}${name}` + ext;
                try {
                    await uploadToR2(req.file.buffer, portfolioPdfFilename, req.file.mimetype);
                    console.log(`[LOG] 파일 저장: ${portfolioPdfFilename}`);
                } catch (err) {
                    console.log(err);
                    console.log(`[ERROR] 파일 저장 실패: ${portfolioPdfFilename}`);
                    return res
                        .status(500)
                        .send("파일 업로드 실패");
                }
            }
        }

        await Member.create({
            name,
            grade,
            student_id,
            major,
            phone_number,
            semina,
            dev,
            study,
            external,
            motivation_semina,
            field_dev,
            motivation_study,
            motivation_external,
            portfolio_pdf: req.file
                ? portfolioPdfFilename
                : null,
            github_profile
        });
        res
            .status(201)
            .send(`저장 완료`);
        console.log(`[LOG] 데이터 저장 완료 - 신청자: ${name}, 학번: ${student_id}`);
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .send(`서버 에러`);
    };
});
module.exports = router;