"use client";

import { Home, Users, BarChart3, FileText, User } from "lucide-react";
import { motion } from "motion/react";
import { useRouter, usePathname } from "next/navigation";

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const navItems = [
    { id: "/", label: "홈", icon: Home },
    { id: "/community", label: "커뮤니티", icon: Users },
    { id: "/measure", label: "측정", icon: BarChart3 },
    { id: "/records", label: "기록표", icon: FileText },
    { id: "/mypage", label: "마이", icon: User },
  ];

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const isHidden = pathname === "/measure";

  return (
    <motion.nav
      className={`bg-card border-border safe-area-bottom fixed right-0 bottom-0 left-0 z-50 border-t ${isHidden ? "pointer-events-none" : ""}`}
      initial={false}
      animate={{
        y: isHidden ? "100%" : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      aria-hidden={isHidden}
      inert={isHidden ? true : undefined}
    >
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className="relative flex h-full flex-1 flex-col items-center justify-center gap-1"
            >
              <motion.div whileTap={{ scale: 0.9 }} className="relative">
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="bg-primary absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
              <span
                className={`text-xs ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
