export const extraTitleData: ActivityTitle = {
  type: "EXTRA",
  description:
    "자유롭게 팀을 꾸려 해커톤이나 여러 경진 대회에 도전하며, 함께 실력을 키우고 새로운 도전을 즐깁니다.",
};

const extraItems: ActivityItem[] = [
  {
    topic: "2024 Plankton Hackathon",
    details:
      "서울의 대규모 축제나 행사에서 실시간 행사 정보와 혼잡도를 제공하는 서비스 개발 프로젝트.",
    date: "24.02.01",
    images: [
      "https://zippy.b-cdn.net/와글와글_img9.jpeg",
      "https://zippy.b-cdn.net/파아란코스_img1.jpeg",
    ],
  },
  {
    topic: "SeSAC AI 챌린지",
    details:
      "딥러닝 기술을 활용하여 데이터를 분석하고, 예측 모델을 구축하는 프로젝트 진행.",
    date: "24.01.25",
    images: [
      "https://zippy.b-cdn.net/탱크_img1.jpeg",
      "https://zippy.b-cdn.net/파아란코스_img2.jpeg",
    ],
  },
];

export const extraData: HardcodedActivityContent = {
  total_items: extraItems.length,
  items: extraItems,
};
