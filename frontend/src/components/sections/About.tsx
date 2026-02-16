"use client";

import { motion } from "framer-motion";
import { useAnimatedInView } from "@/hooks/useAnimatedInView";
import { containerVariants, textLineVariants } from "@/hooks/useAnimations";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function About() {
    const [containerRef, isInView] = useAnimatedInView({ once: false });
    const isDark = useDarkMode();

    const lines = [
        "IT를 사랑하는 서울시립대 학생들이 모인 퀴푸는",
        "“재밌지만 가볍지 않게, 제대로 배우자!”를 모토로 하여",
        "다양한 활동과 도전을 통해 함께 성장하는 동아리입니다.",
    ];

    return (
        <motion.div
            className="grow flex flex-col items-center justify-center text-base/7"
            ref={containerRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <motion.h1
                className="font-firaCode mb-[120px] text-center text-5xl md:text-7xl lg:text-8xl"
                variants={textLineVariants("left")}
            >
                &quot;Hello quipu!&quot;
            </motion.h1>

            <motion.svg
                width="100px"
                viewBox="-50 -50 768 757"
                className="mb-5 overflow-visible"
                variants={textLineVariants("right")}
            >
                <use href={`/assets/logo.svg#left-part`} fill={isDark ? "#EFEFEF" : "black"} />
                <use href={`/assets/logo.svg#right-part`} fill={isDark ? "#EFEFEF" : "black"} />
                <use href={`/assets/logo.svg#bottom-part`} fill={isDark ? "#EFEFEF" : "black"} />
            </motion.svg>

            <motion.div className="text-center space-y-2" variants={containerVariants}>
                {lines.map((line, i) => (
                    <motion.p key={i} variants={textLineVariants(i % 2 === 0 ? "left" : "right")}>
                        {line}
                    </motion.p>
                ))}
                {/* <motion.p
                    className="cursor-pointer underline text-point space-y-5"
                    variants={textLineVariants("right")}
                >
                    <a
                        href="https://everytime.kr/418769/v/369933630"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        25년도 1학기 모집 공고 보러가기
                    </a>
                </motion.p> */}
            </motion.div>
        </motion.div>
    );
}
