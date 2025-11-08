"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
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

interface TierProgressTabProps {
  tierHistory: TierHistoryItem[];
}

export function TierProgressTab({ tierHistory }: TierProgressTabProps) {
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

        <div className="from-primary/10 to-primary/5 border-primary/20 mt-6 rounded-lg border bg-linear-to-r p-4">
          <p className="text-center text-sm">
            최근 1개월 동안{" "}
            <span className="text-primary font-bold">2단계</span> 상승했습니다!
            🎉
          </p>
        </div>
      </Card>
    </div>
  );
}
