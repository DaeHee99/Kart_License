"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn, Lock, User } from "lucide-react";
import { useState } from "react";
import { useLogin } from "@/hooks/use-auth";

export function LoginForm() {
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { mutate: login, isPending } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    login({
      id: loginId,
      password: loginPassword,
    });
  };

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-border/50 relative overflow-hidden border-2 p-6">
        <motion.div
          className="via-primary/5 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
          animate={{ x: ["-200%", "200%"] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />

        <form onSubmit={handleLogin} className="relative space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="login-id" className="flex items-center gap-2">
              <User className="text-primary h-4 w-4" />
              아이디
            </Label>
            <div className="group relative">
              <Input
                id="login-id"
                type="text"
                placeholder="아이디를 입력하세요"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                disabled={isPending}
                className="focus:border-primary/50 group-hover:border-primary/30 h-12 border-2 pr-4 pl-4 transition-all"
              />
              <motion.div
                className="border-primary pointer-events-none absolute inset-0 rounded-md border-2"
                initial={{ opacity: 0, scale: 0.95 }}
                whileFocus={{ opacity: 0.3, scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
            className="space-y-2"
          >
            <Label htmlFor="login-password" className="flex items-center gap-2">
              <Lock className="text-primary h-4 w-4" />
              비밀번호
            </Label>
            <div className="group relative">
              <Input
                id="login-password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                disabled={isPending}
                className="focus:border-primary/50 group-hover:border-primary/30 h-12 border-2 pr-4 pl-4 transition-all"
              />
              <motion.div
                className="border-primary pointer-events-none absolute inset-0 rounded-md border-2"
                initial={{ opacity: 0, scale: 0.95 }}
                whileFocus={{ opacity: 0.3, scale: 1 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <Button
              type="submit"
              disabled={isPending}
              className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group relative h-12 w-full overflow-hidden bg-linear-to-r disabled:opacity-50"
            >
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <LogIn className="h-4 w-4" />
                {isPending ? "로그인 중..." : "로그인"}
              </span>
            </Button>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  );
}
