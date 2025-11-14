"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/tier-badge";
import { TIERS } from "@/lib/types";
import { Users, LogIn, User, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { useLatestRecord } from "@/hooks/use-records";
import { convertKoreanTierToEnglish } from "@/lib/utils-calc";

export function UserProfileCard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  // 최근 측정 기록 조회
  const { record: latestRecord } = useLatestRecord(user?._id);

  const handleLogout = () => {
    logout();
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <Card className="from-primary/10 via-card/95 to-secondary/10 border-primary/30 sticky top-20 border bg-linear-to-br p-8 text-center backdrop-blur-sm">
        <Loader2 className="text-primary mx-auto mb-4 h-16 w-16 animate-spin" />
        <p className="text-muted-foreground text-sm">로딩 중...</p>
      </Card>
    );
  }

  // 로그인되지 않은 경우
  if (!isAuthenticated || !user) {
    return (
      <Card className="from-primary/10 via-card/95 to-secondary/10 border-primary/30 sticky top-20 border bg-linear-to-br p-8 text-center backdrop-blur-sm">
        <Users className="text-primary mx-auto mb-4 h-16 w-16" />
        <h3 className="mb-2 font-bold">로그인이 필요해요</h3>
        <p className="text-muted-foreground mb-6 text-sm">
          측정 기록 저장, 군 변화 추적, 커뮤니티 참여 등 다양한 기능을
          이용하세요
        </p>
        <Button
          onClick={() => router.push("/auth")}
          size="lg"
          className="w-full"
        >
          <LogIn className="mr-2 h-4 w-4" />
          로그인
        </Button>
      </Card>
    );
  }

  // 최근 측정 기록의 티어를 사용, 없으면 유저 라이센스 사용
  const displayTier = latestRecord?.finalTier
    ? convertKoreanTierToEnglish(latestRecord.finalTier)
    : (user.license as keyof typeof TIERS);

  const hasTierInfo = latestRecord?.finalTier || user.license;

  return (
    <Card className="border-primary/30 from-primary/10 via-card/95 to-secondary/10 sticky top-20 border-2 bg-linear-to-br p-6 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="relative">
          <Avatar className="border-primary/20 h-20 w-20 border-4">
            <AvatarImage
              src={user.image}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="from-primary to-secondary text-primary-foreground bg-linear-to-br text-2xl">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          {hasTierInfo && TIERS[displayTier] && (
            <div className="absolute -right-1 -bottom-1">
              <div
                className={`h-8 w-8 rounded-full ${TIERS[displayTier].color} flex items-center justify-center shadow-lg`}
              >
                <TierBadge tier={displayTier} size="sm" showLabel={false} />
              </div>
            </div>
          )}
        </div>

        <div className="w-full">
          <h3 className="mb-2 text-xl">{user.name}</h3>
          {hasTierInfo && TIERS[displayTier] && (
            <Badge className="mb-3 gap-2 px-4 py-1.5">
              <div
                className={`h-2.5 w-2.5 rounded-full ${TIERS[displayTier].color}`}
              />
              {TIERS[displayTier].nameKo}
            </Badge>
          )}
          {latestRecord && (
            <p className="text-muted-foreground text-xs">
              최근 기록: S{latestRecord.season}
              <br />
              {new Date(latestRecord.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              {new Date(latestRecord.createdAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
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
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                로그아웃 중...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
