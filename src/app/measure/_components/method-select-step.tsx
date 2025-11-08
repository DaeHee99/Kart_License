"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Gauge,
  MousePointer2,
  KeyboardIcon,
  Sparkles,
  Zap,
  Trophy,
} from "lucide-react";
import { InputMethod } from "@/lib/types";
import { AnimatedBackground } from "./animated-background";
import { useRef } from "react";

interface MethodSelectStepProps {
  onMethodSelect: (method: InputMethod) => void;
}

export function MethodSelectStep({ onMethodSelect }: MethodSelectStepProps) {
  const methodParticles = useRef(
    Array.from({ length: 4 }, (_, i) => ({
      left: (i * 25 + 10) % 100,
      top: (i * 25 + 10) % 100,
      x: (i % 3) * 4 - 6,
      duration: 4 + (i % 2) * 2,
      delay: (i * 0.5) % 2,
    })),
  ).current;

  return (
    <div className="relative min-h-screen overflow-hidden px-4">
      <AnimatedBackground variant="method" particles={methodParticles} />

      <div className="relative z-10 mx-auto max-w-4xl pt-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-4 text-center">
            {/* Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <Card className="border-primary/20 from-background via-primary/5 to-background overflow-hidden border-2 bg-linear-to-br p-6">
                <div className="relative flex items-start gap-4">
                  {/* Icon */}
                  <motion.div
                    className="from-primary to-secondary flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br"
                    whileHover={{ scale: 1.05, rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Gauge className="h-7 w-7 text-white" />
                  </motion.div>

                  {/* Text Content */}
                  <div className="flex-1 text-left">
                    <h2 className="mb-1 text-xl font-bold">측정 방식 선택</h2>
                    <p className="text-muted-foreground text-sm">
                      편한 방식을 선택하여 기록을 입력하세요
                    </p>
                  </div>

                  {/* Decorative Sparkle */}
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="hidden sm:block"
                  >
                    <Sparkles className="text-primary h-5 w-5" />
                  </motion.div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="from-primary/20 to-secondary/20 border-primary/20 inline-flex items-center gap-2 rounded-full border bg-linear-to-r px-4 py-2 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Gauge className="text-primary h-4 w-4" />
              </motion.div>
              <span className="from-primary to-secondary bg-linear-to-r bg-clip-text text-sm font-medium text-transparent">
                실력 측정 시작하기
              </span>
            </motion.div>
          </div>

          {/* Options */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Tier Selection Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative"
            >
              {/* Glow effect */}
              <div className="from-primary/20 to-secondary/20 absolute -inset-1 rounded-xl bg-linear-to-r opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

              <Card
                className="hover:border-primary from-card via-card to-primary/5 relative cursor-pointer overflow-hidden border-2 bg-linear-to-br p-8 transition-all"
                onClick={() => onMethodSelect("button")}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="via-primary/10 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                />

                {/* Icon */}
                <motion.div
                  className="from-primary/20 to-secondary/20 relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <MousePointer2 className="text-primary h-8 w-8" />
                  </motion.div>
                </motion.div>

                <div className="relative space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-center text-lg font-bold">
                      군 선택 방식
                    </h3>
                    <Badge className="from-primary to-secondary border-0 bg-linear-to-r">
                      추천
                    </Badge>
                  </div>

                  <p className="text-muted-foreground line-clamp-2 min-h-10 text-center text-sm">
                    각 맵의 군별 기준 기록을 보고 자신의 수준에 맞는 군을
                    선택합니다.
                  </p>

                  <div className="text-primary flex items-center justify-center gap-2 pt-3 text-sm">
                    <Zap className="h-4 w-4" />
                    <span>빠르게 측정</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Manual Input Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative"
            >
              {/* Glow effect */}
              <div className="from-secondary/20 to-primary/20 absolute -inset-1 rounded-xl bg-linear-to-r opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

              <Card
                className="hover:border-primary from-card via-card to-secondary/5 relative cursor-pointer overflow-hidden border-2 bg-linear-to-br p-8 transition-all"
                onClick={() => onMethodSelect("manual")}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="via-secondary/10 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                />

                {/* Icon */}
                <motion.div
                  className="from-secondary/20 to-primary/20 relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  >
                    <KeyboardIcon className="text-secondary h-8 w-8" />
                  </motion.div>
                </motion.div>

                <div className="relative space-y-3">
                  <h3 className="text-center text-lg font-bold">
                    직접 입력 방식
                  </h3>

                  <p className="text-muted-foreground line-clamp-2 min-h-10 text-center text-sm">
                    각 맵의 정확한 기록을 직접 입력합니다.
                  </p>

                  <div className="text-secondary flex items-center justify-center gap-2 pt-3 text-sm">
                    <Trophy className="h-4 w-4" />
                    <span>정확한 측정</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
