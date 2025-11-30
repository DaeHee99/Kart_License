"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Star } from "lucide-react";
import { TierType, TIERS } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface TierDistributionTableProps {
  tierDistribution: Record<TierType, number>;
  finalTier: TierType;
  totalMaps: number;
}

export function TierDistributionTable({
  tierDistribution,
  finalTier,
  totalMaps,
}: TierDistributionTableProps) {
  const isMobile = useIsMobile();

  // Helper function to get tier color hex (same as statistics page)
  const getTierColorHex = (tier: TierType): string => {
    const colorMap: Record<TierType, string> = {
      elite: "#ef4444", // 루비/레드 색상
      master: "#a855f7",
      diamond: "#3b82f6",
      platinum: "#06b6d4",
      gold: "#eab308",
      silver: "#94a3b8",
      bronze: "#d97706",
    };
    return colorMap[tier];
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.2 }}
    >
      <Card className="border-border/50 relative overflow-hidden border-2 p-6">
        {/* Subtle shimmer */}
        <motion.div
          className="via-primary/5 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
          animate={{ x: ["-200%", "200%"] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />

        <div className="relative">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Zap className="text-primary h-5 w-5" />
              선택한 군별 분포
            </h3>
            <Badge variant="secondary" className="font-mono">
              {totalMaps}개 맵
            </Badge>
          </div>

          <div className="border-border/50 space-y-0 overflow-hidden rounded-lg border">
            {/* Header Row */}
            <div
              className={`bg-muted/50 border-border/50 grid border-b ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}
            >
              <div className="text-muted-foreground px-4 py-2 text-xs font-medium">
                군
              </div>
              <div
                className={`text-muted-foreground px-4 py-2 text-xs font-medium ${isMobile ? "text-right" : "text-center"}`}
              >
                {isMobile ? "개수 (비율)" : "개수"}
              </div>
              {!isMobile && (
                <div className="text-muted-foreground px-4 py-2 text-right text-xs font-medium">
                  비율
                </div>
              )}
            </div>

            {/* Data Rows */}
            {(Object.keys(TIERS) as TierType[]).map((tierId, index) => {
              const tier = TIERS[tierId];
              const count = tierDistribution[tierId];
              const percentage =
                totalMaps > 0 ? Math.round((count / totalMaps) * 100) : 0;
              const tierColorHex = getTierColorHex(tierId);

              return (
                <motion.div
                  key={tierId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.45 + index * 0.03,
                    duration: 0.15,
                  }}
                  className={`border-border/50 hover:bg-primary/5 relative grid border-b transition-colors last:border-b-0 ${isMobile ? "grid-cols-2" : "grid-cols-3"}`}
                  style={{
                    backgroundColor: `${tierColorHex}10`,
                  }}
                >
                  {/* Progress bar background */}
                  <motion.div
                    className="absolute top-0 bottom-0 left-0 opacity-20"
                    style={{ backgroundColor: tierColorHex }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                      delay: 0.5 + index * 0.03,
                      duration: 0.3,
                    }}
                  />

                  <div className="relative z-10 flex items-center gap-2 px-4 py-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: tierColorHex }}
                    />
                    <span className="text-sm font-medium">{tier.nameKo}</span>
                    {finalTier === tierId && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.6 + index * 0.03,
                          duration: 0.15,
                        }}
                      >
                        <Star className="text-primary fill-primary h-3 w-3" />
                      </motion.div>
                    )}
                  </div>
                  <div
                    className={`relative z-10 px-4 py-3 ${isMobile ? "text-right" : "text-center"}`}
                  >
                    <span
                      className="font-mono text-sm font-bold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {isMobile ? `${count} (${percentage}%)` : count}
                    </span>
                  </div>
                  {!isMobile && (
                    <div className="relative z-10 px-4 py-3 text-right">
                      <span
                        className="font-mono text-sm font-bold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {percentage}%
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
