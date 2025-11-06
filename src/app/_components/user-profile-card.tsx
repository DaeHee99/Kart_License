"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/tier-badge";
import { TIERS } from "@/lib/types";
import { MOCK_CURRENT_USER } from "@/lib/mock-data";
import { Users, LogIn, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserProfileCardProps {
  isLoggedIn: boolean;
  onToggleLogin: () => void;
}

export function UserProfileCard({ isLoggedIn, onToggleLogin }: UserProfileCardProps) {
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <Card className="from-primary/10 via-card/95 to-secondary/10 border-primary/30 sticky top-20 border bg-gradient-to-br p-8 text-center backdrop-blur-sm">
        <Users className="text-primary mx-auto mb-4 h-16 w-16" />
        <h3 className="mb-2 font-bold">로그인이 필요해요</h3>
        <p className="text-muted-foreground mb-6 text-sm">
          측정 기록 저장, 군 변화 추적, 커뮤니티 참여 등 다양한 기능을
          이용하세요
        </p>
        <Button onClick={onToggleLogin} size="lg" className="w-full">
          <LogIn className="mr-2 h-4 w-4" />
          로그인
        </Button>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 from-primary/10 via-card/95 to-secondary/10 sticky top-20 border-2 bg-gradient-to-br p-6 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="relative">
          <Avatar className="border-primary/20 h-20 w-20 border-4">
            <AvatarFallback className="from-primary to-secondary text-primary-foreground bg-gradient-to-br text-2xl">
              {MOCK_CURRENT_USER.nickname[0]}
            </AvatarFallback>
          </Avatar>
          {MOCK_CURRENT_USER.currentTier && (
            <div className="absolute -right-1 -bottom-1">
              <div
                className={`h-8 w-8 rounded-full ${TIERS[MOCK_CURRENT_USER.currentTier].color} flex items-center justify-center shadow-lg`}
              >
                <TierBadge
                  tier={MOCK_CURRENT_USER.currentTier}
                  size="sm"
                  showLabel={false}
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-full">
          <h3 className="mb-2 text-xl">
            {MOCK_CURRENT_USER.nickname}
          </h3>
          {MOCK_CURRENT_USER.currentTier && (
            <Badge className="mb-3 gap-2 px-4 py-1.5">
              <div
                className={`h-2.5 w-2.5 rounded-full ${TIERS[MOCK_CURRENT_USER.currentTier].color}`}
              />
              {TIERS[MOCK_CURRENT_USER.currentTier].nameKo}
            </Badge>
          )}
        </div>

        <div className="w-full space-y-2 pt-2">
          <Button
            variant="default"
            className="w-full"
            onClick={() => router.push("/mypage")}
          >
            <User className="mr-2 h-4 w-4" />내 정보
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={onToggleLogin}
          >
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </div>
    </Card>
  );
}
