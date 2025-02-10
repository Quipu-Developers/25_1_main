"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Typewriter from "typewriter-effect";
import { useScrollAnimation } from "@/hooks/useScroll";

export default function About() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const logoRef = useRef(null);

  const textRef1 = useRef<HTMLParagraphElement | null>(null);
  const textRef2 = useRef<HTMLParagraphElement | null>(null);
  const textRef3 = useRef<HTMLParagraphElement | null>(null);

  const isTitleInView = useInView(titleRef, { once: false, amount: 0.9 });
  const isLogoInView = useInView(logoRef, { once: false, amount: 0.9 });
  const isTextInView1 = useInView(textRef1, { once: false, amount: 0.9 });
  const isTextInView2 = useInView(textRef2, { once: false, amount: 0.9 });
  const isTextInView3 = useInView(textRef3, { once: false, amount: 0.9 });

  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    if (isTitleInView) {
      setShowTyping(true);
    } else {
      setShowTyping(false);
    }
  }, [isTitleInView]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center h-screen text-base/7"
    >
      <motion.h1
        ref={titleRef}
        className="font-firaCode mb-[120px] text-6xl md:text-7xl lg:text-8xl"
        {...useScrollAnimation(isTitleInView)}
      >
        {!showTyping ? (
          "Hello quipu!"
        ) : (
          <Typewriter
            options={{
              strings: ["Hello quipu!"],
              autoStart: true,
              loop: true,
              delay: 100,
              deleteSpeed: 50,
            }}
          />
        )}
      </motion.h1>

      <motion.svg
        ref={logoRef}
        width="100px"
        viewBox="-50 -50 768 757"
        className="mb-5 overflow-visible"
        {...useScrollAnimation(isLogoInView)}
      >
        <motion.use
          href={`/assets/logo.svg#left-part`}
          {...useScrollAnimation(isLogoInView)}
        />
        <motion.use
          href={`/assets/logo.svg#right-part`}
          {...useScrollAnimation(isLogoInView)}
        />
        <motion.use
          href={`/assets/logo.svg#bottom-part`}
          fill="black"
          {...useScrollAnimation(isLogoInView)}
        />
      </motion.svg>

      <div className="text-center space-y-2">
        <motion.p ref={textRef1} {...useScrollAnimation(isTextInView1)}>
          IT를 사랑하는 서울시립대 학생들이 모인 퀴푸는
        </motion.p>
        <motion.p ref={textRef2} {...useScrollAnimation(isTextInView2)}>
          “재밌지만 가볍지 않게, 제대로 배우자!”를 모토로 하여
        </motion.p>
        <motion.p ref={textRef3} {...useScrollAnimation(isTextInView3)}>
          다양한 활동과 도전을 통해 함께 성장하는 동아리입니다.
        </motion.p>
      </div>
    </div>
  );
}
