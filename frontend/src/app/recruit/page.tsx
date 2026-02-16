"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CMToast from "@/components/CMToast";
import axios from "axios";
import useToast from "@/hooks/useToast";
import { majors } from "@/lib/recruitData";
import { SlArrowLeft } from "react-icons/sl";
import { useAnimatedInView } from "@/hooks/useAnimatedInView";
import { containerVariants, textLineVariants } from "@/hooks/useAnimations";
import Footer from "@/components/sections/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function RecruitForm() {
    const { showToast, confirmToast } = useToast();
    const router = useRouter();
    const formRef = useRef<HTMLFormElement | null>(null);

    const [isRecruiting, setIsRecruiting] = useState<boolean | null>(true);

    const [containerRef, isInView] = useAnimatedInView({ once: true });

    const [formData, setFormData] = useState<RecruitFormData>({
        name: "",
        student_id: "",
        grade: 1,
        major: "",
        phone_number: "",
        semina: true,
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

    const activityOptions: ActivityOption[] = [
        { label: "세미나", value: "semina" },
        { label: "개발", value: "dev" },
        { label: "스터디", value: "study" },
        { label: "대외 활동", value: "external" },
    ];

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
            // const response = await axios.get<RecruitmentStatusResponse>(
            //     `${BASE_URL}/feature/recruit`
            // );
            // setIsRecruiting(response.data.is_enabled);
            setIsRecruiting(false);
        } catch (error) {
            console.error(error);
            setIsRecruiting(false);
        }
    };

    useEffect(() => {
        checkRecruitmentStatus();
    }, []);

    useEffect(() => {
        if (!isRecruiting) {
            /* ✅ 모집 공고가 없을 때 사용 */
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

            /* ✅ 모집 공고가 있을 때 사용 */
            // confirmToast(
            //   "info",
            //   "지금은 모집 기간이 아니에요. 다음에 만나요!",
            //   () => {
            //     window.open("https://everytime.kr/418769/v/369933630", "_blank");
            //   },
            //   () => {
            //     router.push("/");
            //   },
            //   "모집공고 보러가기",
            //   "홈으로 가기"
            // );
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

    const handleCheckboxChange = (activity: "semina" | "dev" | "study" | "external"): void => {
        if (activity === "semina") {
            showToast("warn", "세미나는 필수 참여 항목이에요! 😊");
            return;
        }

        const isFormFilled =
            formData[activity] &&
            (() => {
                switch (activity) {
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
                    `${activityLabel} 활동을 취소하시겠습니까?\n작성해주신 내용이 사라질 수 있습니다.`,
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;

        setFormData((prev) => {
            if (name === "name") {
                return { ...prev, name: value };
            }

            if (name === "student_id") {
                return { ...prev, student_id: value };
            }

            if (name === "grade") {
                return { ...prev, grade: Number(value) };
            }

            if (name === "major") {
                let newValue = value;

                // 학과 두 글자 이상 입력했을 때만 자동 완성 실행
                if (newValue.length >= formData.major.length && newValue.length >= 2) {
                    const match = majors.find((major) => major.startsWith(newValue));

                    if (match) {
                        newValue = match;
                    }
                }

                setFormData((prev) => ({ ...prev, major: newValue }));
            }

            if (name === "phone_number") {
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

                return { ...prev, phone_number: formattedValue };
            }

            if (name === "motivation_semina") {
                return { ...prev, motivation_semina: value };
            }

            if (name === "motivation_study") {
                return { ...prev, motivation_study: value };
            }

            if (name === "motivation_external") {
                return { ...prev, motivation_external: value };
            }

            if (name === "github_profile") {
                return { ...prev, github_profile: value };
            }

            return { ...prev, [name]: value };
        });
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
            showToast("error", "학번을 다시 확인해주세요.");
            return false;
        }

        // 전화번호: 000-0000-0000 형식
        const phoneRegex = /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/;
        if (!phoneRegex.test(formData.phone_number)) {
            showToast("error", "전화번호를 다시 확인해주세요.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // (1) 체크박스(안내사항 동의) 확인
        if (!bothChecked) {
            showToast("error", "안내 사항을 모두 확인 및 동의해주세요.");
            return;
        }

        // (2) 필수값과 형식 검사
        if (!validateRequiredFields() || !validatePatterns()) return;

        // (3) 최소 하나의 활동을 선택했는지 확인
        if (!formData.semina && !formData.dev && !formData.study && !formData.external) {
            showToast("error", "하나 이상의 활동을 선택해주세요.");
            return;
        }

        // (4) 활동별 추가 유효성 검사
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

        const fd = new FormData();
        // 필수 정보
        fd.append("name", formData.name);
        fd.append("student_id", formData.student_id);
        fd.append("grade", String(formData.grade));
        fd.append("major", formData.major);
        fd.append("phone_number", formData.phone_number);

        fd.append("semina", String(formData.semina));
        fd.append("dev", String(formData.dev));
        fd.append("study", String(formData.study));
        fd.append("external", String(formData.external));

        if (formData.semina) {
            fd.append("motivation_semina", formData.motivation_semina);
        }

        if (formData.dev) {
            fd.append("field_dev", formData.field_dev);
            // 파일 전송
            if (formData.portfolio_pdf) {
                fd.append("portfolio_pdf", formData.portfolio_pdf);
            }
            fd.append("github_profile", formData.github_profile);
        }

        if (formData.study) {
            fd.append("motivation_study", formData.motivation_study);
        }

        if (formData.external) {
            fd.append("motivation_external", formData.motivation_external);
        }

        try {
            const response = await axios.post(`${BASE_URL}/recruit`, fd, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // 서버가 201 Created 등으로 성공 응답 시
            if (response.status === 201) {
                showToast("success", "신청이 완료되었습니다!");
                // 제출 후 폼 초기화
                // setFormData({
                //   name: "",
                //   student_id: "",
                //   grade: 1,
                //   major: "",
                //   phone_number: "",
                //   semina: true,
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
                // 서버에서 오는 에러에 대한 처리
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
                showToast("error", "신청 중 오류가 발생했습니다.");
                console.error(err);
            }
        }
    };
    return (
        <div
            className="p-8"
            onClick={() => {
                if (!isRecruiting)
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
                // confirmToast(
                //     "info",
                //     "지금은 모집 기간이 아니에요. 다음에 만나요!",
                //     () => {
                //         window.open("https://everytime.kr/418769/v/369933630", "_blank");
                //     },
                //     () => {
                //         router.push("/");
                //     },
                //     "모집공고 보러가기",
                //     "홈으로 가기"
                // );
            }}
        >
            <CMToast />
            <h2 className="font-firaCode p-0 md:p-6 w-full text-5xl md:text-6xl lg:text-7xl text-center relative cursor-pointer">
                <SlArrowLeft
                    onClick={() => router.push("/")}
                    className="absolute top-1/2 -translate-y-1/2  left-7 text-2xl"
                />
                Welcome!
            </h2>
            <motion.div
                className="min-h-screen max-w-[600px] mx-auto p-0 pt-6 md:p-6 flex flex-col items-center justify-around gap-10"
                ref={containerRef}
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                <div className="flex items-center gap-5">
                    <span className="text-3xl font-bold">{"{"}</span>
                    <div>
                        <p>
                            환영합니다! 지원서는{" "}
                            <span className="text-point">회비 납부 이후 제출</span>해주세요.
                        </p>
                        <p>회비: 25,000원</p>
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
                    <span className="text-3xl font-bold">{"}"}</span>
                </div>

                <form ref={formRef} className="w-full">
                    {/* 기본 정보 입력 영역 */}
                    <div className="space-y-6">
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
                            placeholder="전자전기컴퓨터공학부"
                            disabled={!isRecruiting}
                            VariantsDirection="right"
                        />
                        <motion.div className="flex flex-col" variants={textLineVariants("left")}>
                            <label className="mb-1 font-medium">학년</label>
                            <select
                                name="grade"
                                value={formData.grade}
                                onChange={handleChange}
                                disabled={!isRecruiting}
                                className="p-2 rounded-lg bg-[#F1F1F1] text-black disabled:cursor-not-allowed"
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </motion.div>
                        <InputField
                            label="학번"
                            name="student_id"
                            value={formData.student_id}
                            onChange={handleChange}
                            placeholder="2025440000"
                            disabled={!isRecruiting}
                            type="tel"
                            VariantsDirection="right"
                        />
                        <InputField
                            label="전화번호"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            placeholder="010-1234-5678"
                            disabled={!isRecruiting}
                        />
                    </div>

                    {/* 활동 선택 영역 */}
                    <motion.div className="mt-6" variants={textLineVariants("right")}>
                        <h3 className="font-semibold mb-2">
                            하고 싶은 활동을 선택하세요 (복수 선택 가능)
                        </h3>
                        <div className="flex flex-wrap gap-3" onClick={(e) => e.stopPropagation()}>
                            {activityOptions.map(({ label, value }) => (
                                <button
                                    type="button"
                                    key={value}
                                    onClick={() => handleCheckboxChange(value)}
                                    className={`py-2 px-5 rounded-lg ${
                                        formData[value as keyof RecruitFormData]
                                            ? "bg-[#6666ff] text-[#ffffff]"
                                            : "bg-[#F1F1F1] text-black"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* 선택한 활동에 따른 추가 폼 영역 */}
                    <div className="mt-6 space-y-4">
                        {formData.semina && (
                            <div className="border-b border-gray-300 p-4 rounded">
                                <h3 className="mb-2 font-semibold">세미나 활동</h3>
                                <InputField
                                    label="발표하고 싶은 주제 & 듣고 싶은 주제"
                                    name="motivation_semina"
                                    value={formData.motivation_semina}
                                    onChange={handleChange}
                                    placeholder="네트워크 관련 주제를 듣고 싶어요!"
                                    disabled={!isRecruiting}
                                />
                            </div>
                        )}

                        {formData.dev && (
                            <div className="border-b border-gray-300 p-4 rounded">
                                <h3 className="mb-2 font-semibold">개발 활동</h3>
                                <div className="flex flex-wrap gap-3">
                                    {["기획", "디자인", "프론트엔드", "백엔드"].map((field) => (
                                        <button
                                            type="button"
                                            key={field}
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    field_dev: field,
                                                }))
                                            }
                                            disabled={!isRecruiting}
                                            className={`p-2 rounded-lg ${
                                                formData.field_dev === field
                                                    ? "bg-[#6666ff] text-[#ffffff]"
                                                    : "bg-[#F1F1F1] text-black"
                                            } ${!isRecruiting ? "cursor-not-allowed" : ""}`}
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
                                        <label
                                            htmlFor="portfolio_upload"
                                            className="cursor-pointer bg-white px-4 py-1 rounded-lg shadow text-sm text-gray-700"
                                        >
                                            파일 선택
                                        </label>

                                        <input
                                            id="portfolio_upload"
                                            type="file"
                                            accept="application/pdf"
                                            onChange={handleFileChange}
                                            disabled={!isRecruiting}
                                            className="hidden"
                                        />

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
                                    placeholder="https://github.com/Quipu-Developers"
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
                                    placeholder="파이썬 스터디에 참여하고 싶어요!"
                                    disabled={!isRecruiting}
                                />
                            </div>
                        )}

                        {formData.external && (
                            <div className="border-b border-gray-300 p-4 rounded">
                                <h3 className="mb-2 font-semibold">대외 활동</h3>
                                <InputField
                                    label="참여하고 싶은 대외 활동"
                                    name="motivation_external"
                                    value={formData.motivation_external}
                                    onChange={handleChange}
                                    placeholder="해커톤에 나가고 싶어요!"
                                    disabled={!isRecruiting}
                                />
                            </div>
                        )}
                    </div>

                    {/* 안내 문구 및 동의 체크박스 영역 */}
                    <motion.div className="mt-8 space-y-2" variants={textLineVariants("right")}>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={checked1}
                                onChange={(e) => setChecked1(e.target.checked)}
                                disabled={!isRecruiting}
                                className="mr-2 disabled:cursor-not-allowed"
                            />
                            <span>제출 후 수정이 되지 않습니다</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={checked2}
                                onChange={(e) => setChecked2(e.target.checked)}
                                disabled={!isRecruiting}
                                className="mr-2 disabled:cursor-not-allowed"
                            />
                            <span>입력하신 정보가 정확한지 다시 한 번 확인해주세요</span>
                        </label>
                    </motion.div>
                </form>
                <motion.button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        if (formRef.current) {
                            handleSubmit(e);
                        }
                    }}
                    variants={textLineVariants("right")}
                    type="submit"
                    disabled={!isRecruiting || !bothChecked}
                    className={`mt-6 px-10 py-2 rounded-lg disabled:cursor-not-allowed ${
                        bothChecked ? "bg-[#6666ff] text-[#ffffff]" : "bg-[#F1F1F1] text-black"
                    }`}
                >
                    제출하기
                </motion.button>
            </motion.div>

            <Footer />
        </div>
    );
}

function InputField({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    disabled = false,
    VariantsDirection = "left",
}: InputField) {
    return (
        <motion.div className="flex flex-col mb-5" variants={textLineVariants(VariantsDirection)}>
            <label className="mb-1 font-medium">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className="p-2 rounded-lg bg-[#F1F1F1] text-black disabled:cursor-not-allowed 
                   focus:outline-none focus:ring-2 focus:ring-point"
            />
        </motion.div>
    );
}
