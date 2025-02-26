/**
 * 애니메이션 효과를 위한 framer-motion Variants 설정
 *
 * 이 파일은 `framer-motion`의 Variants 객체를 정의하여
 * 요소가 화면에 나타날 때 자연스러운 애니메이션 효과를 제공합니다.
 *
 * 1. `containerVariants`
 *    - 내부 자식 요소들이 순차적으로 애니메이션되도록 `staggerChildren` 설정
 *
 * 2. `textLineVariants`
 *    - 텍스트 라인의 등장 애니메이션을 위한 Variants
 *    - `direction` 값에 따라 좌측 또는 우측에서 등장
 *    - 스케일과 투명도를 조절하여 부드러운 효과 적용
 *
 * @param {"left" | "right"} direction - 텍스트가 등장하는 방향 ("left" 또는 "right")
 * @returns {Variants} - `framer-motion`에서 사용 가능한 Variants 객체
 */

import { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export const textLineVariants = (direction: "left" | "right"): Variants => ({
  hidden: {
    opacity: 0,
    scale: 0.85,
    x: direction === "left" ? -15 : 15,
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 1,
      ease: [0.33, 1, 0.68, 1],
    },
  },
});
