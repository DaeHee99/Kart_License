"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/tier-badge";
import { TIERS, TierType } from "@/lib/types";
import {
  MeasurementHistoryItem,
  SEASON_COLORS,
} from "../../../lib/mypage-constants";
import { useRouter } from "next/navigation";

interface MeasurementHistoryTabProps {
  measurements: MeasurementHistoryItem[];
}

export function MeasurementHistoryTab({
  measurements,
}: MeasurementHistoryTabProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 p-6">
        <h3 className="mb-4 font-bold">나의 측정 기록</h3>
        <div className="space-y-3">
          {measurements.map((measurement, index) => {
            const seasonColor =
              SEASON_COLORS[measurement.season] || SEASON_COLORS["S35"];
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
                    tier={measurement.tier as TierType}
                    size="sm"
                    showLabel={false}
                  />
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant="outline" className="gap-1">
                        <div
                          className={`h-2 w-2 rounded-full ${TIERS[measurement.tier as keyof typeof TIERS].color}`}
                        />
                        {TIERS[measurement.tier as keyof typeof TIERS].nameKo}
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
