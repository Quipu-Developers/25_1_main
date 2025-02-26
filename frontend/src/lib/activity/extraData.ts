export const extraTitleData: ActivityTitle = {
  type: "EXTRA",
  description:
    "해커톤이나 여러 경진 대회에 참가하며 새로운 도전을 즐기고, 친목을 다지며 재미있는 추억을 만들어갑니다.",
};

const extraItems: ActivityItem[] = [
  {
    topic: "MT 및 친목 활동",
    details:
      "MT와 번개 활동을 통해 함께 친해지며 잊을 수 없는 추억을 쌓아갑니다.",
    date: "23.01 - 24.12",
    images: [
      "https://pub-e688831beea1479f8b217d983b99b523.r2.dev/extra1.jpg",
      "https://pub-e688831beea1479f8b217d983b99b523.r2.dev/extra2.jpg",
      "https://pub-e688831beea1479f8b217d983b99b523.r2.dev/extra3.jpeg",
      "https://pub-e688831beea1479f8b217d983b99b523.r2.dev/extra4.jpg",
    ],
  },
  {
    topic: "CO-SHOW 차세대통신 경진대회",
    details:
      "대구 EXCO에서 3박 4일 동안 통신 기술을 활용한 서비스로 부스를 운영하고, 발표를 통해 심사를 거쳤습니다. 사용자의 사진을 화가의 스타일로 변환하여 티켓으로 출력하는 서비스를 개발하였으며, 협의회장상을 수상하였습니다.",
    date: "24.11.19",
    images: [
      "https://pub-80a42cc7d41749078071917a4265d3ca.r2.dev/_articket_img3.jpeg",
      "https://pub-80a42cc7d41749078071917a4265d3ca.r2.dev/_articket_img4.jpeg",
      "https://pub-80a42cc7d41749078071917a4265d3ca.r2.dev/_articket_img2.jpeg",
      "https://pub-80a42cc7d41749078071917a4265d3ca.r2.dev/_articket_img5.jpeg",
      "https://pub-80a42cc7d41749078071917a4265d3ca.r2.dev/_articket_img6.jpeg",
    ],
  },
  {
    topic: "서울시립대학교 플랑크톤 해커톤",
    details:
      "2박 3일 동안 서울특별시와 편의를 주제로 한 해커톤에 참가하였습니다. 서울의 대규모 행사에서 실시간 행사 정보와 혼잡도를 제공하는 서비스를 개발하였으며, 장려상을 수상하였습니다.",
    date: "24.11.08",
    images: [
      "https://pub-80a42cc7d41749078071917a4265d3ca.r2.dev/와글와글_img10.png",
      "https://pub-80a42cc7d41749078071917a4265d3ca.r2.dev/와글와글_img1.jpeg",
      "https://pub-80a42cc7d41749078071917a4265d3ca.r2.dev/와글와글_img7.jpeg",
      "https://pub-80a42cc7d41749078071917a4265d3ca.r2.dev/_와글와글_img1.jpeg",
    ],
  },
  {
    topic: "새싹 해커톤",
    details:
      "생성형 AI를 활용하여 사회적 약자를 돕는 것을 주제로 한 해커톤에 참가하였습니다. AI와의 음성 대화를 통해 지적장애인의 언어 학습을 지원하는 서비스를 개발하였습니다.",
    date: "24.07.12",
    images: [
      "https://pub-e688831beea1479f8b217d983b99b523.r2.dev/extra5.jpeg",
      "https://pub-80a42cc7d41749078071917a4265d3ca.r2.dev/링고커넥트_img10.png",
      "https://pub-80a42cc7d41749078071917a4265d3ca.r2.dev/링고커넥트_img6.jpeg",
      "https://pub-80a42cc7d41749078071917a4265d3ca.r2.dev/링고커넥트_img9.jpeg",
      "https://pub-80a42cc7d41749078071917a4265d3ca.r2.dev/링고커넥트_img5.jpeg",
    ],
  },
];

export const extraData: HardcodedActivityContent = {
  total_items: extraItems.length,
  items: extraItems,
};
