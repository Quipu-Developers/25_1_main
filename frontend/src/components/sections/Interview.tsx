"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import interviewData from "@/lib/interviewData";

// md(데스크톱) 이상에서 동그라미를 배치할 불규칙한 위치들
const circlePositions = [
  "md:absolute md:top-[20%] md:left-[15%]",
  "md:absolute md:top-[60%] md:left-[38%]",
  "md:absolute md:top-[40%] md:left-[70%]",
];

export default function Interview() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedMember = interviewData.find((item) => item.id === selectedId);

  // 말풍선 바깥(오버레이)을 클릭했을 때 닫기
  const handleOverlayClick = () => {
    setSelectedId(null);
  };

  return (
    <div className="grow flex flex-col px-8">
      <h2 className="font-firaCode w-full text-5xl md:text-6xl lg:text-7xl text-left pb-8">
        who we are
      </h2>
      {/* 선택되지 않았을 때(동그라미들) */}
      <AnimatePresence>
        {!selectedMember && (
          <motion.div
            className="flex flex-col md:flex-row justify-around items-center h-full flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {interviewData.map((item, index) => (
              <motion.div
                key={item.id}
                layoutId={`circle-${item.id}`}
                className={`
                  w-40 h-40 md:w-60 md:h-60 rounded-full overflow-hidden cursor-pointer shadow-lg 
                  bg-white ${circlePositions[index] || ""}
                `}
                onClick={() => setSelectedId(item.id)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 * index, duration: 0.5 }}
              >
                <img
                  src={item.imgSrc}
                  alt="avatar"
                  className="object-cover w-full h-full"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 선택된 동그라미 + 말풍선 */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            key="overlay"
            className="absolute inset-0 z-10"
            onClick={handleOverlayClick} // 오버레이 누르면 닫힘
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 동그라미(왼쪽 아래로 이동) */}
            <motion.div
              layoutId={`circle-${selectedMember.id}`}
              className="absolute bottom-[60px] left-[60px] w-60 h-60 rounded-full overflow-hidden cursor-pointer shadow-lg bg-white"
            >
              <img
                src={selectedMember.imgSrc}
                alt="selected avatar"
                className="object-cover w-full h-full"
              />
            </motion.div>

            {/* 말풍선 (동그라미 오른쪽에 위치) */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[650px] w-[90%] max-h-[500px] h-[50%] bg-white shadow-lg rounded-md p-6 overflow-scroll"
              onClick={(e) => e.stopPropagation()} // 말풍선 닫히지 않도록
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* 닫기 버튼 (오른쪽 상단) */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-black z-10"
                onClick={() => setSelectedId(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* 말풍선 내용 */}
              <h2 className="text-2xl font-semibold mb-1">
                {selectedMember.name}
              </h2>
              <span className="text-blue-500 mb-2 inline-block">
                {selectedMember.shortLine}
              </span>
              <hr className="mb-4" />

              <div className="space-y-4 text-sm leading-relaxed">
                {/* 1번 질문 */}
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    자기소개와 맡은 역할을 알려주세요!
                  </h3>
                  <p>{selectedMember.answers.answer1}</p>
                </div>

                {/* 2번 질문 */}
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    퀴푸를 추천하는 이유가 무엇인가요?
                  </h3>
                  <p>{selectedMember.answers.answer2}</p>
                </div>

                {/* 3번 질문 */}
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    가장 기억에 남는 활동이나 프로젝트는 뭐였나요?
                  </h3>
                  <pre className="whitespace-pre-wrap">
                    {selectedMember.answers.answer3}
                  </pre>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
