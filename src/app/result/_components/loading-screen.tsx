"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

interface LoadingScreenProps {
  /** 로딩 애니메이션 지속 시간 (ms) */
  duration?: number;
  /** 애니메이션 완료 시 호출되는 콜백 */
  onComplete?: () => void;
}

export function LoadingScreen({
  duration = 2500,
  onComplete,
}: LoadingScreenProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      const cycleMs = 600;
      const count = Math.ceil(duration / cycleMs);
      const pattern = Array.from({ length: count }, () => [50, 550]).flat();
      navigator.vibrate(pattern);

      return () => {
        navigator.vibrate(0);
      };
    }
  }, [duration]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden pb-24">
      {/* Animated Background */}
      <div className="from-primary/10 via-background to-secondary/10 absolute inset-0 bg-linear-to-br">
        <motion.div
          className="bg-primary/20 absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="bg-secondary/20 absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full blur-3xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 space-y-6 text-center"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.8, repeat: Infinity },
          }}
        >
          <Sparkles className="text-primary mx-auto h-16 w-16" />
        </motion.div>
        <div>
          <h3 className="text-foreground font-bold">군을 계산하고 있어요...</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            잠시만 기다려주세요
          </p>
        </div>
        {/* CSS transition 대신 framer-motion으로 부드러운 프로그레스 바 */}
        <div className="bg-primary/20 relative mx-auto h-2 w-64 overflow-hidden rounded-full">
          <motion.div
            className="bg-primary absolute inset-y-0 left-0 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: duration / 1000,
              ease: "easeInOut",
            }}
            onAnimationComplete={() => onCompleteRef.current?.()}
          />
        </div>
      </motion.div>
    </div>
  );
}
