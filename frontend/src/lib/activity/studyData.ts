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
    topic: "리액트 스터디",
    details:
      "프론트엔드의 가장 인기 있는 라이브러리인 리액트에 입문합니다. 간단한 갤러리와 블로그가 포함된 토이 프로젝트를 진행하며, 리액트의 핵심 개념인 상태 관리에 대해 이해합니다.",
    date: "24.03 - 24.06",
    images: [
      "https://pub-e688831beea1479f8b217d983b99b523.r2.dev/study6.jpeg",
      "https://pub-e688831beea1479f8b217d983b99b523.r2.dev/study7.jpeg",
    ],
    tools: ["react-original-wordmark"],
  },
  {
    topic: "코딩테스트 스터디",
    details:
      "자료구조, 정렬, 탐색 등 코딩테스트에서 자주 출제되는 문제 유형을 다루며, 각자 풀이를 소개하고 공유하여 한 문제에 대한 다양한 접근법을 익힙니다.",
    date: "24.01 - 24.02",
    images: ["https://pub-e688831beea1479f8b217d983b99b523.r2.dev/study5.jpg"],
    tools: ["python-original-wordmark"],
  },
  {
    topic: "퀴푸 메인 웹 개발 스터디",
    details:
      "퀴푸의 첫 웹 사이트 제작을 위한 웹 개발 스터디를 진행하였습니다. 기획부터 디자인, 개발, 배포까지 차근차근 배우며 즐겁게 진행하였고 완성된 메인 웹을 통해 24년도 1학기 모집을 하였습니다.",
    date: "23.10 - 24.02",
    link: "https://quipu-developers.github.io/24_2_main/",
    images: [
      "https://pub-e688831beea1479f8b217d983b99b523.r2.dev/study2.jpg",
      "https://pub-e688831beea1479f8b217d983b99b523.r2.dev/study3.jpg",
      "https://pub-e688831beea1479f8b217d983b99b523.r2.dev/study4.jpg",
    ],
    tools: [
      "figma-original",
      "react-original-wordmark",
      "nodejs-original-wordmark",
    ],
  },
  {
    topic: "전자장 및 전기회로 스터디",
    details:
      "전자전기컴퓨터공학부 선배님과 함께 전자장 및 전기회로의 핵심 개념을 깊이 있게 학습합니다. 강연을 통해 중요한 개념을 정리하고, 직접 풀어본 문제에 대해 질의응답하며 이해도를 탄탄하게 다집니다.",
    date: "23.09 - 23.12",
    images: ["https://pub-e688831beea1479f8b217d983b99b523.r2.dev/study1.png"],
  },
];

export const studyData: HardcodedActivityContent = {
  total_items: studyItems.length,
  items: studyItems,
};
