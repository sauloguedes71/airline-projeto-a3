import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ToggleTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        rounded-full p-3 
        bg-white/20 dark:bg-white/10 
        backdrop-blur-md 
        shadow-lg shadow-black/30 
        hover:bg-white/30 
        transition-all duration-300 
        hover:scale-110 active:scale-95
      "
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-white" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-300" />
      )}
    </button>
  );
}
