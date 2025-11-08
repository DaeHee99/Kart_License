"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/tier-badge";
import { TIERS, TierType } from "@/lib/types";
import { MOCK_RECENT_MEASUREMENTS, getUserNickname } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils-calc";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function RecentMeasurements() {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h3 className="mb-2 text-3xl font-bold md:text-4xl">
              실시간 측정 현황
            </h3>
            <p className="text-muted-foreground text-sm">
              지금 이 순간에도 측정이 진행되고 있습니다
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/statistics")}
            className="hidden md:flex"
          >
            전체 보기
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <Card className="divide-border gap-0 divide-y overflow-hidden py-0">
          {MOCK_RECENT_MEASUREMENTS.map((measurement, index) => (
            <motion.div
              key={measurement.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="hover:bg-accent/50 flex cursor-pointer items-center gap-4 p-4 transition-colors duration-150"
              onClick={() => router.push("/statistics")}
            >
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback>
                  {getUserNickname(measurement.userId)[0]}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="truncate font-medium">
                    {getUserNickname(measurement.userId)}
                  </span>
                  <Badge variant="outline" className="shrink-0 gap-1">
                    <div
                      className={`h-2 w-2 rounded-full ${TIERS[measurement.tier as keyof typeof TIERS].color}`}
                    />
                    {TIERS[measurement.tier as keyof typeof TIERS].nameKo}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  {isMounted
                    ? formatRelativeTime(measurement.timestamp)
                    : "방금 전"}
                </p>
              </div>

              <div className="shrink-0">
                <div
                  className={`h-10 w-10 ${TIERS[measurement.tier as keyof typeof TIERS].color} flex items-center justify-center rounded-full shadow-lg`}
                >
                  <TierBadge
                    tier={measurement.tier as TierType}
                    size="sm"
                    showLabel={false}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </Card>

        <div className="mt-4 md:hidden">
          <Button
            variant="outline"
            onClick={() => router.push("/statistics")}
            className="w-full"
          >
            전체 보기
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
