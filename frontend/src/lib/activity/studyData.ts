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

export const studyTitleData: ActivityTitle = {
  type: "STUDY",
  description:
    "개발 공부부터 코딩 테스트까지, 다양한 주제로 스터디를 진행합니다. 서로 배우고 가르치며 함께 성장합니다.",
};

const studyItems: ActivityItem[] = [
  {
    topic: "알고리즘과 자료구조 개념 정리",
    details:
      "기본적인 알고리즘과 자료구조를 배우고, 실전 문제 풀이를 통해 알고리즘 사고력을 향상시킨다.",
    date: "24.02.06",
    images: ["https://zippy.b-cdn.net/luxo_img1.png"],
    tools: ["react", "python", "java"],
  },
  {
    topic: "HTML, CSS, JavaScript 기본 학습",
    details:
      "웹 개발의 기본을 다지고, 간단한 프로젝트를 만들어보며 실력을 키운다.",
    date: "24.02.02",
    images: [
      "https://zippy.b-cdn.net/hand_img2.jpeg",
      "https://zippy.b-cdn.net/mailper_img1.jpeg",
    ],
    tools: ["html5", "css3", "javascript"],
  },
];

export const studyData: HardcodedActivityContent = {
  total_items: studyItems.length,
  items: studyItems,
};
