import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useActivityFetchData from "@/hooks/useActivityFetchData";

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
    <div className="grow flex flex-col px-6 space-y-10 lg:space-y-14 py-8">
      <h2 className="font-firaCode w-full text-5xl md:text-6xl lg:text-7xl text-left pb-4 md:pb-8">
        what we do
      </h2>

      {/* 타입별 버튼 목록 */}
      {["study", "semina", "development", "extra"].map((type) => (
        <div key={type} className="space-y-3">
          <button
            onClick={() => toggleType(type)}
            className={`w-full flex items-center justify-between p-4 border rounded text-left uppercase tracking-wide transition-colors
              ${
                expanded[type]
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }
            `}
          >
            <span className="font-bold text-lg">{type}</span>
            {/* 화살표 아이콘 (열림/닫힘에 따라 180도 회전) */}
            <svg
              className={`h-5 w-5 transform transition-transform duration-300 ${
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
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* 펼쳐졌을 때만 하위 섹션 렌더링 */}
          <TypeSection type={type} expanded={expanded[type]} />
        </div>
      ))}
    </div>
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
  if (!expanded) {
    return null;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && !data && <p className="text-gray-500">No data available.</p>}

      {!loading && data && (
        <div className="space-y-6">
          {/* 상단 설명 영역 */}
          <div className="p-4 border rounded bg-gray-50">
            <p className="text-gray-700">{data.titleData?.description}</p>
          </div>

          {/* 현재 선택된 아이템 디테일 영역 */}
          {data.items &&
            data.items.length > 0 &&
            selectedIndex < data.items.length && (
              <SelectedItemDetail item={data.items[selectedIndex]} />
            )}

          {/* 아이템 목록 */}
          <div className="flex flex-col space-y-2">
            {data.items?.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`p-3 border rounded flex justify-between items-center transition-colors
                  ${
                    index === selectedIndex
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }
                `}
              >
                <span className="font-bold">{item.topic || "No Topic"}</span>
                <span className="text-sm">{item.date || "No Date"}</span>
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
    <div className="flex flex-col md:flex-row border p-4 rounded bg-white shadow-md space-y-4 md:space-y-0 md:space-x-4">
      {/* 좌측: 이미지(캐러셀) 영역 */}
      <div className="w-full md:w-1/3">
        {item.images && item.images.length > 1 ? (
          <ImageCarousel images={item.images} />
        ) : item.images && item.images.length === 1 ? (
          <img
            src={item.images[0]}
            alt={item.topic || "Image"}
            className="w-full h-auto object-cover rounded"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
            No Image
          </div>
        )}
      </div>

      {/* 우측: 정보 영역 */}
      <div className="w-full md:w-2/3 flex flex-col space-y-2">
        {item.speaker && (
          <p>
            <span className="font-semibold">Speaker:</span> {item.speaker}
          </p>
        )}
        {item.topic && (
          <p>
            <span className="font-semibold">Topic:</span> {item.topic}
          </p>
        )}
        {item.details && (
          <p>
            <span className="font-semibold">Details:</span> {item.details}
          </p>
        )}
        {item.date && (
          <p>
            <span className="font-semibold">Date:</span> {item.date}
          </p>
        )}
        {item.pdf && (
          <a
            href={`${item.pdf}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View PDF
          </a>
        )}
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View More
          </a>
        )}
        {item.tools && item.tools.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Tools:</span>
            {item.tools.map((imgUrl: string, index: number) => (
              <img
                key={index}
                src={imgUrl}
                alt="Tool"
                className="w-6 h-6 object-contain"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 로직, 주석 수정 불가
const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative">
      <img
        src={images[currentImageIndex]}
        alt={`Image ${currentImageIndex + 1}`}
        className="w-full h-auto object-cover rounded"
      />
      <button
        onClick={prevImage}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-r"
      >
        &#8249;
      </button>
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-l"
      >
        &#8250;
      </button>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full ${
              currentImageIndex === index ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// 여기서만 styled-component로 동적으로 스타일 바꿔 줌
// (주석, 로직 변경 없이 디자인만 변경)
const PageButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  background-color: ${(props) => (props.$active ? "#3b82f6" : "#e5e7eb")};
  color: ${(props) => (props.$active ? "#ffffff" : "#374151")};
  &:hover {
    background-color: ${(props) => (props.$active ? "#2563eb" : "#d1d5db")};
  }
`;
