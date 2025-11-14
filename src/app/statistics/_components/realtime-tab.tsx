"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TierBadge } from "@/components/tier-badge";
import { Sparkles, Loader2 } from "lucide-react";
import { TIERS, TierType } from "@/lib/types";
import { formatRelativeTime, convertKoreanTierToEnglish } from "@/lib/utils-calc";
import { useRouter } from "next/navigation";
import { useRecentRecords } from "@/hooks/use-records";

export function RealtimeTab() {
  const router = useRouter();
  const { records, isLoading } = useRecentRecords(10);

  if (isLoading) {
    return (
      <Card className="border-border/50 relative overflow-hidden border-2 p-6">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

  if (records.length === 0) {
    return (
      <Card className="border-border/50 relative overflow-hidden border-2 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="text-primary h-5 w-5" />
          <h3 className="text-xl font-bold">최근 측정 기록</h3>
        </div>
        <div className="text-muted-foreground flex justify-center py-12 text-center">
          <p>아직 측정 기록이 없습니다.</p>
        </div>
      </Card>
    );
  }

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
          {records.map((record, index) => {
            const tierEnglish = convertKoreanTierToEnglish(record.finalTier);
            const tierColor = TIERS[tierEnglish]?.color || "tier-bronze";
            const userName = record.user?.name || "익명";
            const userImage = record.user?.image;

            return (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: index * 0.03 }}
                className="hover:bg-primary/5 hover:border-primary/10 group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-lg border border-transparent p-4 transition-all"
                onClick={() => router.push(`/result/${record._id}`)}
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
                  {userImage ? (
                    <AvatarImage src={userImage} alt={userName} />
                  ) : null}
                  <AvatarFallback
                    style={{
                      backgroundColor: `${tierColor}20`,
                      color: `var(--foreground)`,
                    }}
                  >
                    {userName[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="truncate font-medium">
                      {userName}
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
                      {TIERS[tierEnglish]?.nameKo || record.finalTier}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {formatRelativeTime(new Date(record.createdAt))} •{" "}
                    {record.records?.length || 0}개 맵 측정
                  </p>
                </div>

                <TierBadge
                  tier={tierEnglish}
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
