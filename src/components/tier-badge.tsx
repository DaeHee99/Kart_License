"use client";

import { TIERS, TierType } from "@/lib/types";
import { Trophy, Award, Diamond, Gem, Crown, Shield, Star } from "lucide-react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface TierBadgeProps {
  tier: TierType;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  animate?: boolean;
}

export function TierBadge({
  tier,
  size = "md",
  showLabel = true,
  animate = false,
}: TierBadgeProps) {
  const tierData = TIERS[tier];

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-12 h-12 text-sm",
    lg: "w-20 h-20 text-base",
    xl: "w-32 h-32 text-2xl",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-6 h-6",
    lg: "w-10 h-10",
    xl: "w-16 h-16",
  };

  const icons: Record<TierType, LucideIcon> = {
    elite: Crown,
    master: Trophy,
    diamond: Diamond,
    platinum: Gem,
    gold: Award,
    silver: Shield,
    bronze: Star,
  };

  const Icon = icons[tier];

  // For sm size, only render icon without container
  if (size === "sm" && !showLabel) {
    return <Icon className={`${iconSizes[size]}`} />;
  }

  const badge = (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeClasses[size]} ${tierData.color} relative flex items-center justify-center overflow-hidden rounded-full text-white shadow-lg`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <Icon className={`${iconSizes[size]} relative z-10`} />
      </div>
      {showLabel && (
        <span className="text-center font-medium">{tierData.nameKo}</span>
      )}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          duration: 0.6,
        }}
      >
        {badge}
      </motion.div>
    );
  }

  return badge;
}
