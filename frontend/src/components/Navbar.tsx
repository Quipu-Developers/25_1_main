import React from "react";
import styled from "styled-components";

interface Props {
  position: string;
  activeSection: string | null;
}

export default function Navbar({ position, activeSection }: Props) {
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={`w-full left-0 z-50 transition-all duration-300 ${position}`}
    >
      <div className="p-4 flex justify-around items-center gap-4 bg-[var(--background)]">
        {["home", "about", "activity", "technique", "interview", "recruit"].map(
          (section) => (
            <NavButton
              key={section}
              onClick={() => scrollToSection(section)}
              $isActive={activeSection === section}
            >
              {section}!
            </NavButton>
          )
        )}
      </div>
    </nav>
  );
}

const NavButton = styled.button<{ $isActive: boolean }>`
  font-size: 16px;
  color: ${(props) => (props.$isActive ? "var(--point)" : "black")};
  transition: color 0.2s ease-in-out;

  &:hover {
    color: var(--point);
  }

  @media (max-width: 900px) {
    &:nth-child(2),
    &:nth-child(4),
    &:nth-child(5) {
      display: none;
    }
  }
`;
