'use client';

import { Moon, Sun, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  showMenu?: boolean;
  onMenuClick?: () => void;
}

export function Header({ showMenu, onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const isDark = theme === 'dark';

  const handleToggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleLogoClick = () => {
    router.push('/');
  };
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-card/80 backdrop-blur-md border-b border-border z-50">
      <div className="flex items-center justify-between h-full px-4 max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2">
          {showMenu && onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          <motion.h1
            className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cursor-pointer"
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
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </motion.div>
        </Button>
      </div>
    </header>
  );
}