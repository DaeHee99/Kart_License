"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

interface TabButtonsProps {
  activeTab: "login" | "signup";
  setActiveTab: (tab: "login" | "signup") => void;
}

export function TabButtons({ activeTab, setActiveTab }: TabButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="grid grid-cols-2 gap-3"
    >
      <Button
        variant={activeTab === "login" ? "default" : "outline"}
        onClick={() => setActiveTab("login")}
        className="group relative h-12 overflow-hidden"
      >
        {activeTab === "login" && (
          <motion.div
            layoutId="activeTab"
            className="from-primary to-primary/80 absolute inset-0 bg-linear-to-r"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          로그인
        </span>
      </Button>

      <Button
        variant={activeTab === "signup" ? "default" : "outline"}
        onClick={() => setActiveTab("signup")}
        className="group relative h-12 overflow-hidden"
      >
        {activeTab === "signup" && (
          <motion.div
            layoutId="activeTab"
            className="from-primary to-primary/80 absolute inset-0 bg-linear-to-r"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          회원가입
        </span>
      </Button>
    </motion.div>
  );
}
