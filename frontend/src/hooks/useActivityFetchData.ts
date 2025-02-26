/**
 * useActivityFetchData - activity 섹션의 데이터를 가져오는 커스텀 훅
 *
 * 이 훅은 activity(스터디, 세미나, 개발, 대외활동) 데이터를 가져오며,
 * 하드코딩된 데이터 또는 백엔드 API 데이터를 선택적으로 사용할 수 있습니다.
 *
 * 기능:
 * - 하드코딩된 데이터(useHardcoded=true) 또는 백엔드 데이터(useHardcoded=false) 가져오기
 * - 페이지네이션 지원 (currentPage, itemsPerPage 지정 가능)
 * - 툴 아이콘 URL을 동적으로 생성하여 항목에 추가
 *
 * @param {string} dataType - 불러올 데이터 유형 ("study", "semina", "development", "extra")
 * @param {boolean} useHardcoded - 하드코딩된 데이터 사용 여부 (기본값: true)
 * @param {number} currentPage - 현재 페이지 번호 (기본값: 1)
 * @param {number} itemsPerPage - 한 페이지에 표시할 항목 수 (기본값: 4)
 * @param {boolean} shouldFetch - 데이터를 가져올지 여부 (기본값: true)
 * @returns {{ data: ResponseActivityContent | null, loading: boolean }} - 불러온 데이터와 로딩 상태
 */

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { studyTitleData, studyData } from "@/lib/activity/studyData";
import { seminaTitleData, seminaData } from "@/lib/activity/seminaData";
import {
  developmentTitleData,
  developmentData,
} from "@/lib/activity/developmentData";
import { extraTitleData, extraData } from "@/lib/activity/extraData";

const TOOL_ICON_BASE_URL =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const titleDataMap: Record<string, ActivityTitle> = {
  study: studyTitleData,
  semina: seminaTitleData,
  development: developmentTitleData,
  extra: extraTitleData,
};

const contentDataMap: Record<string, HardcodedActivityContent> = {
  study: studyData,
  semina: seminaData,
  development: developmentData,
  extra: extraData,
};

// 하드코딩된 데이터 가져오기
const getHardcodedData = (dataType: keyof typeof titleDataMap) => {
  return {
    titleData: titleDataMap[dataType] || {
      type: "UNKNOWN",
      description: "알 수 없는 데이터 유형입니다.",
    },
    contentData: contentDataMap[dataType] || null,
  };
};

const useActivityFetchData = (
  dataType: keyof typeof titleDataMap = "study",
  useHardcoded = true,
  currentPage = 1,
  itemsPerPage = 4,
  shouldFetch = true
) => {
  const [data, setData] = useState<
    null | ({ titleData: ActivityTitle } & ResponseActivityContent)
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shouldFetch) {
      setLoading(false);
      return;
    }

    const { titleData, contentData } = getHardcodedData(dataType);

    if (useHardcoded) {
      if (!contentData) {
        console.error("데이터를 찾을 수 없습니다.");
        setLoading(false);
        return;
      }

      const total_pages = Math.ceil(contentData.total_items / itemsPerPage);
      const validPage = Math.min(currentPage, total_pages);
      const paginatedItems = contentData.items.slice(
        (validPage - 1) * itemsPerPage,
        validPage * itemsPerPage
      );

      setData({
        titleData,
        total_items: contentData.total_items,
        total_pages,
        current_page: validPage,
        items_per_page: itemsPerPage,
        items: paginatedItems.map((item) => ({
          ...item,
          tools: item.tools?.map((tool) => {
            const toolName = tool.split("-")[0];
            return `${TOOL_ICON_BASE_URL}/${toolName}/${tool}.svg`;
          }),
        })),
      });
      setLoading(false);
    } else {
      axios
        .get(
          `${BASE_URL}/${dataType}?current_page=${currentPage}&items_per_page=${itemsPerPage}`
        )
        .then((response: { data: ResponseActivityContent }) => {
          setData({
            titleData,
            ...response.data,
            items: response.data.items.map((item) => ({
              ...item,
              tools: item.tools?.map((tool) => {
                const toolName = tool.split("-")[0];
                return `${TOOL_ICON_BASE_URL}/${toolName}/${tool}.svg`;
              }),
            })),
          });
        })
        .catch((error: unknown) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [dataType, useHardcoded, currentPage, itemsPerPage, shouldFetch]);

  return { data, loading };
};

export default useActivityFetchData;
