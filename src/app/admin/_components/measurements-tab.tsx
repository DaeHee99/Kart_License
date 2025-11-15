"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { User, Loader2 } from "lucide-react";
import {
  formatRelativeTime,
  convertKoreanTierToEnglish,
} from "@/lib/utils-calc";
import { TIERS, TierType } from "@/lib/types";
import Link from "next/link";
import { useRecentRecords } from "@/hooks/use-admin";

// Helper function to get tier color hex
const getTierColorHex = (tier: TierType): string => {
  const colorMap: Record<TierType, string> = {
    elite: "#ef4444",
    master: "#a855f7",
    diamond: "#3b82f6",
    platinum: "#06b6d4",
    gold: "#eab308",
    silver: "#94a3b8",
    bronze: "#d97706",
  };
  return colorMap[tier];
};

export function MeasurementsTab() {
  const { data, isLoading } = useRecentRecords(20);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const records = data?.data || [];

  return (
    <div className="space-y-4">
      <Card className="border-border/50 relative overflow-hidden border-2 p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="bg-muted/50 border-border/50 grid grid-cols-4 border-b">
            <div className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
              유저
            </div>
            <div className="text-muted-foreground px-4 py-3 text-center text-xs font-medium">
              기록
            </div>
            <div className="text-muted-foreground px-4 py-3 text-center text-xs font-medium">
              결과
            </div>
            <div className="text-muted-foreground px-4 py-3 text-center text-xs font-medium">
              상세 결과
            </div>
          </div>

          {/* Data Rows */}
          {records.map((record, index) => {
            const tierEnglish = convertKoreanTierToEnglish(record.finalTier);
            const tierData = tierEnglish ? TIERS[tierEnglish] : null;
            const tierColorHex = tierEnglish
              ? getTierColorHex(tierEnglish)
              : "#94a3b8";
            const userName = record.user?.name || "알 수 없음";
            const userImage = record.user?.image || "/profile/gyool_dizini.png";

            return (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.15 }}
                className="border-border/50 hover:bg-primary/5 relative grid grid-cols-4 border-b transition-colors last:border-b-0"
                style={{
                  backgroundColor: `${tierColorHex}10`,
                }}
              >
                {/* Subtle progress bar background */}
                <motion.div
                  className="absolute top-0 bottom-0 left-0 opacity-10"
                  style={{ backgroundColor: tierColorHex }}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{
                    delay: 0.05 + index * 0.03,
                    duration: 0.3,
                  }}
                />

                <div className="relative z-10 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userImage} alt={userName} />
                      <AvatarFallback className="text-xs">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{userName}</p>
                      <p className="text-muted-foreground text-xs">
                        {formatRelativeTime(new Date(record.createdAt))}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 flex items-center justify-center px-4 py-4">
                  <div className="flex flex-col gap-1 text-xs">
                    {record.tierDistribution && (
                      <>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-muted-foreground font-medium">강주력</span>
                          <span className="font-mono font-bold">{record.tierDistribution.elite || 0}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-muted-foreground font-medium">주력</span>
                          <span className="font-mono font-bold">{record.tierDistribution.master || 0}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-muted-foreground font-medium">1군</span>
                          <span className="font-mono font-bold">{record.tierDistribution.diamond || 0}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-muted-foreground font-medium">2군</span>
                          <span className="font-mono font-bold">{record.tierDistribution.platinum || 0}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-muted-foreground font-medium">3군</span>
                          <span className="font-mono font-bold">{record.tierDistribution.gold || 0}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-muted-foreground font-medium">4군</span>
                          <span className="font-mono font-bold">{record.tierDistribution.silver || 0}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-muted-foreground font-medium">일반</span>
                          <span className="font-mono font-bold">{record.tierDistribution.bronze || 0}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="relative z-10 flex items-center justify-center px-4 py-4">
                  {tierData ? (
                    <Badge variant="outline" className="gap-1">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: tierColorHex }}
                      />
                      {tierData.nameKo}
                    </Badge>
                  ) : (
                    <Badge variant="outline">{record.finalTier}</Badge>
                  )}
                </div>
                <div className="relative z-10 flex items-center justify-center px-4 py-4">
                  <Link href={`/result/${record._id}`}>
                    <Button variant="outline" size="sm">
                      결과
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
      </Card>
    </div>
  );
}
