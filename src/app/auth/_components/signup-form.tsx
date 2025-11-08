"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserPlus, Lock, User, Sparkles } from "lucide-react";
import { ProfileIconSelector } from "./profile-icon-selector";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const router = useRouter();
  const [signupNickname, setSignupNickname] = useState("");
  const [signupId, setSignupId] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(1);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !signupNickname ||
      !signupId ||
      !signupPassword ||
      !signupPasswordConfirm
    ) {
      toast.error("모든 필드를 입력해주세요");
      return;
    }

    if (signupPassword !== signupPasswordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다");
      return;
    }

    if (!agreeTerms) {
      toast.error("약관에 동의해주세요");
      return;
    }

    // Mock signup
    toast.success("회원가입이 완료되었습니다!");
    router.push("/");
  };

  return (
    <motion.div
      key="signup"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-border/50 relative overflow-hidden border-2 p-6">
        <motion.div
          className="via-secondary/5 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
          animate={{ x: ["-200%", "200%"] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />

        <form onSubmit={handleSignup} className="relative space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="space-y-2"
          >
            <Label
              htmlFor="signup-nickname"
              className="flex items-center gap-2"
            >
              <Sparkles className="text-primary h-4 w-4" />
              닉네임
            </Label>
            <Input
              id="signup-nickname"
              type="text"
              placeholder="닉네임을 입력하세요"
              value={signupNickname}
              onChange={(e) => setSignupNickname(e.target.value)}
              className="focus:border-primary/50 hover:border-primary/30 h-12 border-2 pr-4 pl-4 transition-all"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="signup-id" className="flex items-center gap-2">
              <User className="text-primary h-4 w-4" />
              아이디
            </Label>
            <Input
              id="signup-id"
              type="text"
              placeholder="아이디를 입력하세요"
              value={signupId}
              onChange={(e) => setSignupId(e.target.value)}
              className="focus:border-primary/50 hover:border-primary/30 h-12 border-2 pr-4 pl-4 transition-all"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
            className="space-y-2"
          >
            <Label
              htmlFor="signup-password"
              className="flex items-center gap-2"
            >
              <Lock className="text-primary h-4 w-4" />
              비밀번호
            </Label>
            <Input
              id="signup-password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="focus:border-primary/50 hover:border-primary/30 h-12 border-2 pr-4 pl-4 transition-all"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            className="space-y-2"
          >
            <Label
              htmlFor="signup-password-confirm"
              className="flex items-center gap-2"
            >
              <Lock className="text-primary h-4 w-4" />
              비밀번호 확인
            </Label>
            <Input
              id="signup-password-confirm"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={signupPasswordConfirm}
              onChange={(e) => setSignupPasswordConfirm(e.target.value)}
              className="focus:border-primary/50 hover:border-primary/30 h-12 border-2 pr-4 pl-4 transition-all"
            />
          </motion.div>

          <ProfileIconSelector
            selectedProfile={selectedProfile}
            setSelectedProfile={setSelectedProfile}
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
            className="bg-muted/50 hover:bg-muted flex items-center gap-2 rounded-lg p-4 transition-colors"
          >
            <Checkbox
              id="agree-terms"
              checked={agreeTerms}
              onCheckedChange={(checked: boolean) =>
                setAgreeTerms(checked as boolean)
              }
              className="border-2"
            />
            <Label
              htmlFor="agree-terms"
              className="flex-1 cursor-pointer text-sm"
            >
              약관에 모두 동의합니다
            </Label>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.35 }}
          >
            <Button
              type="submit"
              className="from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 group relative h-12 w-full overflow-hidden bg-linear-to-r"
            >
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                <UserPlus className="h-4 w-4" />
                회원가입
              </span>
            </Button>
          </motion.div>
        </form>
      </Card>
    </motion.div>
  );
}
