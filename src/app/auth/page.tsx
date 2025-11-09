"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { AnimatedBackground } from "./_components/animated-background";
import { AuthHeader } from "./_components/auth-header";
import { TabButtons } from "./_components/tab-buttons";
import { LoginForm } from "./_components/login-form";
import { SignupForm } from "./_components/signup-form";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  // URL 쿼리 파라미터로 탭 초기화
  useEffect(() => {
    if (tabParam === "login" || tabParam === "signup") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      <AnimatedBackground />

      <div className="relative z-10 px-4 py-6">
        <div className="mx-auto max-w-md space-y-6">
          <AuthHeader activeTab={activeTab} />
          <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
          <AnimatePresence mode="wait">
            {activeTab === "login" ? <LoginForm /> : <SignupForm />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
