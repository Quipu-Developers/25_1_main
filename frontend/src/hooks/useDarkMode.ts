import { useEffect, useState } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const matchDark = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(matchDark.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    matchDark.addEventListener("change", handleChange);
    return () => matchDark.removeEventListener("change", handleChange);
  }, []);

  return isDark;
}
