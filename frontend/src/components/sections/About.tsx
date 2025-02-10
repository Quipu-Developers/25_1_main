"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Typewriter from "typewriter-effect";

export default function About() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.5 });

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-screen text-base/7"
    >
      <h1 className="font-firaCode mb-[120px] text-6xl md:text-7xl lg:text-8xl">
        <Typewriter
          options={{
            strings: ["Hello quipu!"],
            autoStart: true,
            loop: true,
            delay: 100,
            deleteSpeed: 50,
          }}
        />
      </h1>

      <motion.svg
        width="100px"
        viewBox="-50 -50 768 757"
        className="mb-5 overflow-visible"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } },
        }}
      >
        <motion.use
          href={`/assets/logo.svg#left-part`}
          variants={{
            hidden: { opacity: 0, x: 0, scaleX: 1 },
            visible: { opacity: 1, x: [0, -70, 0], scaleX: [1, 1.05, 1] },
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />

        <motion.use
          href={`/assets/logo.svg#right-part`}
          variants={{
            hidden: { opacity: 0, x: 0, scaleX: 1 },
            visible: { opacity: 1, x: [0, 70, 0], scaleX: [1, 1.05, 1] },
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />

        <motion.use
          href={`/assets/logo.svg#bottom-part`}
          fill="black"
          variants={{
            hidden: { opacity: 0, scaleX: 0 },
            visible: { opacity: [0, 1, 0.9, 1], scaleX: [0, 1.2, 1] },
          }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        />
      </motion.svg>

      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, staggerChildren: 0.15 },
          },
        }}
        className="text-center space-y-2"
      >
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          IT를 사랑하는 서울시립대 학생들이 모인 퀴푸는
        </motion.p>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          “재밌지만 가볍지 않게, 제대로 배우자!”를 모토로 하여
        </motion.p>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          다양한 활동과 도전을 통해 함께 성장하는 동아리입니다.
        </motion.p>
      </motion.div>
    </div>
  );
}
