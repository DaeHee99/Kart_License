"use client";

import { useState, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "motion/react";
import {
  LogIn,
  UserPlus,
  Lock,
  User,
  Mail,
  Sparkles,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

// 프로필 아이콘 데이터
const PROFILE_ICONS = [
  { id: 1, emoji: "🐟", color: "#3b82f6" },
  { id: 2, emoji: "🎅", color: "#ef4444" },
  { id: 3, emoji: "🦊", color: "#f59e0b" },
  { id: 4, emoji: "🐧", color: "#0ea5e9" },
  { id: 5, emoji: "🦁", color: "#f97316" },
  { id: 6, emoji: "👄", color: "#ec4899" },
  { id: 7, emoji: "🐰", color: "#a855f7" },
  { id: 8, emoji: "🐧", color: "#06b6d4" },
  { id: 9, emoji: "🐸", color: "#22c55e" },
  { id: 10, emoji: "😎", color: "#10b981" },
  { id: 11, emoji: "🤓", color: "#eab308" },
  { id: 12, emoji: "😃", color: "#84cc16" },
  { id: 13, emoji: "😍", color: "#d946ef" },
  { id: 14, emoji: "😎", color: "#8b5cf6" },
  { id: 15, emoji: "🤡", color: "#f97316" },
  { id: 16, emoji: "👧", color: "#f43f5e" },
];

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") || "login") as "login" | "signup";

  const onLoginSuccess = () => {
    toast.success("로그인 성공!");
    router.push("/");
  };

  const onSignupSuccess = () => {
    toast.success("회원가입 성공!");
    router.push("/");
  };

  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);

  // 로그인 폼
  const [loginNickname, setLoginNickname] = useState("");
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // 회원가입 폼
  const [signupNickname, setSignupNickname] = useState("");
  const [signupId, setSignupId] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(1);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginId || !loginPassword) {
      toast.error("아이디와 비밀번호를 입력해주세요");
      return;
    }

    // Mock login
    toast.success("로그인되었습니다!");
    onLoginSuccess?.();
  };

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
    onSignupSuccess?.();
  };

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      {/* Animated Background */}
      <div className="from-primary/10 via-background to-secondary/10 absolute inset-0 bg-linear-to-br">
        <motion.div
          className="from-primary/20 to-secondary/20 absolute top-20 right-10 h-96 w-96 rounded-full bg-linear-to-br blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="from-secondary/20 to-primary/20 absolute bottom-20 left-10 h-80 w-80 rounded-full bg-linear-to-br blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.3, 0.4],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 px-4 py-6">
        <div className="mx-auto max-w-md space-y-6">
          {/* Header */}
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

          {/* Tab Buttons */}
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

          {/* Forms */}
          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
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
                      transition={{ duration: 0.2, delay: 0.05 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="login-nickname"
                        className="flex items-center gap-2"
                      >
                        <Sparkles className="text-primary h-4 w-4" />
                        닉네임
                      </Label>
                      <Input
                        id="login-nickname"
                        type="text"
                        placeholder="닉네임을 입력하세요"
                        value={loginNickname}
                        onChange={(e) => setLoginNickname(e.target.value)}
                        className="focus:border-primary/50 hover:border-primary/30 h-12 border-2 pr-4 pl-4 transition-all"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="login-id"
                        className="flex items-center gap-2"
                      >
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
                      <Label
                        htmlFor="login-password"
                        className="flex items-center gap-2"
                      >
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
                        className="from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group relative h-12 w-full overflow-hidden bg-linear-to-r"
                      >
                        <motion.div
                          className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.5 }}
                        />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <LogIn className="h-4 w-4" />
                          로그인
                        </span>
                      </Button>
                    </motion.div>
                  </form>
                </Card>
              </motion.div>
            ) : (
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
                      <Label
                        htmlFor="signup-id"
                        className="flex items-center gap-2"
                      >
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
                        onChange={(e) =>
                          setSignupPasswordConfirm(e.target.value)
                        }
                        className="focus:border-primary/50 hover:border-primary/30 h-12 border-2 pr-4 pl-4 transition-all"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.25 }}
                      className="space-y-3"
                    >
                      <Label className="flex items-center gap-2">
                        <Sparkles className="text-secondary h-4 w-4" />
                        프로필 사진 (원하는 프로필을 하나 선택해주세요)
                      </Label>

                      <div className="grid grid-cols-8 gap-2">
                        {PROFILE_ICONS.map((icon, index) => (
                          <motion.button
                            key={icon.id}
                            type="button"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.2,
                              delay: 0.25 + index * 0.02,
                              type: "spring",
                              stiffness: 200,
                            }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedProfile(icon.id)}
                            className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-lg text-2xl transition-all ${
                              selectedProfile === icon.id
                                ? "ring-primary ring-offset-background ring-2 ring-offset-2"
                                : "hover:ring-primary/50 hover:ring-offset-background hover:ring-2 hover:ring-offset-2"
                            }`}
                            style={{ backgroundColor: `${icon.color}30` }}
                          >
                            {selectedProfile === icon.id && (
                              <motion.div
                                layoutId="selectedProfile"
                                className="bg-primary/10 absolute inset-0"
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 30,
                                }}
                              />
                            )}
                            <span className="relative z-10">{icon.emoji}</span>
                            {selectedProfile === icon.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full"
                              >
                                <Check className="text-primary-foreground h-3 w-3" />
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

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
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-muted-foreground">로딩 중...</div>
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
