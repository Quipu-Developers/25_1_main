"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CMToast from "@/components/CMToast";
import axios from "axios";
import useToast from "@/hooks/useToast";
import { majors } from "@/lib/recruitData";

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
  const formRef = useRef<HTMLFormElement | null>(null);

  const [isRecruiting, setIsRecruiting] = useState<boolean | null>(true);

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

  const activityOptions: {
    label: string;
    value: "semina" | "dev" | "study" | "external";
  }[] = [
    { label: "세미나", value: "semina" },
    { label: "개발", value: "dev" },
    { label: "스터디", value: "study" },
    { label: "대외 활동", value: "external" },
  ];

  const devFields: string[] = ["기획", "디자인", "프론트엔드", "백엔드"];

  const handleCopyAccount = (): void => {
    const accountInfo = "카카오뱅크 3333311276288 (예금주: 김예영)";
    navigator.clipboard
      .writeText(accountInfo)
      .then(() => {
        showToast("success", "계좌번호가 복사되었습니다.");
      })
      .catch((err) => {
        console.error(err);
        showToast("error", "계좌번호 복사에 실패했습니다.");
      });
  };

  const checkRecruitmentStatus = async (): Promise<void> => {
    try {
      const response = await axios.get<RecruitmentStatusResponse>(
        `${BASE_URL}/feature/recruit`
      );
      setIsRecruiting(response.data.is_enabled);
    } catch (error) {
      console.error(error);
      setIsRecruiting(false);
    }
  };

  useEffect(() => {
    checkRecruitmentStatus();
  }, []);

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

  const handleCheckboxChange = (
    activity: "semina" | "dev" | "study" | "external"
  ): void => {
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
          () => setFormData((prev) => resetActivityFields(prev, activity)),
          () => {},
          "확인",
          "취소"
        );
      } else {
        setFormData((prev) => resetActivityFields(prev, activity));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [activity]: true,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;

    if (name === "grade") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else if (name === "phone_number") {
      // "-" 자동 추가
      const numericValue = value.replace(/\D/g, "").slice(0, 11);
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
    } else if (name === "major") {
      let newValue = value;

      // 학과 두 글자 이상 입력했을 때만 자동 완성 실행
      if (newValue.length >= formData.major.length && newValue.length >= 2) {
        const match = majors.find((major) => major.startsWith(newValue));

        if (match) {
          newValue = match; // 첫 번째 매칭된 학과로 자동 완성
        }
      }

      setFormData((prev) => ({ ...prev, major: newValue }));
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

  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const bothChecked = checked1 && checked2;

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

  // --- handleSubmit 함수 수정 ---
  // 기존에는 모든 데이터를 FormData에 담아 전송했으나,
  // 아래 코드는 sendDevelopment와 같은 방식으로 각각의 필드를 개별적으로 payload 객체에 담아 전송합니다.
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // (1) 체크박스 동의 여부 등 간단한 유효성 검사 (예시)
    if (!bothChecked) {
      showToast("error", "안내 사항을 모두 확인 및 동의해주세요.");
      return;
    }

    // (2) 필수값이나 형식 검사 (예시)
    if (!validateRequiredFields() || !validatePatterns()) return;

    // (3) 최소 하나의 활동을 선택했는지 확인 (예시)
    if (
      !formData.semina &&
      !formData.dev &&
      !formData.study &&
      !formData.external
    ) {
      showToast("error", "하나 이상의 활동을 선택해주세요.");
      return;
    }

    // (4) 선택된 활동별 추가 유효성 검사 (예시)
    if (formData.semina && !formData.motivation_semina.trim()) {
      showToast("error", "세미나 활동 내용을 입력해주세요.");
      return;
    }
    if (formData.dev) {
      if (
        !formData.field_dev.trim() ||
        !formData.portfolio_pdf ||
        !formData.github_profile.trim()
      ) {
        showToast("error", "개발 활동의 모든 항목을 입력해주세요.");
        return;
      }
    }
    if (formData.study && !formData.motivation_study.trim()) {
      showToast("error", "스터디 활동 내용을 입력해주세요.");
      return;
    }
    if (formData.external && !formData.motivation_external.trim()) {
      showToast("error", "대외 활동 내용을 입력해주세요.");
      return;
    }

    try {
      // --- 핵심 변경 부분: 각각의 필드를 개별적으로 payload 객체에 담아서 전송 ---
      const payload = {
        // 1) 공통 정보
        name: formData.name,
        student_id: formData.student_id,
        grade: formData.grade,
        major: formData.major,
        phone_number: formData.phone_number,
        // 2) 활동 boolean 플래그
        semina: formData.semina,
        dev: formData.dev,
        study: formData.study,
        external: formData.external,
        // 3) 각 활동별 추가 정보 (선택된 활동에 대해서만 값 할당)
        motivation_semina: formData.semina ? formData.motivation_semina : "",
        field_dev: formData.dev ? formData.field_dev : "",
        portfolio_pdf: formData.dev ? formData.portfolio_pdf : null,
        github_profile: formData.dev ? formData.github_profile : "",
        motivation_study: formData.study ? formData.motivation_study : "",
        motivation_external: formData.external
          ? formData.motivation_external
          : "",
      };

      // --- 실제 API 호출 (JSON 방식으로 전송) ---
      const response = await axios.post(`${BASE_URL}/recruit`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response);

      if (response.status === 201) {
        showToast("success", "신청이 완료되었습니다!");
        // 제출 후 폼 초기화
        // setFormData({
        //   name: "",
        //   student_id: "",
        //   grade: 1,
        //   major: "",
        //   phone_number: "",
        //   semina: false,
        //   dev: false,
        //   study: false,
        //   external: false,
        //   motivation_semina: "",
        //   field_dev: "",
        //   portfolio_pdf: null,
        //   github_profile: "",
        //   motivation_study: "",
        //   motivation_external: "",
        // });
        // setChecked1(false);
        // setChecked2(false);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // 서버로부터의 에러 응답 처리
        if (err.response?.status === 400) {
          showToast("error", "하나 이상의 활동을 선택해주세요.");
        } else if (err.response?.status === 422) {
          showToast("error", "선택한 활동 내용을 모두 작성해주세요.");
        } else if (err.response?.status === 409) {
          showToast("error", "이미 제출하셨습니다.");
        } else {
          showToast("error", "신청 중 오류가 발생했습니다.");
        }
      } else {
        // Axios 에러가 아닌 경우
        showToast("error", "신청 중 오류가 발생했습니다.");
        console.error(err);
      }
    }
  };

  return (
    <>
      <CMToast />

      <motion.div
        className="min-h-screen max-w-[600px] mx-auto p-6 flex flex-col items-center justify-around gap-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="font-firaCode w-full text-5xl md:text-6xl lg:text-7xl text-center">
          Welcome!
        </h2>
        <div className="flex items-center">
          <span className="text-3xl">{"{"}</span>
          <div>
            <p>환영합니다! 지원서는 회비 납부 이후 제출해주세요.</p>
            <p>회비: 10,000원</p>
            <p>
              계좌:{" "}
              <span
                className="underline cursor-pointer"
                onClick={handleCopyAccount}
                title="계좌번호 클릭 시 복사"
              >
                카카오뱅크 3333311276288 (예금주: 김예영)
              </span>
            </p>
          </div>
          <span className="text-3xl">{"}"}</span>
        </div>

        <motion.form
          ref={formRef}
          variants={containerVariants}
          className="w-full"
        >
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
                className="p-2 rounded-lg bg-[#F1F1F1]"
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
              type="tel"
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
                  className={`py-2 px-5 rounded-lg ${
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
              <div className="border-b border-gray-300 p-4 rounded">
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
              <div className="border-b border-gray-300 p-4 rounded">
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
                      className={`p-2 rounded-lg ${
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
                <div className="my-6">
                  <label className="mb-1 font-medium">
                    포트폴리오 (PDF, 5MB 이하)
                  </label>
                  <div className="p-2 rounded-lg bg-[#F1F1F1] flex items-center">
                    {/* 파일 선택 버튼 */}
                    <label
                      htmlFor="portfolio_upload"
                      className="cursor-pointer bg-white px-4 py-1 rounded-lg shadow text-sm text-gray-700"
                    >
                      파일 선택
                    </label>

                    {/* 실제 input[type="file"] 요소 (숨김 처리) */}
                    <input
                      id="portfolio_upload"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      disabled={!isRecruiting}
                      className="hidden"
                    />

                    {/* 선택된 파일명 표시 */}
                    <span className="ml-4 text-sm text-gray-600">
                      {formData.portfolio_pdf
                        ? formData.portfolio_pdf.name
                        : "선택한 파일 없음"}
                    </span>
                  </div>
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
              <div className="border-b border-gray-300 p-4 rounded">
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
              <div className="border-b border-gray-300 p-4 rounded">
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
        </motion.form>
        <motion.button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            if (formRef.current) {
              handleSubmit(e);
            }
          }}
          variants={itemVariants}
          type="submit"
          disabled={!isRecruiting || !bothChecked}
          className={`mt-6 px-10 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
            bothChecked
              ? "bg-[#6666ff] text-[#ffffff]"
              : "bg-[#F1F1F1] text-black"
          }`}
        >
          제출하기
        </motion.button>
      </motion.div>
    </>
  );
}

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
    <div className="flex flex-col mb-5">
      <label className="mb-1 font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="p-2 rounded-lg bg-[#F1F1F1] disabled:opacity-50 disabled:cursor-not-allowed 
                   focus:outline-none focus:ring-2 focus:ring-point"
      />
    </div>
  );
}
