"use client";

// RecruitForm은 클라이언트 컴포넌트입니다.
// useState, useEffect 등 브라우저 전용 훅을 사용하므로 "use client" 선언이 필요합니다.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Framer Motion import
import CMToast from "@/components/CMToast";
import axios from "axios";
import useToast from "@/hooks/useToast";

type ActivityType = "semina" | "dev" | "study" | "external";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
};

export default function RecruitForm() {
  const { showToast, confirmToast } = useToast();
  const router = useRouter();

  // 폼 데이터 상태 초기화
  const [formData, setFormData] = useState<RecruitFormData>({
    name: "",
    student_id: "",
    grade: 1,
    major: "",
    phone_number: "",
    semina: false,
    dev: false,
    study: false,
    external: false,
    motivation_semina: "",
    field_dev: "",
    portfolio_pdf: null,
    github_profile: "",
    motivation_study: "",
    motivation_external: "",
  });

  // 모집 여부 상태 (초기 null 이후 실제 값 할당)
  const [isRecruiting, setIsRecruiting] = useState<boolean | null>(false);

  // 활동 선택 옵션 (value는 formData의 boolean 필드명과 일치)
  const activityOptions: { label: string; value: ActivityType }[] = [
    { label: "세미나", value: "semina" },
    { label: "개발", value: "dev" },
    { label: "스터디", value: "study" },
    { label: "대외 활동", value: "external" },
  ];

  // 개발 분야 옵션
  const devFields: string[] = ["기획", "디자인", "프론트엔드", "백엔드"];

  const checkRecruitmentStatus = async (): Promise<void> => {
    try {
      const response = await axios.get<RecruitmentStatusResponse>(
        `${BASE_URL}/recruit-status`
      );
      setIsRecruiting(response.data.isRecruiting);
    } catch (error) {
      console.error(error);
      setIsRecruiting(false);
    }
  };

  useEffect(() => {
    checkRecruitmentStatus();
  }, []);

  // 모집 기간이 아닐 경우 confirmToast로 안내 후 홈으로 이동
  useEffect(() => {
    if (isRecruiting === false) {
      confirmToast(
        "info",
        "지금은 모집 기간이 아니에요. 다음에 만나요!",
        () => {
          router.push("/");
        },
        undefined,
        "홈으로 가기",
        ""
      );
    }
  }, [isRecruiting, confirmToast, router]);
  /**
   * 활동별 필드 초기화 로직
   */
  const resetActivityFields = (
    prev: RecruitFormData,
    activity: "semina" | "dev" | "study" | "external"
  ): RecruitFormData => {
    switch (activity) {
      case "semina":
        return {
          ...prev,
          semina: false,
          motivation_semina: "",
        };
      case "dev":
        return {
          ...prev,
          dev: false,
          field_dev: "",
          portfolio_pdf: null,
          github_profile: "",
        };
      case "study":
        return {
          ...prev,
          study: false,
          motivation_study: "",
        };
      case "external":
        return {
          ...prev,
          external: false,
          motivation_external: "",
        };
      default:
        return prev;
    }
  };

  /**
   * 활동 선택 버튼 클릭 시 해당 boolean 값을 토글
   * - 이미 활성화된 활동을 다시 누르면 confirmToast로 확인 후 데이터 초기화
   * - 비활성 → 활성은 단순 토글
   */
  const handleCheckboxChange = (activity: ActivityType): void => {
    // 선택된 활동의 입력 폼이 하나라도 채워져 있는지 확인
    const isFormFilled =
      formData[activity] &&
      (() => {
        switch (activity) {
          case "semina":
            return formData.motivation_semina.trim() !== "";
          case "dev":
            return (
              formData.field_dev.trim() !== "" ||
              formData.portfolio_pdf !== null ||
              formData.github_profile.trim() !== ""
            );
          case "study":
            return formData.motivation_study.trim() !== "";
          case "external":
            return formData.motivation_external.trim() !== "";
          default:
            return false;
        }
      })();

    if (formData[activity]) {
      if (isFormFilled) {
        const activityLabel =
          activityOptions.find((opt) => opt.value === activity)?.label || "";

        confirmToast(
          "warn",
          `${activityLabel} 활동을 취소하시겠습니까? \n작성해주신 내용이 사라질 수 있습니다.`,
          // 확인(OK) 시
          () => setFormData((prev) => resetActivityFields(prev, activity)),
          // 취소(Cancel) 시
          () => {
            // 아무것도 하지 않음 (기존 값 유지)
          },
          "확인",
          "취소"
        );
      } else {
        setFormData((prev) => resetActivityFields(prev, activity));
      }
    } else {
      // false 상태 ⇒ 활성화(ON)
      setFormData((prev) => ({
        ...prev,
        [activity]: true,
      }));
    }
  };

  // 기본 입력값 변경 핸들러 (학년은 number로 변환)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;

    if (name === "grade") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else if (name === "phone_number") {
      // 숫자만 남기기
      let numericValue = value.replace(/\D/g, "").slice(0, 11);

      // 자동으로 "-" 추가 (백스페이스 시 자연스럽게 삭제)
      let formattedValue = numericValue;
      if (numericValue.length > 3) {
        formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
      }
      if (numericValue.length > 7) {
        formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(
          3,
          7
        )}-${numericValue.slice(7)}`;
      }

      setFormData((prev) => ({ ...prev, phone_number: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 포트폴리오 파일 업로드 (5MB 제한)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }
    setFormData((prev) => ({ ...prev, portfolio_pdf: file }));
  };

  // 제출 전, 유저 동의 체크박스 상태
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const bothChecked = checked1 && checked2;

  // ===== 필수 입력 및 형식 검사 함수 =====
  const validateRequiredFields = (): boolean => {
    if (!formData.name.trim()) {
      showToast("error", "이름을 입력해주세요.");
      return false;
    }
    if (!formData.major.trim()) {
      showToast("error", "학과를 입력해주세요.");
      return false;
    }
    if (!formData.student_id.trim()) {
      showToast("error", "학번을 입력해주세요.");
      return false;
    }
    if (!formData.phone_number.trim()) {
      showToast("error", "전화번호를 입력해주세요.");
      return false;
    }
    return true;
  };

  const validatePatterns = (): boolean => {
    // 학번: 공백 제거 후 10글자
    const studentIdNoSpace = formData.student_id.replace(/\s/g, "");
    if (studentIdNoSpace.length !== 10) {
      showToast("error", "학번은 공백 제외 10글자여야 합니다.");
      return false;
    }

    // 전화번호: 000-0000-0000 형식
    const phoneRegex = /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/;
    if (!phoneRegex.test(formData.phone_number)) {
      showToast("error", "전화번호는 000-0000-0000 형식이어야 합니다.");
      return false;
    }

    return true;
  };

  // ===== 제출 핸들러 =====
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 동의 체크박스 모두 선택되지 않은 경우 알림
    if (!bothChecked) {
      showToast("error", "안내 사항을 모두 확인 및 동의해주세요.");
      return;
    }

    // (1) 필수 입력값 체크
    if (!validateRequiredFields()) return;

    // (2) 입력값 형식 검사
    if (!validatePatterns()) return;

    // (3) 최소 1개 이상의 활동 선택 확인
    if (
      !formData.semina &&
      !formData.dev &&
      !formData.study &&
      !formData.external
    ) {
      showToast("error", "하나 이상의 활동을 선택해주세요.");
      return;
    }

    // (4) 선택한 활동별 세부 폼 입력 확인
    if (formData.semina && formData.motivation_semina.trim() === "") {
      showToast("error", "세미나 활동의 모든 요소를 입력해주세요.");
      return;
    }
    if (formData.dev) {
      if (
        formData.field_dev.trim() === "" ||
        !formData.portfolio_pdf ||
        formData.github_profile.trim() === ""
      ) {
        showToast("error", "개발 활동의 모든 요소를 입력해주세요.");
        return;
      }
    }
    if (formData.study && formData.motivation_study.trim() === "") {
      showToast("error", "스터디 활동의 모든 요소를 입력해주세요.");
      return;
    }
    if (formData.external && formData.motivation_external.trim() === "") {
      showToast("error", "대외 활동의 모든 요소를 입력해주세요.");
      return;
    }

    // 제출 전, 수정/삭제 불가 안내 토스트
    confirmToast(
      "error",
      "제출 후 수정과 삭제는 불가능합니다. 계속 진행하시겠습니까?",
      async () => {
        // (5) FormData 생성 후 폼 데이터 전송
        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("major", formData.major);
        payload.append("grade", String(formData.grade));
        payload.append("student_id", formData.student_id);
        payload.append("phone_number", formData.phone_number);
        payload.append("semina", String(formData.semina));
        payload.append("dev", String(formData.dev));
        payload.append("study", String(formData.study));
        payload.append("external", String(formData.external));

        if (formData.semina) {
          payload.append("motivation_semina", formData.motivation_semina);
        }
        if (formData.dev) {
          payload.append("field_dev", formData.field_dev);
          if (formData.portfolio_pdf) {
            payload.append("portfolio_pdf", formData.portfolio_pdf);
          }
          payload.append("github_profile", formData.github_profile);
        }
        if (formData.study) {
          payload.append("motivation_study", formData.motivation_study);
        }
        if (formData.external) {
          payload.append("motivation_external", formData.motivation_external);
        }

        try {
          const response = await axios.post(`${BASE_URL}/recruit`, payload, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (response.status === 200) {
            showToast("success", "신청이 완료되었습니다!");
            // 제출 후 폼 초기화
            setFormData({
              name: "",
              student_id: "",
              grade: 1,
              major: "",
              phone_number: "",
              semina: false,
              dev: false,
              study: false,
              external: false,
              motivation_semina: "",
              field_dev: "",
              portfolio_pdf: null,
              github_profile: "",
              motivation_study: "",
              motivation_external: "",
            });
            setChecked1(false);
            setChecked2(false);
          }
        } catch (error: any) {
          if (error.response) {
            if (error.response.status === 400) {
              showToast("error", "하나 이상의 활동을 선택해주세요.");
            } else if (error.response.status === 422) {
              showToast(
                "error",
                "선택한 활동에 대한 모든 폼을 올바르게 작성해주세요."
              );
            } else {
              showToast("error", "신청 중 오류가 발생했습니다.");
            }
          } else {
            showToast("error", "신청 중 오류가 발생했습니다.");
          }
          console.error(error);
        }
      },
      () => {},
      "네",
      "아니요"
    );
  };

  return (
    <>
      {/* 전역 토스트 컴포넌트 */}
      <CMToast />

      {/* motion.div로 전체 폼 및 상단 안내 영역에 애니메이션 적용 */}
      <motion.div
        className="max-w-3xl mx-auto p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 상단 안내 영역 */}
        <motion.div className="mb-6" variants={itemVariants}>
          <h1 className="text-2xl font-bold mb-2">Welcome</h1>
          <p>환영합니다! 지원서는 회비 납부 이후 제출해주세요.</p>
          <p>회비: 10,000원</p>
          <p>계좌: 카카오뱅크 3333311276288 (예금주: 김예영)</p>
        </motion.div>

        {/* 폼 전체 */}
        <motion.form onSubmit={handleSubmit} variants={containerVariants}>
          <motion.h1
            className="text-2xl font-bold mb-4"
            variants={itemVariants}
          >
            Recruit Form
          </motion.h1>

          {/* 기본 정보 입력 영역 */}
          <motion.div className="space-y-3" variants={itemVariants}>
            <InputField
              label="이름"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이퀴푸"
              disabled={!isRecruiting}
            />
            <InputField
              label="학과"
              name="major"
              value={formData.major}
              onChange={handleChange}
              placeholder="컴퓨터공학"
              disabled={!isRecruiting}
            />
            <div className="flex flex-col">
              <label className="mb-1 font-medium">학년</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                disabled={!isRecruiting}
                className="border border-gray-300 p-2 rounded bg-[#F1F1F1]"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <InputField
              label="학번"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              placeholder="2025000000"
              disabled={!isRecruiting}
            />
            <InputField
              label="전화번호"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="010-1234-5678"
              disabled={!isRecruiting}
            />
          </motion.div>

          {/* 활동 선택 영역 */}
          <motion.div className="mt-6" variants={itemVariants}>
            <h3 className="font-semibold mb-2">
              하고 싶은 활동을 선택하세요 (복수 선택 가능)
            </h3>
            <div className="flex flex-wrap gap-3">
              {activityOptions.map(({ label, value }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => handleCheckboxChange(value)}
                  disabled={!isRecruiting}
                  className={`p-2 border border-gray-300 rounded-none ${
                    formData[value as keyof RecruitFormData]
                      ? "bg-[#6666ff] text-[#ffffff]"
                      : "bg-[#F1F1F1] text-black"
                  } ${!isRecruiting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* 선택한 활동에 따른 추가 폼 영역 */}
          <motion.div className="mt-6 space-y-4" variants={itemVariants}>
            {formData.semina && (
              <div className="border border-gray-300 p-4 rounded">
                <h3 className="mb-2 font-semibold">세미나 활동</h3>
                <InputField
                  label="발표하고 싶은 주제 & 듣고 싶은 주제"
                  name="motivation_semina"
                  value={formData.motivation_semina}
                  onChange={handleChange}
                  placeholder="주제 입력"
                  disabled={!isRecruiting}
                />
              </div>
            )}

            {formData.dev && (
              <div className="border border-gray-300 p-4 rounded">
                <h3 className="mb-2 font-semibold">개발 활동</h3>
                <div className="flex flex-wrap gap-3">
                  {devFields.map((field) => (
                    <button
                      type="button"
                      key={field}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, field_dev: field }))
                      }
                      disabled={!isRecruiting}
                      className={`p-2 border border-gray-300 rounded-none ${
                        formData.field_dev === field
                          ? "bg-[#6666ff] text-[#ffffff]"
                          : "bg-[#F1F1F1] text-black"
                      } ${
                        !isRecruiting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {field}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium">
                    포트폴리오 (PDF, 5MB 이하)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    disabled={!isRecruiting}
                    className="mt-1 border border-gray-300 p-2 rounded bg-[#F1F1F1]"
                  />
                </div>
                <InputField
                  label="깃허브 프로필 URL"
                  name="github_profile"
                  value={formData.github_profile}
                  onChange={handleChange}
                  placeholder="example@domain.com"
                  disabled={!isRecruiting}
                />
              </div>
            )}

            {formData.study && (
              <div className="border border-gray-300 p-4 rounded">
                <h3 className="mb-2 font-semibold">스터디 활동</h3>
                <InputField
                  label="참여하고 싶은 스터디"
                  name="motivation_study"
                  value={formData.motivation_study}
                  onChange={handleChange}
                  placeholder="스터디 참여 내용"
                  disabled={!isRecruiting}
                />
              </div>
            )}

            {formData.external && (
              <div className="border border-gray-300 p-4 rounded">
                <h3 className="mb-2 font-semibold">대외 활동</h3>
                <InputField
                  label="참여하고 싶은 대외 활동 분야"
                  name="motivation_external"
                  value={formData.motivation_external}
                  onChange={handleChange}
                  placeholder="대외활동 분야 입력"
                  disabled={!isRecruiting}
                />
              </div>
            )}
          </motion.div>

          {/* 안내 문구 및 동의 체크박스 영역 */}
          <motion.div className="mt-8 space-y-2" variants={itemVariants}>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={checked1}
                  onChange={(e) => setChecked1(e.target.checked)}
                  disabled={!isRecruiting}
                  className="mr-2"
                />
                <span>제출 후 수정이 되지 않습니다</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={checked2}
                  onChange={(e) => setChecked2(e.target.checked)}
                  disabled={!isRecruiting}
                  className="mr-2"
                />
                <span>입력하신 정보가 정확한지 다시 한 번 확인해주세요</span>
              </label>
            </div>
          </motion.div>

          {/* 제출 버튼: 동의 체크 시 활성화 */}
          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={!isRecruiting || !bothChecked}
            className={`mt-6 w-full py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed ${
              bothChecked
                ? "bg-[#6666ff] text-[#ffffff]"
                : "bg-[#F1F1F1] text-black"
            }`}
          >
            제출하기
          </motion.button>
        </motion.form>
      </motion.div>
    </>
  );
}

// ===== InputField 컴포넌트 =====
// 폼 입력 요소를 위한 재사용 가능한 컴포넌트입니다.
interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
}: InputFieldProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="border border-gray-300 p-2 rounded bg-[#F1F1F1] disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
