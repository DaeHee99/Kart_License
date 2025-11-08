"use client";

import { motion } from "motion/react";
import { TIERS, TierType } from "@/lib/types";

interface TierStatsTableProps {
  title: string;
  stats: Record<TierType, number>;
  getTierColorHex: (tier: TierType) => string;
}

export function TierStatsTable({
  title,
  stats,
  getTierColorHex,
}: TierStatsTableProps) {
  const totalCount = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <h4 className="text-muted-foreground text-sm font-medium">{title}</h4>

      <div className="border-border/50 space-y-0 overflow-hidden rounded-lg border">
        <div className="bg-muted/50 border-border/50 grid grid-cols-2 border-b">
          <div className="text-muted-foreground px-4 py-2 text-xs font-medium">
            군
          </div>
          <div className="text-muted-foreground px-4 py-2 text-right text-xs font-medium">
            인원
          </div>
        </div>

        {(Object.keys(TIERS) as TierType[]).map((tierId, index) => {
          const tier = TIERS[tierId];
          const count = stats[tierId];
          const percentage = Math.round((count / totalCount) * 100);
          const tierColorHex = getTierColorHex(tierId);

          return (
            <motion.div
              key={tierId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.15,
                delay: index * 0.03,
              }}
              className="border-border/50 hover:bg-primary/5 relative grid grid-cols-2 border-b transition-colors last:border-b-0"
              style={{
                backgroundColor: `${tierColorHex}10`,
              }}
            >
              <motion.div
                className="absolute top-0 bottom-0 left-0 opacity-20"
                style={{ backgroundColor: tierColorHex }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.03 + 0.1,
                }}
              />

              <div className="relative z-10 flex items-center gap-2 px-4 py-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: tierColorHex }}
                />
                <span className="text-sm font-medium">{tier.nameKo}</span>
              </div>
              <div className="relative z-10 px-4 py-3 text-right">
                <span
                  className="font-mono text-sm font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {count.toLocaleString()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
