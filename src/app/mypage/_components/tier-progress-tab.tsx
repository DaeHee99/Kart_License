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

function itemTime(date: Date) {
  return date.getTime();
}

function formatTierChange(
  from: { tier: string; value: number },
  to: { tier: string; value: number },
) {
  const tierDiff = to.value - from.value;

  if (tierDiff > 0) {
    return `${from.tier}에서 ${to.tier}으로 ${tierDiff}단계 상승했습니다! 🎉`;
  }

  if (tierDiff < 0) {
    return `${from.tier}에서 ${to.tier}으로 ${Math.abs(tierDiff)}단계 하락했습니다. 💪 화이팅!`;
  }

  return `${to.tier}을 유지하고 있습니다. 꾸준히 이어가고 있어요! 💪`;
}

export function TierProgressTab({
  tierHistory,
  isLoading,
}: TierProgressTabProps) {
  // 현재 시점 기준 최근 30일의 측정 흐름을 계산한다.
  const tierChangeMessage = useMemo(() => {
    const now = new Date();
    const validHistory = tierHistory
      .map((item) => ({
        ...item,
        measuredAt: item.createdAt ? new Date(item.createdAt) : null,
      }))
      .filter(
        (item): item is typeof item & { measuredAt: Date } =>
          item.measuredAt !== null && !Number.isNaN(item.measuredAt.getTime()),
      )
      .filter((item) => item.measuredAt <= now)
      .sort((a, b) => itemTime(a.measuredAt) - itemTime(b.measuredAt));

    if (validHistory.length === 0) {
      return null;
    }

    const latest = validHistory[validHistory.length - 1];
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    const recentHistory = validHistory.filter(
      (item) => item.measuredAt >= oneMonthAgo,
    );

    if (recentHistory.length >= 2) {
      const firstRecent = recentHistory[0];
      return `최근 1개월 내 첫 측정 대비 ${formatTierChange(firstRecent, latest)}`;
    }

    const previousBeforeRecent = [...validHistory]
      .reverse()
      .find((item) => item.measuredAt < oneMonthAgo);

    if (recentHistory.length === 1) {
      if (previousBeforeRecent) {
        return `최근 측정은 직전 측정 대비 ${formatTierChange(previousBeforeRecent, latest)}`;
      }

      return "최근 1개월 내 비교할 추가 기록이 쌓이면 변화 추세를 보여드릴게요.";
    }

    const daysSinceLatest = Math.max(
      1,
      Math.floor((itemTime(now) - itemTime(latest.measuredAt)) / 86400000),
    );

    if (validHistory.length >= 2) {
      const previous = validHistory[validHistory.length - 2];
      return `최근 1개월 동안 새 측정 기록이 없습니다. 마지막 측정은 ${daysSinceLatest}일 전이며, 직전 측정 대비 ${formatTierChange(previous, latest)}`;
    }

    return `최근 1개월 동안 새 측정 기록이 없습니다. 마지막 측정은 ${daysSinceLatest}일 전입니다.`;
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
              domain={[0, 8]}
              ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
              tickFormatter={(value) => {
                const tiers = [
                  "",
                  "bronze",
                  "light",
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
                    "light",
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
