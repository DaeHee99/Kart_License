"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Loader2 } from "lucide-react";
import { TierType } from "@/lib/types";
import { TierStatsTable } from "./tier-stats-table";
import {
  useRecordStatistics,
  useUserLicenseStatistics,
} from "@/hooks/use-statistics";

export function StatisticsTab() {
  const { recordData, isLoading: recordLoading } = useRecordStatistics();
  const { licenseData, isLoading: licenseLoading } = useUserLicenseStatistics();

  const isLoading = recordLoading || licenseLoading;

  // 현재 시간 포맷팅
  const formattedLatestUpdate = new Date().toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  // 총 기록 개수 계산
  const totalCount = recordData.reduce((sum, count) => sum + count, 0);

  // 데이터를 객체 형태로 변환 (recordData는 배열: [강주력, 주력, 1군, 2군, 3군, 4군, 일반])
  const cumulativeStats = {
    elite: recordData[0],
    master: recordData[1],
    diamond: recordData[2],
    platinum: recordData[3],
    gold: recordData[4],
    silver: recordData[5],
    bronze: recordData[6],
  };

  const userDistributionStats = {
    elite: licenseData[0],
    master: licenseData[1],
    diamond: licenseData[2],
    platinum: licenseData[3],
    gold: licenseData[4],
    silver: licenseData[5],
    bronze: licenseData[6],
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

  if (isLoading) {
    return (
      <Card className="border-border/50 relative overflow-hidden border-2 p-6">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

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
          <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
            {formattedLatestUpdate && (
              <Badge variant="secondary" className="font-normal">
                {formattedLatestUpdate} 기준
              </Badge>
            )}
            <Badge variant="secondary" className="font-normal">
              총 {totalCount.toLocaleString()}개의 기록
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            전체 유저의 기록을 통해 분석된 결과입니다.
          </p>
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
