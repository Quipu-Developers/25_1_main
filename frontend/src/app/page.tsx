"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Home from "@/components/sections/Home";
import About from "@/components/sections/About";
import Activity from "@/components/sections/Activity";
import Technique from "@/components/sections/Technique";
import Interview from "@/components/sections/Interview";
import Recruit from "@/components/sections/Recruit";

export default function MainPage() {
  const [navPosition, setNavPosition] = useState("bottom-0");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    function setScreenSize() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    setScreenSize();
    window.addEventListener("resize", setScreenSize);

    return () => window.removeEventListener("resize", setScreenSize);
  }, []);

  useEffect(() => {
    const sections = [
      "home",
      "about",
      "activity",
      "technique",
      "interview",
      "recruit",
    ];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const homeSection = document.getElementById("home");
      const homeHeight = homeSection?.offsetHeight || 0;

      if (scrollY < homeHeight - 70) {
        setNavPosition("absolute bottom-0");
      } else {
        setNavPosition("fixed top-0");
      }

      // 현재 섹션 감지
      let currentSection = null;
      for (const id of sections) {
        const section = document.getElementById(id);
        if (section) {
          const { top, bottom } = section.getBoundingClientRect();
          if (
            top <= window.innerHeight * 0.5 &&
            bottom >= window.innerHeight * 0.5
          ) {
            currentSection = id;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      <section id="home" className="relative h-full">
        <Home />
        <Navbar position={navPosition} activeSection={activeSection} />
      </section>
      <section id="about" className="relative h-full">
        <About />
      </section>
      <section id="activity" className="relative h-full">
        <Activity />
      </section>
      <section id="technique" className="relative h-full">
        <Technique />
      </section>
      <section id="interview" className="relative h-full">
        <Interview />
      </section>
      <section id="recruit" className="relative h-full">
        <Recruit />
      </section>
    </div>
  );
}
