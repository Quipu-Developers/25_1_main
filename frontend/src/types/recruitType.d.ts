declare interface RecruitFormData {
  name: string;
  student_id: string;
  grade: number;
  major: string;
  phone_number: string;
  semina: boolean;
  dev: boolean;
  study: boolean;
  external: boolean;
  motivation_semina: string;
  field_dev: string;
  portfolio_pdf: File | null;
  github_profile: string;
  motivation_study: string;
  motivation_external: string;
}

declare interface InputField {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  placeholder?: string;
  disabled: boolean;
  VariantsDirection?: "left" | "right";
}

declare interface ActivityOption {
  label: "세미나" | "개발" | "스터디" | "대외 활동";
  value: "semina" | "dev" | "study" | "external";
}

declare interface RecruitmentStatusResponse {
  is_enabled: boolean;
}

declare interface FaqItem {
  question: string;
  answer: string;
  index?: number;
}
