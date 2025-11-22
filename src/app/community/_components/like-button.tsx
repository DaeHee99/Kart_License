"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  onToggle: () => void;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export function LikeButton({
  isLiked,
  likeCount,
  onToggle,
  isLoading = false,
  size = "md",
  showCount = true,
}: LikeButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; angle: number }>>([]);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = () => {
    if (isLoading) return;

    // 모바일 진동
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([10, 5, 10]);
    }

    // 좋아요 추가 시에만 파티클 애니메이션
    if (!isLiked) {
      setIsAnimating(true);

      // 파티클 생성
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        angle: (i * 360) / 8,
      }));
      setParticles(newParticles);

      setTimeout(() => {
        setIsAnimating(false);
        setParticles([]);
      }, 600);
    }

    onToggle();
  };

  return (
    <div className="relative inline-flex items-center gap-1.5">
      {/* 파티클 효과 */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              opacity: 1,
              scale: 0,
              x: 0,
              y: 0,
            }}
            animate={{
              opacity: 0,
              scale: 1,
              x: Math.cos((particle.angle * Math.PI) / 180) * 30,
              y: Math.sin((particle.angle * Math.PI) / 180) * 30,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500"
          />
        ))}
      </AnimatePresence>

      {/* 좋아요 버튼 */}
      <motion.button
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          "group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors",
          "hover:bg-red-50 dark:hover:bg-red-950/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isLiked && "bg-red-50 dark:bg-red-950/20"
        )}
        whileTap={!isLoading ? { scale: 0.9 } : {}}
      >
        {/* 좋아요 아이콘 */}
        <motion.div
          animate={
            isAnimating
              ? {
                  scale: [1, 1.4, 1],
                  rotate: [0, -10, 10, -10, 0],
                }
              : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative"
        >
          <Heart
            className={cn(
              sizeClasses[size],
              "transition-colors duration-200",
              isLiked
                ? "fill-red-500 text-red-500"
                : "text-muted-foreground group-hover:text-red-500"
            )}
          />

          {/* 하트 빛나는 효과 */}
          {isLiked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.5] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-red-500/30 blur-md"
            />
          )}
        </motion.div>

        {/* 좋아요 수 */}
        {showCount && (
          <AnimatePresence mode="wait">
            <motion.span
              key={likeCount}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "text-sm font-medium tabular-nums",
                isLiked ? "text-red-500" : "text-muted-foreground"
              )}
            >
              {likeCount}
            </motion.span>
          </AnimatePresence>
        )}
      </motion.button>
    </div>
  );
}
