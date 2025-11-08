"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TierBadge } from "@/components/tier-badge";
import { MOCK_CURRENT_USER } from "@/lib/mock-data";
import { TIERS } from "@/lib/types";
import { AVATAR_OPTIONS } from "../../../lib/mypage-constants";

interface ProfileSummaryCardProps {
  onEditProfile: () => void;
}

export function ProfileSummaryCard({ onEditProfile }: ProfileSummaryCardProps) {
  // 최근 측정 정보
  const latestMeasurement = {
    season: "S35",
    date: "2025-10-25",
    time: "14:30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-primary/20 relative overflow-hidden border-2">
        {/* Background Pattern */}
        <div className="from-primary/5 to-primary/10 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent" />
        <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl" />

        <div className="relative p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <motion.div
              className="relative shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Avatar className="border-background h-20 w-20 border-4 shadow-lg">
                <AvatarFallback
                  className={`text-3xl ${AVATAR_OPTIONS[0].color}`}
                >
                  {AVATAR_OPTIONS[0].emoji}
                </AvatarFallback>
              </Avatar>
              {MOCK_CURRENT_USER.currentTier && (
                <div className="absolute -right-1 -bottom-1">
                  <TierBadge
                    tier={MOCK_CURRENT_USER.currentTier}
                    size="base"
                    showLabel={false}
                  />
                </div>
              )}
            </motion.div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h2 className="mb-3 truncate text-2xl font-bold">
                {MOCK_CURRENT_USER.nickname}
              </h2>

              <div className="mb-2 flex items-start gap-3">
                <div className="flex gap-1.5">
                  <Badge variant="outline" className="w-fit">
                    {MOCK_CURRENT_USER.currentTier &&
                      TIERS[MOCK_CURRENT_USER.currentTier].nameKo}
                  </Badge>
                  <Badge variant="secondary" className="w-fit font-mono">
                    {latestMeasurement.season}
                  </Badge>
                </div>
              </div>

              <p className="text-muted-foreground text-sm">
                최근 측정: {latestMeasurement.date} {latestMeasurement.time}
              </p>
            </div>

            {/* Edit Button */}
            <Button
              variant="outline"
              onClick={onEditProfile}
              className="hidden shrink-0 sm:flex"
            >
              프로필 수정
            </Button>
          </div>

          {/* Mobile Edit Button */}
          <Button
            variant="outline"
            onClick={onEditProfile}
            className="mt-4 w-full sm:hidden"
          >
            프로필 수정
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
