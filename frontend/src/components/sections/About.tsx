"use client";

import { motion } from "framer-motion";
import { useAnimatedInView } from "@/hooks/useAnimatedInView";
import { containerVariants, textLineVariants } from "@/hooks/useAnimations";

export default function About() {
  // (1) 감시할 컨테이너 ref와, 뷰포트 노출 여부
  const [containerRef, isInView] = useAnimatedInView({ once: false });

  // 번갈아가며 왼쪽/오른쪽 모션을 주고 싶은 문단들
  const lines = [
    "IT를 사랑하는 서울시립대 학생들이 모인 퀴푸는",
    "“재밌지만 가볍지 않게, 제대로 배우자!”를 모토로 하여",
    "다양한 활동과 도전을 통해 함께 성장하는 동아리입니다.",
  ];

  return (
    <motion.div
      className="grow flex flex-col items-center justify-center text-base/7"
      // (2) 감시하고 싶은 영역에 ref 연결
      ref={containerRef}
      // (3) 컨테이너가 보일 때 자식들을 순차적으로 visible 처리
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* 첫째 줄 (왼쪽 -> 오른쪽 모션) */}
      <motion.h1
        className="font-firaCode mb-[120px] text-6xl md:text-7xl lg:text-8xl"
        variants={textLineVariants("left")}
      >
        &quot;Hello quipu!&quot;
      </motion.h1>

      {/* 둘째 (오른쪽 -> 왼쪽 모션) */}
      <motion.svg
        width="100px"
        viewBox="-50 -50 768 757"
        className="mb-5 overflow-visible"
        variants={textLineVariants("right")}
      >
        <use href={`/assets/logo.svg#left-part`} />
        <use href={`/assets/logo.svg#right-part`} />
        <use href={`/assets/logo.svg#bottom-part`} fill="black" />
      </motion.svg>

      {/* 셋째 (자식들을 차례로 등장시키고 싶다면 또 한 번 containerVariants 적용) */}
      <motion.div
        className="text-center space-y-2"
        variants={containerVariants}
      >
        {lines.map((line, i) => (
          <motion.p
            key={i}
            // 짝수줄은 left, 홀수줄은 right
            variants={textLineVariants(i % 2 === 0 ? "left" : "right")}
          >
            {line}
          </motion.p>
        ))}
      </motion.div>
    </motion.div>
  );
}
