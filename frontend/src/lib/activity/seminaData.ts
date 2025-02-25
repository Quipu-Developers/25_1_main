export const seminaTitleData: ActivityTitle = {
  type: "SEMINA",
  description:
    "IT에 대한 다양한 주제를 다루는 세미나를 정기적으로 진행합니다. “배우고 나누자”라는 목표를 갖습니다.",
};

const items: ActivityItem[] = [
  {
    speaker: "이예나 | 전기전자컴퓨터공학부 | 2021000000",
    topic: "깃허브: 깃의 원리에 대해서",
    details:
      "내 작업 폴더에서 원격 저장소까지 코드가 이동하는 과정을 알아보며, Git이 파일 상태에 따라 어떻게 동작하는지 정리해보다.",
    date: "24.02.07",
    pdf: "github_principles.pdf",
    images: [
      "https://zippy.b-cdn.net/포폴24_img1.png",
      "https://zippy.b-cdn.net/링고커넥트_img10.png",
    ],
  },
  {
    speaker: "홍길동 | 컴퓨터공학과 | 2020123456",
    topic: "데이터베이스 개요",
    details: "데이터베이스의 기본 개념과 실전 활용법을 알아보자.",
    date: "24.02.05",
    pdf: "database_intro.pdf",
    images: [
      "https://zippy.b-cdn.net/룰렛24_img1.jpeg",
      "https://zippy.b-cdn.net/포폴24_img1.png",
    ],
  },
  {
    speaker: "김민수 | 소프트웨어학부 | 2021345678",
    topic: "스테이블 디퓨전 속도와 효율을 위한 네트워크 활용",
    details:
      "스테이블 디퓨전의 속도를 높이고 효율적으로 네트워크를 활용하는 방법에 대해 논의한다.",
    date: "24.01.31",
    pdf: "stable_diffusion_network.pdf",
    images: [
      "https://zippy.b-cdn.net/링고커넥트_img10.png",
      "https://zippy.b-cdn.net/룰렛24_img1.jpeg",
    ],
  },
  {
    speaker: "박지훈 | 전산전자공학부 | 2021987654",
    topic: "하드웨어부터 소프트웨어까지 IT 커리어 로드맵",
    details:
      "IT 분야에서 하드웨어와 소프트웨어를 아우르는 커리어 패스를 소개한다.",
    date: "24.01.13",
    pdf: "it_career_guide.pdf",
    images: [
      "https://zippy.b-cdn.net/링고커넥트_img10.png",
      "https://zippy.b-cdn.net/룰렛24_img1.jpeg",
    ],
  },
  {
    speaker: "이예나 | 전자전기컴퓨터공학부",
    topic: "쿼푸 웹 배포 전략: 클라우드에서 온프레미스로",
    details:
      "클라우드 기반 배포 방식과 온프레미스 배포의 장단점을 분석하여 앞으로의 퀴푸 메인 웹의 배포 전략을 공유",
    date: "24.01.10",
    pdf: "cloud_vs_onprem.pdf",
    images: [
      "https://zippy.b-cdn.net/포폴24_img1.png",
      "https://zippy.b-cdn.net/링고커넥트_img10.png",
    ],
  },
];

export const seminaData: HardcodedActivityContent = {
  total_items: items.length,
  items: items,
};
