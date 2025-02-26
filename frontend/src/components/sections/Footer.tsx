"use client";

import { useRouter } from "next/navigation";
import { AiFillInstagram, AiFillMail, AiFillGithub } from "react-icons/ai";

export default function Footer() {
  const router = useRouter();
  return (
    <footer className="justify-end w-full text-[#898989] pt-[200px]">
      <div>
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-10">
          <div className="text-sm space-y-1">
            <p>회장 이예나 010-4279-9940</p>
            <p>부회장 이제민 010-9676-1452</p>
            <p>총무 김예영 010-4390-9866</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <svg
              width="100px"
              viewBox="-50 -50 768 757"
              className="overflow-visible mb-4 cursor-pointer"
              onClick={() => {
                router.push("/");
              }}
            >
              <use href={`/assets/logo.svg#left-part`} />
              <use href={`/assets/logo.svg#right-part`} />
              <use href={`/assets/logo.svg#bottom-part`} fill="#6666FF" />
            </svg>
            <h2 className="font-medium">
              University of Seoul Computer Club QUIPU
            </h2>
          </div>

          <div className="text-sm space-y-1 text-end">
            <p className="underline">
              <a
                href="https://quipu-developers.github.io/24_2_main/"
                target="_blank"
              >
                QUIPU Main Website 2024 ver.
              </a>
            </p>
            <p className="underline">
              <a href="" target="_blank">
                QUIPU Main Website 2025 ver.
              </a>
            </p>
            <p>동아리방 | 서울시립대학교 학생회관 342호</p>
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-3">
            <a
              href="https://www.instagram.com/uos_quipu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <AiFillInstagram size={24} />
            </a>
            <a
              href="mailto:quipu0316@gmail.com"
              aria-label="Send email to QUIPU"
            >
              <AiFillMail size={24} />
            </a>
            <a
              href="https://github.com/Quipu-Developers"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <AiFillGithub size={24} />
            </a>
          </div>

          <p className="text-xs md:text-sm text-gray-500">
            Copyright 2025.QUIPU. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
