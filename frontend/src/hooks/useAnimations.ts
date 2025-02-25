"use client";

import { Variants } from "framer-motion";

// 여러 자식을 한 번에 감싸는 컨테이너용
// 자식들을 순차적으로(Stagger) 등장시킬 수 있음
export const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12, // 자식 간 등장 딜레이 (살짝 더 자연스럽게)
    },
  },
};

// 한 줄씩 왼쪽 혹은 오른쪽에서 살짝 이동 + 스케일 업 + 페이드 인
export const textLineVariants = (direction: "left" | "right"): Variants => ({
  hidden: {
    opacity: 0,
    scale: 0.85, // 처음 크기를 85%로 줄여 더 자연스럽게 등장
    x: direction === "left" ? -15 : 15, // 좌/우로 더 부드러운 오프셋
  },
  visible: {
    opacity: 1,
    scale: 1, // 100% 크기
    x: 0,
    transition: {
      duration: 1, // 살짝 줄여서 답답하지 않게
      ease: [0.33, 1, 0.68, 1], // 더 조화로운 부드러운 Ease 곡선
    },
  },
});
