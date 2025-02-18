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

declare interface ModalProps {
  message: string;
  onClose?: () => void;
  persistent?: boolean;
}

declare interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
}

declare interface SubmissionModalState {
  visible: boolean;
  message: string;
}

declare interface ActivityOption {
  label: string;
  value: string;
}

declare interface RecruitmentStatusResponse {
  isRecruiting: boolean;
}

declare interface FaqItemProps {
  question: string;
  answer: string;
}
