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
    "동아리 회원들을 대상으로 실용성과 재미를 모두 갖춘 프로젝트를 개발하며, 매년 새로운 버전을 출시해 프로젝트를 지속적으로 발전시켜 나갑니다.",
};

const developmentItems: ActivityItem[] = [
  {
    topic: "퀴푸 메인 웹사이트 2024 ver.",
    details: "퀴푸를 소개하고 모집을 진행하는 퀴푸 대표 웹사이트",
    date: "24.03.01",
    link: "https://quipu.uos.ac.kr/",
    images: [
      "https://zippy.b-cdn.net/main24_img1.png",
      "https://zippy.b-cdn.net/main24_img2.png",
      "https://zippy.b-cdn.net/main24_img3.png",
      "https://zippy.b-cdn.net/룰렛24_img1.jpeg",
      "https://zippy.b-cdn.net/룰렛24_img5.jpeg",
    ],
    tools: [
      "threejs-original-wordmark",
      "react-original-wordmark",
      "nodejs-original-wordmark",
    ],
  },
  {
    topic: "퀴푸 백오피스 웹사이트",
    details:
      "지원자분들의 지원 내용을 실시간으로 확인하고 관리할 수 있는 관리자 서비스",
    date: "24.09.01",
    images: [
      "https://zippy.b-cdn.net/backoffice_img1.png",
      "https://zippy.b-cdn.net/backoffice_img2.png",
    ],
    tools: ["react-original-wordmark", "nodejs-original-wordmark"],
  },
  {
    topic: "배틀글라운드",
    details:
      "최대 3명의 플레이어가 한 방에서 주어진 단어장에서 더 많은 단어를 빠르게 차지하는 멀티플레이어 타자 게임",
    date: "24.09.24",
    images: [
      "https://zippy.b-cdn.net/배틀글라운드_img1.jpeg",
      "https://zippy.b-cdn.net/배틀글라운드_img5.jpeg",
      "https://zippy.b-cdn.net/배틀글라운드_img2.jpeg",
      "https://zippy.b-cdn.net/배틀글라운드_img3.jpeg",
      "https://zippy.b-cdn.net/_배틀글라운드_img1.jpeg",
      "https://zippy.b-cdn.net/_배틀글라운드_img2.jpeg",
    ],
    tools: [
      "socketio-original",
      "typescript-original",
      "react-original-wordmark",
      "nodejs-original-wordmark",
    ],
  },
  {
    topic: "Articket",
    details:
      "간단한 성격 테스트를 통해 어울리는 화가를 매칭하고, 스테이블 디퓨전을 활용해서 사용자의 사진을 해당 화가의 스타일로 변환해주는 서비스",
    date: "24.11.19",
    images: [
      "https://zippy.b-cdn.net/articket_img1.jpeg",
      "https://zippy.b-cdn.net/articket_img3.jpeg",
      "https://zippy.b-cdn.net/articket_img4.jpeg",
      "https://zippy.b-cdn.net/articket_img6.jpeg",
    ],
    tools: [
      "socketio-original",
      "react-original-wordmark",
      "flask-original-wordmark",
    ],
  },
];

export const developmentData: HardcodedActivityContent = {
  total_items: developmentItems.length,
  items: developmentItems,
};
