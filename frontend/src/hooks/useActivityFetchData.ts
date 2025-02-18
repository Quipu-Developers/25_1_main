// useActivityFetchData.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { studyTitleData, studyData } from "@/lib/activity/studyData";
import { seminarTitleData, seminarData } from "@/lib/activity/seminarData";
import {
  developmentTitleData,
  developmentData,
} from "@/lib/activity/developmentData";
import { extraTitleData, extraData } from "@/lib/activity/extraData";

const TOOL_ICON_BASE_URL =
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// 제목 데이터 매핑
const titleDataMap: Record<string, ActivityTitle> = {
  study: studyTitleData,
  seminar: seminarTitleData,
  development: developmentTitleData,
  extra: extraTitleData,
};

// 내용 데이터 매핑
const contentDataMap: Record<string, HardcodedActivityContent> = {
  study: studyData,
  seminar: seminarData,
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

// shouldFetch 인자 추가 (default: true)
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
          tools: item.tools?.map(
            (tool) => `${TOOL_ICON_BASE_URL}/${tool}/${tool}-original.svg`
          ),
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
              tools: item.tools?.map(
                (tool) => `${TOOL_ICON_BASE_URL}/${tool}/${tool}-original.svg`
              ),
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
