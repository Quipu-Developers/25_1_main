import React from "react";
import styled from "styled-components";

interface Props {
  position: string;
}

export default function Navbar({ position }: Props) {
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
    <NavWrapper className={position}>
      <NavContainer>
        <NavButton onClick={() => scrollToSection("home")}>home!</NavButton>
        <NavButton onClick={() => scrollToSection("about")}>about!</NavButton>
        <NavButton onClick={() => scrollToSection("activity")}>
          activity!
        </NavButton>
        <NavButton onClick={() => scrollToSection("technique")}>
          technique!
        </NavButton>
        <NavButton onClick={() => scrollToSection("interview")}>
          interview!
        </NavButton>
        <NavButton onClick={() => scrollToSection("recruit")}>
          recruit!
        </NavButton>
      </NavContainer>
    </NavWrapper>
  );
}

const NavWrapper = styled.nav`
  width: 100%;
  left: 0;
  z-index: 50;
  font-family: var(--font-fira-code);
  background: white;
  transition: all 0.3s;
`;

const NavContainer = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
`;

const NavButton = styled.button`
  font-size: 1rem;
  color: black;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: var(--point);
  }

  @media (max-width: 900px) {
    &:nth-child(1),
    &:nth-child(4),
    &:nth-child(5) {
      display: none;
    }
  }
`;
