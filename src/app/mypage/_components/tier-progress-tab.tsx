"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, Loader2 } from "lucide-react";
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
import { TierHistoryItem } from "../../../lib/mypage-constants";
import { useMemo } from "react";

interface TierProgressTabProps {
  tierHistory: TierHistoryItem[];
  isLoading?: boolean;
}

export function TierProgressTab({
  tierHistory,
  isLoading,
}: TierProgressTabProps) {
  // 최근 1개월 동안 티어 변화 계산
  const tierChangeMessage = useMemo(() => {
    if (tierHistory.length < 2) {
      return null;
    }

    // 최근 1개월 데이터 필터링 (약 30일)
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    // 최근 데이터와 1개월 전 데이터 비교
    const latestValue = tierHistory[tierHistory.length - 1].value;
    const earliestValue = tierHistory[0].value;
    const tierDiff = latestValue - earliestValue;

    if (tierDiff > 0) {
      return `최근 1개월 동안 ${tierDiff}단계 상승했습니다! 🎉`;
    } else if (tierDiff < 0) {
      return `최근 1개월 동안 ${Math.abs(tierDiff)}단계 하락했습니다. 💪 화이팅!`;
    } else {
      return "최근 1개월 동안 티어 변화가 없습니다. 꾸준히 노력하고 있어요! 💪";
    }
  }, [tierHistory]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="border-primary/20 flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin" />
        </Card>
      </div>
    );
  }

  if (tierHistory.length === 0) {
    return (
      <div className="space-y-4">
        <Card className="border-primary/20 p-6">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="text-primary h-5 w-5" />
            <h3 className="font-bold">군 변화 그래프</h3>
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
          <TrendingUp className="text-primary h-5 w-5" />
          <h3 className="font-bold">군 변화 그래프</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={tierHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="date"
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
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{
                fill: "var(--primary)",
                r: 5,
                strokeWidth: 2,
                stroke: "var(--background)",
              }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {tierChangeMessage && (
          <div className="from-primary/10 to-primary/5 border-primary/20 mt-6 rounded-lg border bg-linear-to-r p-4">
            <p className="text-center text-sm">{tierChangeMessage}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
