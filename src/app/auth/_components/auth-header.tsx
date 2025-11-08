"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { LogIn, UserPlus } from "lucide-react";

interface AuthHeaderProps {
  activeTab: "login" | "signup";
}

export function AuthHeader({ activeTab }: AuthHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="from-primary/10 via-primary/5 absolute inset-0 -z-10 rounded-2xl bg-linear-to-r to-transparent blur-3xl" />
      <Card className="border-primary/20 relative overflow-hidden border-2 p-6">
        <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl" />
        <div className="bg-secondary/5 pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full blur-3xl" />

        <div className="relative flex items-start gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="from-primary to-primary/60 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br shadow-lg"
          >
            {activeTab === "login" ? (
              <LogIn className="text-primary-foreground h-7 w-7" />
            ) : (
              <UserPlus className="text-primary-foreground h-7 w-7" />
            )}
          </motion.div>

          <div className="flex-1">
            <motion.h1
              className="mb-1 text-2xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              {activeTab === "login" ? "로그인" : "회원가입"}
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {activeTab === "login"
                ? "계정에 로그인하세요"
                : "새로운 계정을 만드세요"}
            </motion.p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
