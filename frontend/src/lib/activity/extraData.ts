export const extraTitleData: ActivityTitle = {
  type: "EXTRA",
  description:
    "자유롭게 팀을 꾸려 해커톤이나 여러 경진 대회에 도전하며, 함께 실력을 키우고 새로운 도전을 즐깁니다.",
};

const extraItems: ActivityItem[] = [
  {
    topic: "2024 CO-SHOW 차세대통신 경진대회",
    details:
      "사용자의 사진을 화가의 스타일로 변환하여 티켓으로 출력하는 서비스 개발",
    date: "24.02.01",
    images: [
      "https://zippy.b-cdn.net/_articket_img3.jpeg",
      "https://zippy.b-cdn.net/_articket_img4.jpeg",
      "https://zippy.b-cdn.net/_articket_img2.jpeg",
      "https://zippy.b-cdn.net/_articket_img5.jpeg",
      "https://zippy.b-cdn.net/_articket_img6.jpeg",
    ],
  },
  {
    topic: "2024 서울시립대학교 플랑크톤 해커톤",
    details:
      "서울의 대규모 행사에서 실시간 행사 정보와 혼잡도를 제공하는 서비스 개발",
    date: "24.02.01",
    images: [
      "https://zippy.b-cdn.net/와글와글_img10.png",
      "https://zippy.b-cdn.net/와글와글_img1.jpeg",
      "https://zippy.b-cdn.net/와글와글_img7.jpeg",
      "https://zippy.b-cdn.net/_와글와글_img1.jpeg",
    ],
  },
  {
    topic: "2024 새싹 해커톤",
    details:
      "생산형 AI를 활용하여 지적장애인의 언어 학습을 도와주는 서비스 개발",
    date: "24.01.25",
    images: [
      "https://zippy.b-cdn.net/링고커넥트_img10.png",
      "https://zippy.b-cdn.net/링고커넥트_img6.jpeg",
      "https://zippy.b-cdn.net/링고커넥트_img9.jpeg",
      "https://zippy.b-cdn.net/링고커넥트_img5.jpeg",
    ],
  },
];

export const extraData: HardcodedActivityContent = {
  total_items: extraItems.length,
  items: extraItems,
};
