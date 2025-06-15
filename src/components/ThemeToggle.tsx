
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

function isDark() {
  return (
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export default function ThemeToggle() {
  const [dark, setDark] = React.useState(() => isDark());

  React.useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const toggleTheme = () => setDark((v) => !v);

  return (
    <Button
      aria-label="Toggle theme"
      variant="outline"
      size="icon"
      className="absolute top-4 right-4 z-50 rounded-full shadow hover-scale"
      onClick={toggleTheme}
    >
      {dark ? <Sun className="text-yellow-500" /> : <Moon className="text-blue-700" />}
    </Button>
  );
}
