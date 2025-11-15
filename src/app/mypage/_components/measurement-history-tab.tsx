"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/tier-badge";
import { TIERS, TierType } from "@/lib/types";
import { SEASON_COLORS } from "../../../lib/mypage-constants";
import { useRouter } from "next/navigation";
import { FileChartColumnIncreasing, Loader2 } from "lucide-react";

interface MeasurementHistoryItem {
  id: string;
  date: string;
  tier: TierType;
  maps: number;
  season: string;
}

interface MeasurementHistoryTabProps {
  measurements: MeasurementHistoryItem[];
  isLoading?: boolean;
}

export function MeasurementHistoryTab({
  measurements,
  isLoading,
}: MeasurementHistoryTabProps) {
  const router = useRouter();

  // 시즌 색상 생성 함수 (빨주노초파남보 반복)
  const getSeasonColor = (season: string) => {
    if (SEASON_COLORS[season]) {
      return SEASON_COLORS[season];
    }

    // 기본 색상 배열 (빨주노초파남보)
    const colors = [
      { bg: "bg-red-500/10", border: "border-red-500" },
      { bg: "bg-orange-500/10", border: "border-orange-500" },
      { bg: "bg-yellow-500/10", border: "border-yellow-500" },
      { bg: "bg-green-500/10", border: "border-green-500" },
      { bg: "bg-blue-500/10", border: "border-blue-500" },
      { bg: "bg-indigo-500/10", border: "border-indigo-500" },
      { bg: "bg-purple-500/10", border: "border-purple-500" },
    ];

    const seasonNumber = parseInt(season.replace("S", ""));
    return colors[seasonNumber % colors.length];
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="border-primary/20 flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin" />
        </Card>
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="space-y-4">
        <Card className="border-primary/20 p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileChartColumnIncreasing className="text-primary h-5 w-5" />
            <h3 className="font-bold">나의 측정 기록</h3>
          </div>
          <div className="text-muted-foreground flex h-[300px] items-center justify-center text-center">
            <p>측정 기록이 없습니다. 기록 측정을 해보세요!</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileChartColumnIncreasing className="text-primary h-5 w-5" />
          <h3 className="font-bold">나의 측정 기록</h3>
        </div>
        <div className="space-y-3">
          {measurements.map((measurement, index) => {
            const seasonColor = getSeasonColor(measurement.season);
            return (
              <motion.div
                key={measurement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  scale: 1.02,
                  translateX: 4,
                  transition: { duration: 0.2 },
                }}
                className={`flex items-center justify-between rounded-lg border-2 p-4 ${seasonColor.border} ${seasonColor.bg} cursor-pointer transition-shadow duration-200 hover:shadow-lg`}
                onClick={() => {
                  router.push(`/result/${measurement.id}`);
                }}
              >
                <div className="flex items-center gap-4">
                  <TierBadge
                    tier={measurement.tier}
                    size="sm"
                    showLabel={false}
                  />
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant="outline" className="gap-1">
                        <div
                          className={`h-2 w-2 rounded-full ${TIERS[measurement.tier].color}`}
                        />
                        {TIERS[measurement.tier].nameKo}
                      </Badge>
                      <Badge variant="secondary" className="font-mono">
                        {measurement.season}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {measurement.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{measurement.maps}개 맵</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
