import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useActivityFetchData from "@/hooks/useActivityFetchData";
import Image from "next/image";
import { useAnimatedInView } from "@/hooks/useAnimatedInView";
import { containerVariants, textLineVariants } from "@/hooks/useAnimations";

// 이 부분(주석 + 로직)은 절대 수정 불가
const fetchParams: Record<
  string,
  { useHardcoded: boolean; itemsPerPage: number }
> = {
  study: { useHardcoded: true, itemsPerPage: 4 },
  semina: { useHardcoded: false, itemsPerPage: 4 },
  development: { useHardcoded: true, itemsPerPage: 4 },
  extra: { useHardcoded: true, itemsPerPage: 4 },
};

// 로직, 주석 수정 불가
const Activity = () => {
  const [containerRef, isInView] = useAnimatedInView({ once: false });

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    study: false,
    semina: false,
    development: false,
    extra: false,
  });

  const toggleType = (type: string) => {
    setExpanded((prev) => {
      // 펼쳐질 때는 해당 타입만 true, 다른 타입은 false
      const newState: Record<string, boolean> = {
        study: false,
        semina: false,
        development: false,
        extra: false,
      };
      newState[type] = !prev[type];
      return newState;
    });
  };

  return (
    <motion.div
      className="grow flex flex-col px-6 space-y-10 lg:space-y-14 py-8 max-w-[1000px]"
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <h2 className="font-firaCode w-full text-5xl md:text-6xl lg:text-7xl text-left pb-4 md:pb-8">
        what we do
      </h2>

      {/* 타입별 버튼 목록 */}
      {["study", "semina", "development", "extra"].map((type, i) => (
        <motion.div
          key={type}
          variants={textLineVariants(i % 2 === 0 ? "left" : "right")}
        >
          <button
            onClick={() => toggleType(type)}
            className="w-full flex items-center justify-between text-left uppercase tracking-wide border-b-[0.5px] border-black"
          >
            <span className="text-4xl">{type}</span>
            {/* 화살표 아이콘 (열림/닫힘에 따라 180도 회전) */}
            <svg
              className={`h-10 w-10 transform transition-transform duration-300 ${
                expanded[type] ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* 펼쳐졌을 때만 하위 섹션 렌더링 */}
          <TypeSection type={type} expanded={expanded[type]} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Activity;

// 로직, 주석 수정 불가
const TypeSection = ({ type, expanded }: ActivityTypeSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 커스텀 훅으로 데이터 가져오기
  const { data, loading } = useActivityFetchData(
    type,
    fetchParams[type].useHardcoded,
    currentPage,
    fetchParams[type].itemsPerPage,
    true
  );

  // 만약 페이지나 데이터가 바뀌어서 items 길이가 줄어들면 selectedIndex를 0으로 재설정
  useEffect(() => {
    if (!loading && data && data.items) {
      if (selectedIndex >= data.items.length) {
        setSelectedIndex(0);
      }
    }
  }, [loading, data, selectedIndex]);

  // 펼쳐지지 않았다면(= expanded가 false), 내용 감춤
  // if (!expanded) {
  //   return null;
  // }

  return (
    <div
      className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
        expanded ? "max-h-[1000px]" : "max-h-0"
      }`}
    >
      {loading && <p className="text-gray-500 my-4">Loading...</p>}

      {!loading && !data && (
        <p className="text-gray-500 my-4">내용이 없습니다.</p>
      )}

      {!loading && data && (
        <div>
          {/* 상단 설명 영역 */}
          <div className="">
            <p className="text-[#686868] text-1xl my-4">
              {data.titleData?.description}
            </p>
          </div>

          {/* 현재 선택된 아이템 디테일 영역 */}
          {data.items &&
            data.items.length > 0 &&
            selectedIndex < data.items.length && (
              <SelectedItemDetail item={data.items[selectedIndex]} />
            )}

          {/* 아이템 목록 */}
          <div className="flex flex-col space-y-2 mt-[60px]">
            {data.items?.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`py-3 border-b-[0.4px] border-[#CBCBCB] flex justify-between items-center transition-colors text-1xl
                  ${index === selectedIndex ? "font-bold" : "text-[#686868]"}
                `}
              >
                <span>{item.topic || "No Topic"}</span>
                <span>{item.date || "No Date"}</span>
              </button>
            ))}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center space-x-2">
            {Array.from({ length: data.total_pages }, (_, i) => (
              <PageButton
                key={i}
                $active={currentPage === i + 1}
                onClick={() => {
                  setCurrentPage(i + 1);
                  setSelectedIndex(0); // 페이지 이동 시 첫 아이템으로 리셋
                }}
              >
                {i + 1}
              </PageButton>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 로직, 주석 수정 불가
const SelectedItemDetail = ({ item }: { item: ActivityItem }) => {
  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0">
      {/* 좌측: 이미지(캐러셀) 영역 */}
      <div>
        {item.images && item.images.length ? (
          <ImageCarousel images={item.images} />
        ) : (
          <div className="h-[250px] w-[300px] bg-gray-200 flex items-center justify-center rounded">
            No Image
          </div>
        )}
      </div>

      {/* 우측: 정보 영역 */}
      <div className="w-full flex flex-col justify-end gap-3 pt-[30px] md:ml-7">
        {item.date && (
          <p className="w-full flex justify-between">
            <span className="font-semibold">Date</span> {item.date}
          </p>
        )}
        {item.speaker && (
          <p className="w-full flex justify-between">
            <span className="font-semibold">Speaker</span> {item.speaker}
          </p>
        )}
        {item.topic && (
          <p className="w-full flex justify-between">
            <span className="font-semibold">Topic</span> {item.topic}
          </p>
        )}
        {item.details && (
          <p className="w-full flex justify-between">
            <span className="font-semibold">Details</span>
            <span className="w-[80%] text-end break-keep">{item.details}</span>
          </p>
        )}
        {item.tools && item.tools.length > 0 && (
          <div className="flex justify-between space-x-2">
            <span className="font-semibold">Tools</span>
            <div className="flex space-x-2">
              {item.tools.map((imgUrl: string, index: number) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt="Tool"
                  className="w-6 h-6 object-cover"
                />
              ))}
            </div>
          </div>
        )}
        {item.pdf && (
          <a
            href={`${item.pdf}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-end"
          >
            View PDF
          </a>
        )}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-end"
          >
            View Page
          </a>
        )}
      </div>
    </div>
  );
};

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative mt-4 mx-auto md:mx-6 w-[80%] md:w-[400px] h-[150px] md:h-[250px] flex items-center justify-center">
      <button
        onClick={prevImage}
        className="absolute left-[-24px] top-1/2 -translate-y-1/2 text-lg text-gray-500"
      >
        &lt;
      </button>
      <button
        onClick={nextImage}
        className="absolute right-[-24px] top-1/2 -translate-y-1/2 text-lg text-gray-500"
      >
        &gt;
      </button>

      <Image
        width={300}
        height={250}
        src={images[currentImageIndex]}
        alt={`Image ${currentImageIndex + 1}`}
        className="h-full w-auto rounded"
      />

      <div className="absolute bottom-[-20px] left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full ${
              currentImageIndex === index ? "bg-gray-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const PageButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 0.75rem;
  border: none;
  cursor: pointer;
  color: ${(props) => (props.$active ? "black" : "#686868")};
  font-weight: ${(props) => (props.$active ? "700" : "400")};
`;
