"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TierBadge } from "@/components/tier-badge";
import { Sparkles } from "lucide-react";
import { MOCK_RECENT_MEASUREMENTS, getUserNickname } from "@/lib/mock-data";
import { TIERS, TierType } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils-calc";
import { useRouter } from "next/navigation";

export function RealtimeTab() {
  const router = useRouter();

  return (
    <Card className="border-border/50 relative overflow-hidden border-2 p-6">
      <motion.div
        className="via-primary/5 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
        animate={{ x: ["-200%", "200%"] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />

      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="text-primary h-5 w-5" />
          <h3 className="text-xl font-bold">최근 측정 기록</h3>
        </div>

        <div className="space-y-3">
          {MOCK_RECENT_MEASUREMENTS.map((measurement, index) => {
            const tierColor =
              TIERS[measurement.tier as keyof typeof TIERS].color;
            return (
              <motion.div
                key={measurement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: index * 0.03 }}
                className="hover:bg-primary/5 hover:border-primary/10 group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-lg border border-transparent p-4 transition-all"
                onClick={() => router.push(`/result/${measurement.id}`)}
              >
                <motion.div
                  className={`absolute top-0 bottom-0 left-0 w-1 ${tierColor}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.03 + 0.1,
                  }}
                />

                <Avatar className="ring-background group-hover:ring-primary/20 h-12 w-12 ring-2 transition-all">
                  <AvatarFallback
                    style={{
                      backgroundColor: `${tierColor}20`,
                      color: `var(--foreground)`,
                    }}
                  >
                    {getUserNickname(measurement.userId)[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="truncate font-medium">
                      {getUserNickname(measurement.userId)}
                    </span>
                    <Badge
                      variant="outline"
                      className={`gap-1`}
                      style={{
                        backgroundColor: `${tierColor}15`,
                        borderColor: `${tierColor}40`,
                        color: "var(--foreground)",
                      }}
                    >
                      <div className={`h-2 w-2 rounded-full ${tierColor}`} />
                      {TIERS[measurement.tier as keyof typeof TIERS].nameKo}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {formatRelativeTime(measurement.timestamp)} •{" "}
                    {measurement.totalMaps}개 맵 측정
                  </p>
                </div>

                <TierBadge
                  tier={measurement.tier as TierType}
                  size="md"
                  showLabel={false}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
