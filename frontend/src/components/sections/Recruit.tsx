"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import styled from "styled-components";
import { faqData } from "@/lib/recruitData";
import { motion } from "framer-motion";
import { useAnimatedInView } from "@/hooks/useAnimatedInView";
import { containerVariants, textLineVariants } from "@/hooks/useAnimations";
import Footer from "@/components/sections/Footer";

export default function Recruit() {
  const router = useRouter();
  return (
    <div className="grow flex flex-col items-center justify-start min-h-screen p-8">
      <h2 className="font-firaCode w-full text-5xl md:text-6xl lg:text-7xl text-center pb-8">
        Welcome!
      </h2>

      <button
        className="flex items-center mb-8 space-x-2"
        onClick={() => router.push("/recruit")}
      >
        <span className="text-3xl">{"{"}</span>
        <div className="px-4 py-2 text-2xl">
          <span>퀴푸 가입하러 가기</span>
        </div>
        <span className="text-3xl">{"}"}</span>
      </button>

      <FaqSection />

      {/* 푸터 섹션 */}
      <Footer />
    </div>
  );
}

function FaqSection() {
  const [containerRef, isInView] = useAnimatedInView({ once: false });

  return (
    <motion.div
      className="w-full max-w-2xl px-4"
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <h2 className="text-3xl mb-4">FAQ</h2>
      {faqData.map((item, idx) => (
        <FaqItem
          key={idx}
          index={idx}
          question={item.question}
          answer={item.answer}
        />
      ))}
    </motion.div>
  );
}

function FaqItem({ question, answer, index }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <motion.div
      className="border-b border-gray-300 py-3"
      variants={textLineVariants(
        index !== undefined && index % 2 === 0 ? "left" : "right"
      )}
    >
      <button
        className="flex w-full justify-between items-center focus:outline-none"
        onClick={toggleOpen}
      >
        <span className="text-left text-gray-800 font-medium">{question}</span>
        <svg
          className={`h-5 w-5 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnswerContainer $isOpen={isOpen} className="mt-2 text-gray-600 text-sm">
        {answer}
      </AnswerContainer>
    </motion.div>
  );
}

const AnswerContainer = styled.div<{ $isOpen: boolean }>`
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  max-height: ${({ $isOpen }) => ($isOpen ? "200px" : "0")};
`;
