"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";

interface Props {
  position: string;
  activeSection: string | null;
}

const SECTIONS = [
  "home",
  "about",
  "activity",
  "technique",
  "interview",
  "recruit",
] as const;
const MOBILE_TOP_SECTIONS = ["home", "about", "activity"] as const;
const MOBILE_BOTTOM_SECTIONS = ["technique", "interview", "recruit"] as const;

export default function Navbar({ position, activeSection }: Props) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile === null) return null;

  const visibleSections = isMobile ? MOBILE_TOP_SECTIONS : SECTIONS;

  return (
    <>
      {/* Desktop / Mobile Top Nav */}
      <DesktopNav
        className={`w-full left-0 z-50 transition-all duration-300 ${position}`}
      >
        <div className="p-4 h-[50px] flex justify-around items-center gap-4 bg-[var(--background)]">
          {visibleSections.map((section) => (
            <NavButton
              key={section}
              $section={section}
              $isActive={activeSection === section}
              onClick={() => scrollToSection(section)}
            >
              {section === "recruit" ? (
                <>
                  <span className="text-[--point] text-2xl font-semibold">
                    {"{"}&nbsp;
                  </span>
                  {"recruit!"}
                  <span className="text-[--point] text-2xl font-semibold">
                    &nbsp;{"}"}
                  </span>
                </>
              ) : (
                `${section}!`
              )}
            </NavButton>
          ))}
        </div>
      </DesktopNav>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav
        $activeSection={activeSection}
        className="hidden w-full h-[50px] p-4 z-50 justify-around items-center gap-4 bg-[var(--background)] fixed bottom-0"
      >
        {MOBILE_BOTTOM_SECTIONS.map((section) => (
          <NavButton
            key={section}
            $section={section}
            $isActive={activeSection === section}
            onClick={() => scrollToSection(section)}
          >
            {section === "recruit" ? (
              <>
                <span className="text-[--point] text-2xl font-semibold">
                  {"{"}&nbsp;
                </span>
                {"recruit!"}
                <span className="text-[--point] text-2xl font-semibold">
                  &nbsp;{"}"}
                </span>
              </>
            ) : (
              `${section}!`
            )}
          </NavButton>
        ))}
      </MobileBottomNav>
    </>
  );
}

const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    window.scrollTo({
      top: section.offsetTop,
      behavior: "smooth",
    });
  }
};

const DesktopNav = styled.nav``;

const NavButton = styled.button<{
  $section:
    | "home"
    | "about"
    | "activity"
    | "technique"
    | "interview"
    | "recruit";
  $isActive: boolean;
}>`
  display: inline-block;
  align-items: center;
  font-size: 16px;
  letter-spacing: 0.5px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  will-change: transform;

  ${(props) =>
    props.$section === "recruit"
      ? css`
          font-size: 1.5rem;
          &:hover {
            letter-spacing: 2px;
          }
        `
      : css`
          &:hover {
            color: var(--point);
          }
        `}
`;

const MobileBottomNav = styled.nav<{ $activeSection: string | null }>`
  @media (max-width: 900px) {
    display: ${(props) => (props.$activeSection !== "home" ? "flex" : "none")};
  }
`;
