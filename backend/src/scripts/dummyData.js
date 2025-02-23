const { File, Semina, Feature } = require("../models");

const insertDummyData = async () => {
  try {
    console.log("[TEST] 더미 데이터 삽입 중");

    // ✅ 세미나 데이터가 이미 존재하면 중복 삽입 방지
    const existingCount = await Semina.count();
    if (existingCount > 0) {
      console.log("[TEST] 더미 데이터가 이미 존재함 (삽입 안 함)");
      return;
    }

    // ✅ 더미 세미나 데이터 삽입
    await Semina.bulkCreate([
      {
        speaker: "이제민 | 전자전기컴퓨터공학부 | 2020440102",
        topic: "백엔드",
        detail: "백엔드백엔드백엔드",
        presentation_date: new Date("2025-02-20"),
      },
      {
        speaker: "이예나 | 전자전기컴퓨터공학부 | 2020440000",
        topic: "프론트엔드",
        detail: "프론트엔드프론트엔드",
        presentation_date: new Date("2025-02-22"),
      },
    ]);

    // ✅ 더미 파일 데이터 삽입 (이미지 + PDF)
    await File.bulkCreate([
      { file_name: "image1.jpg", semina_id: 1 },
      { file_name: "image2.png", semina_id: 1 },
      { file_name: "file1.pdf", semina_id: 1 },
      { file_name: "image3.jpg", semina_id: 2 },
      { file_name: "file2.pdf", semina_id: 2 },
    ]);

    await Feature.bulkCreate([
      { feature_name: "recruit", is_enabled: true },
    ])

    console.log("[TEST] 더미 데이터 삽입 완료");
  } catch (error) {
    console.error("[ERROR] 더미 데이터 삽입 실패:", error);
  }
};

module.exports = insertDummyData;
