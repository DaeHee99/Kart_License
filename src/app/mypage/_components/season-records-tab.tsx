"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/tier-badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TIERS, TierType } from "@/lib/types";
import { SEASON_COLORS } from "../../../lib/mypage-constants";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface SeasonRecord {
  season: string;
  tier: TierType;
  value: number;
  recordId: string;
}

interface SeasonRecordsTabProps {
  seasonRecords: SeasonRecord[];
  isLoading?: boolean;
}

export function SeasonRecordsTab({
  seasonRecords,
  isLoading,
}: SeasonRecordsTabProps) {
  const router = useRouter();

  // 시즌 색상 생성 함수 (빨주노초파남보 반복)
  const getSeasonColor = (season: string) => {
    if (SEASON_COLORS[season]) {
      return SEASON_COLORS[season];
    }

    // 기본 색상 배열
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

  if (seasonRecords.length === 0) {
    return (
      <div className="space-y-4">
        <Card className="border-primary/20 p-6">
          <h3 className="mb-4 font-bold">시즌별 최고 기록 그래프</h3>
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
        <h3 className="mb-4 font-bold">시즌별 최고 기록 그래프</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={seasonRecords}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="season"
              stroke="var(--muted-foreground)"
              fontSize={12}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              domain={[0, 7]}
              ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
              tickFormatter={(value) => {
                const tiers = [
                  "",
                  "bronze",
                  "silver",
                  "gold",
                  "platinum",
                  "diamond",
                  "master",
                  "elite",
                ];
                return TIERS[tiers[value] as TierType]?.nameKo || "";
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--foreground)" }}
              formatter={(value: unknown) => {
                if (typeof value === "number") {
                  const tiers = [
                    "",
                    "bronze",
                    "silver",
                    "gold",
                    "platinum",
                    "diamond",
                    "master",
                    "elite",
                  ];
                  return [TIERS[tiers[value] as TierType]?.nameKo || "", "군"];
                }
                return ["", ""];
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={3}
              dot={{
                fill: "#10b981",
                r: 5,
                strokeWidth: 2,
                stroke: "var(--background)",
              }}
              activeDot={{ r: 7 }}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Season Records List */}
        <div className="mt-6 space-y-3">
          {seasonRecords.map((record, index) => {
            const seasonColor = getSeasonColor(record.season);
            return (
              <motion.div
                key={record.season}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  translateX: 4,
                  transition: { duration: 0.2 },
                }}
                className={`flex items-center justify-between rounded-lg border-2 p-4 ${seasonColor.border} ${seasonColor.bg} cursor-pointer transition-shadow duration-200 hover:shadow-lg`}
                onClick={() => {
                  router.push(`/result/${record.recordId}`);
                }}
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 font-mono text-base"
                  >
                    {record.season}
                  </Badge>
                  <TierBadge tier={record.tier} size="sm" />
                </div>
                <div
                  className={`h-2 w-2 rounded-full ${TIERS[record.tier].color}`}
                />
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
