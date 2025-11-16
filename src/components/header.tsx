"use client";

import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface HeaderProps {
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export function Header({ showMenu, onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // hydration mismatch 방지를 위해 클라이언트에서만 테마 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";

  const handleToggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <header className="bg-card/80 border-border fixed top-0 right-0 left-0 z-50 h-14 border-b backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {showMenu && onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <motion.h1
            className="from-primary to-secondary cursor-pointer bg-linear-to-r bg-clip-text font-bold text-transparent select-none"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleLogoClick}
          >
            카러플 군 계산기
          </motion.h1>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleTheme}
          className="rounded-full"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isDark ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDark ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </motion.div>
        </Button>
      </div>
    </header>
  );
}
