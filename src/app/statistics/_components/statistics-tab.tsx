"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { TierType } from "@/lib/types";
import { TierStatsTable } from "./tier-stats-table";

export function StatisticsTab() {
  // Mock data for full statistics
  const cumulativeStats = {
    elite: 4047,
    master: 15955,
    diamond: 24740,
    platinum: 27030,
    gold: 22866,
    silver: 12070,
    bronze: 12989,
  };

  const userDistributionStats = {
    elite: 178,
    master: 384,
    diamond: 733,
    platinum: 931,
    gold: 1002,
    silver: 768,
    bronze: 3447,
  };

  // Helper function to get tier color hex
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
    <Card className="border-border/50 relative overflow-hidden border-2 p-6">
      <motion.div
        className="via-secondary/5 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
        animate={{ x: ["-200%", "200%"] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />

      <div className="relative space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="text-secondary h-5 w-5" />
            <h3 className="text-xl font-bold">전체 유저 기록 통계</h3>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 누적 측정 결과 */}
          <TierStatsTable
            title="누적 측정 결과"
            stats={cumulativeStats}
            getTierColorHex={getTierColorHex}
          />

          {/* 유저 군 분포 결과 */}
          <TierStatsTable
            title="유저 군 분포 결과 (로그인 유저 최신 기록 기준)"
            stats={userDistributionStats}
            getTierColorHex={getTierColorHex}
          />
        </div>
      </div>
    </Card>
  );
}
