"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TierBadge } from "@/components/tier-badge";
import { TIERS, TierType } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { useMypageData } from "@/hooks/use-mypage";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";

interface ProfileSummaryCardProps {
  onEditProfile: () => void;
}

export function ProfileSummaryCard({ onEditProfile }: ProfileSummaryCardProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { latestRecord, isLoading: dataLoading } = useMypageData(user?._id);
  const router = useRouter();

  if (authLoading || !user) {
    return null;
  }

  const userTier = user.license as keyof typeof TIERS;

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
                <AvatarImage src={user.image} alt={user.name} className="object-cover" />
                <AvatarFallback className="from-primary to-secondary text-primary-foreground bg-linear-to-br text-3xl">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
              {user.license && TIERS[userTier] && (
                <div className="absolute -right-1 -bottom-1">
                  <TierBadge
                    tier={userTier}
                    size="base"
                    showLabel={false}
                  />
                </div>
              )}
            </motion.div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="truncate text-2xl font-bold">
                  {user.name}
                </h2>
                {user.role === 1 && (
                  <Badge className="gap-1.5 bg-yellow-500/10 text-yellow-700 border-yellow-500/30">
                    <Crown className="h-3.5 w-3.5" />
                    관리자
                  </Badge>
                )}
                {user.role === 2 && (
                  <Badge className="gap-1.5 bg-purple-500/10 text-purple-700 border-purple-500/30">
                    <Crown className="h-3.5 w-3.5" />
                    운영진
                  </Badge>
                )}
              </div>

              {dataLoading ? (
                <div className="text-muted-foreground text-sm">로딩 중...</div>
              ) : latestRecord ? (
                <>
                  <div className="mb-2 flex items-start gap-3">
                    <div className="flex gap-1.5">
                      <Badge variant="outline" className="w-fit">
                        {latestRecord.tier}
                      </Badge>
                      <Badge variant="secondary" className="w-fit font-mono">
                        S{latestRecord.season}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm">
                    최근 측정:{" "}
                    {new Date(latestRecord.createdAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground mb-2 text-sm">
                    최근에 측정한 기록이 없습니다.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => router.push("/measure")}
                    className="mt-2"
                  >
                    지금 바로 기록 측정하기
                  </Button>
                </>
              )}
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
