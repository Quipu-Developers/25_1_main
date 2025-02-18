// semina 정보 api
const express = require('express');
const router =express.Router();
const { File, Semina } = require('../models');

// {url}}/semina?current_page=${currentPage}&items_per_page=${itemsPerPage}
// ex) 
router.get('/', async(req, res) => {
  try{
    console.log("[LOG] semina_info api 실행") 
    const currentPage = parseInt(req.query.current_page, 10) || 1;  // current_page
    const itemsPerPage = parseInt(req.query.items_per_page, 10) || 5; // items_per_page
    const limit = Math.max(itemsPerPage, 1); 
    const offset = Math.max((currentPage - 1) * limit, 0);
    const total_items = await Semina.count();
    const total_pages = Math.ceil(total_items / limit);
    const seminas = await Semina.findAll({
      attributes: ["speaker", "topic", "detail", "presentation_date"],
      limit: limit,
      offset: offset,
      order: [["presentation_date", "DESC"]], // 날짜 기준 최신순 정렬
      include: [
        {
          model: File,
          attributes: ["file_url", "file_type"], 
        },
      ],
    });
    
    const finaldata = seminas.map((semina) => ({
      speaker: semina.speaker,
      topic: semina.topic,
      details: semina.detail,
      date: semina.presentation_date.toISOString().split("T")[0], // YYYY-MM-DD 변환
      pdf: semina.Files.find((file) => file.file_type === "pdf")?.file_url || "", // 첫 번째 PDF URL만 가져옴
      images: semina.Files.filter((file) => file.file_type === "image").map((file) => file.file_url), //  배열 유지     
    }));

    console.log("[LOG] semina_info api 응답 완료")

    res.status(200).json({
      total_items: total_items,
      total_pages: total_pages,
      current_page: currentPage,
      items_per_page: itemsPerPage,
      items: finaldata,
    });
    /*
      {
        "total_items": number,  // 전체 아이템 개수
        "total_pages": number,  // 총 페이지 수
        "current_page": number,  // 현재 페이지 번호
        "items_per_page": number,  // 한 페이지당 아이템 개수
        "items": {  // 요청한 페이지에 해당하는 아이템 리스트
          "speaker": string,
          "topic": string,
          "details": string,
          "date": string,  // "YYYY-MM-DD" 형식
          "pdf": string,  // PDF URL
          "images": string[]  // 이미지 URL 리스트
        }[]
      }
    */

  } catch(err){
    console.error("[ERROR] 서버 오류 발생:", err);
    res.status(500).json({ error: "서버 오류 발생", details: err.message });
  };
});

module.exports = router;