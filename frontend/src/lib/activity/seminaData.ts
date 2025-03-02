export const seminaTitleData: ActivityTitle = {
  type: "SEMINA",
  description:
    "IT에 대한 다양한 주제를 다루는 세미나를 정기적으로 진행합니다. “배우고 나누자”라는 목표를 갖습니다.",
};

const items: ActivityItem[] = [
  {
    speaker: "안태성 | 전자전기컴퓨터공학부",
    topic: "전동화 차량의 전력 변환",
    details:
      "전동화 차량에서 필요한 전기 에너지 상태를 변환하고 제어하는 전력 변환에 대해 소개합니다.",
    date: "25.02.05",
    resources:
      "https://www.instagram.com/p/DGCk1iQz-9p/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    images: [
      "https://pub-880f96b9aa254fce88011c97e585d2bd.r2.dev/250205-%E1%84%8B%E1%85%A1%E1%86%AB%E1%84%90%E1%85%A2%E1%84%89%E1%85%A5%E1%86%BC.png",
    ],
  },
  {
    speaker: "이예나 | 전자전기컴퓨터공학부",
    topic: "깃의 원리에 대해서",
    details:
      "내 작업 폴더에서 원격 저장소까지 코드가 이동하는 과정을 알아보며, Git이 파일 상태에 따라 어떻게 동작하는지 분석합니다.",
    date: "25.02.05",
    resources:
      "https://www.instagram.com/p/DFtuK0wTy2X/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    images: [
      "https://pub-880f96b9aa254fce88011c97e585d2bd.r2.dev/250205-%E1%84%8B%E1%85%B5%E1%84%8B%E1%85%A8%E1%84%82%E1%85%A1.png",
    ],
  },
  // {
  //   speaker: "이제민 | 전자전기컴퓨터공학부",
  //   topic: "데이터베이스 개요",
  //   details: "데이터베이스의 기본 개념과 실전 활용법을 알아보자.",
  //   date: "24.02.05",
  //   pdf: "database_intro.pdf",
  //   images: [
  //     "https://zippy.b-cdn.net/룰렛24_img1.jpeg",
  //     "https://zippy.b-cdn.net/포폴24_img1.png",
  //   ],
  // },
  {
    speaker: "이예나 | 전자전기컴퓨터공학부",
    topic: "스테이블 디퓨전 속도와 효율을 위한 네트워크 활용",
    details:
      "이미지 생성 AI 모델인 스테이블 디퓨전을 활용한 서비스를 만들며 속도와 효율성을 높이기 위한 전략을 공유합니다.",
    date: "25.01.15",
    resources:
      "https://www.instagram.com/p/DFeuqZKzC7u/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    images: [
      "https://pub-880f96b9aa254fce88011c97e585d2bd.r2.dev/250115-%E1%84%8B%E1%85%B5%E1%84%8B%E1%85%A8%E1%84%82%E1%85%A1.png",
    ],
  },
  // {
  //   speaker: "이제민 | 전자전기컴퓨터공학부",
  //   topic: "하드웨어부터 소프트웨어까지 IT 커리어 로드맵",
  //   details:
  //     "IT 분야에서 하드웨어와 소프트웨어를 아우르는 커리어 패스를 소개한다.",
  //   date: "24.01.13",
  //   pdf: "it_career_guide.pdf",
  //   images: [
  //     "https://zippy.b-cdn.net/링고커넥트_img10.png",
  //     "https://zippy.b-cdn.net/룰렛24_img1.jpeg",
  //   ],
  // },
  {
    speaker: "이예나 | 전자전기컴퓨터공학부",
    topic: "쿼푸 웹 배포 전략: 클라우드에서 온프레미스로",
    details:
      "클라우드 기반 배포 방식과 온프레미스 배포의 장단점을 분석하여 앞으로의 퀴푸 메인 웹의 배포 전략을 공유합니다.",
    date: "25.01.09",
    pdf: [
      "https://pub-880f96b9aa254fce88011c97e585d2bd.r2.dev/250109-%E1%84%8B%E1%85%B5%E1%84%8B%E1%85%A8%E1%84%82%E1%85%A1.pdf",
    ],
    resources:
      "https://www.instagram.com/p/DEohaHezAAn/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    images: [
      "https://pub-880f96b9aa254fce88011c97e585d2bd.r2.dev/250109-%E1%84%8B%E1%85%B5%E1%84%8B%E1%85%A8%E1%84%82%E1%85%A1.png",
    ],
  },
];

export const seminaData: HardcodedActivityContent = {
  total_items: items.length,
  items: items,
};
