const {S3Client, PutObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

// Cloudflare R2 설정
const s3 = new S3Client({
    region: "auto", endpoint: process.env.R2_ENDPOINT, // Cloudflare R2 엔드포인트
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY, // R2 API Access Key
        secretAccessKey: process.env.R2_SECRET_KEY, // R2 API Secret Key
    }
});

// 파일 업로드 함수 (AWS SDK v3 방식)
async function uploadToR2(fileBuffer, fileName, mimeType) {

    const params = {
        Bucket: "quipu-recruit-portfolio", // Cloudflare R2 버킷 이름
        Key: safeFileName,
        Body: fileBuffer,
        ContentType: mimeType
    };

    try {
        await s3.send(new PutObjectCommand(params)); // v3 방식으로 변경
        console.log(`[LOG] R2 파일 업로드 성공: ${fileName}`);
    } catch (err) {
        console.error(`[ERROR] R2 파일 업로드 실패: ${err.message}`);
        throw new Error("파일 업로드 실패");
    }
}

// 파일 삭제 함수 (AWS SDK v3 방식)
async function deleteFromR2(fileName) {
    const params = {
        Bucket: "quipu-recruit-portfolio",
        Key: fileName
    };

    try {
        await s3.send(new DeleteObjectCommand(params)); // v3 방식으로 변경
        console.log(`[LOG] R2 파일 삭제 성공: ${fileName}`);
    } catch (err) {
        console.error(`[ERROR] R2 파일 삭제 실패: ${err.message}`);
    }
}

module.exports = {
    uploadToR2,
    deleteFromR2
};