import React from "react";

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
    <nav className={`w-full left-0 z-50 font-firaCode bg-white ${position}`}>
      <div className="p-4 flex justify-around">
        <button
          onClick={() => scrollToSection("home")}
          className="hover:text-[var(--point)]"
        >
          home!
        </button>
        <button
          onClick={() => scrollToSection("about")}
          className="hover:text-[var(--point)]"
        >
          about!
        </button>
        <button
          onClick={() => scrollToSection("activity")}
          className="hover:text-[var(--point)]"
        >
          activity!
        </button>
        <button
          onClick={() => scrollToSection("technique")}
          className="hover:text-[var(--point)]"
        >
          technique!
        </button>
        <button
          onClick={() => scrollToSection("interview")}
          className="hover:text-[var(--point)]"
        >
          interview!
        </button>
        <button
          onClick={() => scrollToSection("recruit")}
          className="hover:text-[var(--point)]"
        >
          recruit!
        </button>
      </div>
    </nav>
  );
}
