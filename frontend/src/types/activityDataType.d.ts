declare interface ActivityItem {
  topic: string;
  details: string;
  date: string; // "YYYY-MM-DD" 형식
  images: string[]; // 이미지 URL 리스트
  speaker?: string;
  pdf_name?: string;
  link?: string;
  tools?: string[];
}

declare interface ActivityTitle {
  type: string;
  description: string;
}

declare interface ActivityContentBase {
  total_items: number;
  items: ActivityItem[];
}

// 하드코딩된 데이터 (페이지네이션 정보가 선택적)
declare interface HardcodedActivityContent extends ActivityContentBase {
  total_pages?: number;
  current_page?: number;
  items_per_page?: number;
}

// 백엔드에서 가져온 데이터 (페이지네이션 정보가 필수)
declare interface ResponseActivityContent extends ActivityContentBase {
  total_pages: number;
  current_page: number;
  items_per_page: number;
}

declare interface ActivityTypeSectionProps {
  type: string;
  expanded: boolean;
}
