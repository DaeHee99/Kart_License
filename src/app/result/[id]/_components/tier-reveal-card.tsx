"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { TierBadge } from "@/components/tier-badge";
import { TrendingUp } from "lucide-react";
import { TierType, TIERS } from "@/lib/types";

interface TierRevealCardProps {
  finalTier: TierType;
  insights: string;
}

export function TierRevealCard({ finalTier, insights }: TierRevealCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Card className="border-primary/20 from-card via-card to-primary/5 relative overflow-hidden border-2 bg-linear-to-br p-8 shadow-2xl">
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

        <div className="relative space-y-6 text-center">
          {/* Tier Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              duration: 0.4,
            }}
          >
            <div className="relative inline-block">
              {/* Glow effect */}
              <motion.div
                className={`absolute inset-0 bg-linear-to-br ${TIERS[finalTier].color} rounded-full opacity-50 blur-2xl`}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <TierBadge tier={finalTier} size="xl" showLabel={false} animate />
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.2 }}
            className="space-y-3"
          >
            <h1 className="text-4xl font-bold md:text-5xl">
              당신은{" "}
              <span
                className="font-bold"
                style={{ color: `var(--${TIERS[finalTier].color})` }}
              >
                {TIERS[finalTier].nameKo}
              </span>
              입니다!
            </h1>
            <p className="text-muted-foreground text-lg">
              {TIERS[finalTier].description}
            </p>
          </motion.div>

          {/* Insights Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.2 }}
            className="from-primary/20 to-secondary/20 border-primary/20 inline-flex items-center gap-2 rounded-full border bg-linear-to-r px-6 py-3 backdrop-blur-sm"
          >
            <TrendingUp className="text-primary h-4 w-4" />
            <span className="text-sm font-medium">{insights}</span>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
