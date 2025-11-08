"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { AnimatedBackground } from "./_components/animated-background";
import { AuthHeader } from "./_components/auth-header";
import { TabButtons } from "./_components/tab-buttons";
import { LoginForm } from "./_components/login-form";
import { SignupForm } from "./_components/signup-form";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

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
