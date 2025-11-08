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
import { SeasonRecord, SEASON_COLORS } from "../../../lib/mypage-constants";
import { useRouter } from "next/navigation";

interface SeasonRecordsTabProps {
  seasonRecords: SeasonRecord[];
}

export function SeasonRecordsTab({ seasonRecords }: SeasonRecordsTabProps) {
  const router = useRouter();

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
            const seasonColor =
              SEASON_COLORS[record.season] || SEASON_COLORS["S35"];
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
                  router.push(`/result/${record.season}`);
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
                  <span className="text-muted-foreground text-sm">
                    2025-10-25 14:30
                  </span>
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
