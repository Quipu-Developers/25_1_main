// 📌 [기술 스택 아이콘 설정 주의사항]
// 기술 스택(tool) 키워드를 지정할 때 아래 사항을 반드시 확인하세요.
//
// 1️⃣ 아이콘이 존재하는지 확인하기
//    - https://devicon.dev/ 사이트에서 해당 기술 스택 아이콘이 제공되는지 확인하세요.
//
// 2️⃣ URL 테스트하기
//    - 아래 URL에서 `${tool}` 부분을 실제 기술명으로 바꿔서 브라우저에서 접근 가능 여부를 확인하세요.
//    - URL: https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tool}/${tool}-original.svg
//
// 3️⃣ 아이콘이 없는 경우
//    - 아이콘이 존재하지 않으면 빈 이미지 아이콘이 나옵니다. 꼭 확인하세요.

export const developmentTitleData: ActivityTitle = {
  type: "DEVELOPMENT",
  description:
    "동아리의 웹 프로젝트를 매년 새로운 버전 출시를 통해 발전시킵니다. 개발을 좋아하는 학우분들과 함께 아이디어를 공유하고 발전합니다.",
};

const developmentItems: ActivityItem[] = [
  {
    topic: "배틀그라운드 커뮤니티 웹사이트",
    details:
      "게임을 좋아하는 유저들을 위한 커뮤니티 사이트를 개발하여, 정보 공유와 실시간 매칭 시스템을 구축한다.",
    date: "24.01.30",
    link: "https://quipu.uos.ac.kr/",
    images: [
      "https://zippy.b-cdn.net/articket_img1.jpeg",
      "https://zippy.b-cdn.net/_배틀글라운드_img1.jpeg",
    ],
    tools: ["react", "firebase", "tailwindcss"],
  },
  {
    topic: "실시간 채팅 애플리케이션",
    details:
      "WebSocket 기술을 이용하여 빠른 실시간 메시지 송수신 기능을 제공하는 채팅 애플리케이션을 구현한다.",
    date: "24.01.20",
    link: "https://quipu.uos.ac.kr/",
    images: [
      "https://zippy.b-cdn.net/_와글와글_img1.jpeg",
      "https://zippy.b-cdn.net/링고커넥트_img4.jpeg",
    ],
    tools: ["nodejs", "socketio", "mongodb"],
  },
];

export const developmentData: HardcodedActivityContent = {
  total_items: developmentItems.length,
  items: developmentItems,
};
