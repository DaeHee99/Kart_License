"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion } from "motion/react";
import { User, Loader2, Search, KeyRound } from "lucide-react";
import { toast } from "sonner";
import {
  formatRelativeTime,
  convertKoreanTierToEnglish,
} from "@/lib/utils-calc";
import { TIERS, TierType } from "@/lib/types";
import Link from "next/link";
import { useAdminUsers, useResetUserPassword } from "@/hooks/use-admin";
import { AdminPagination } from "./admin-pagination";

// Helper function to get tier color hex
const getTierColorHex = (tier: TierType): string => {
  const colorMap: Record<TierType, string> = {
    elite: "#ef4444",
    master: "#a855f7",
    diamond: "#3b82f6",
    platinum: "#06b6d4",
    gold: "#eab308",
    silver: "#94a3b8",
    light: "#10b981",
    bronze: "#d97706",
  };
  return colorMap[tier];
};

interface UsersTabProps {
  page: number;
  onPageChange: (page: number) => void;
}

export function UsersTab({ page, onPageChange }: UsersTabProps) {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [resetTarget, setResetTarget] = useState<{
    userId: string;
    nickname: string;
    loginId: string;
  } | null>(null);

  // 디바운스: 입력 300ms 후 검색 실행
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== search) {
        setSearch(inputValue);
        onPageChange(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const { data, isLoading } = useAdminUsers({ page, limit: 20, search });
  const resetPasswordMutation = useResetUserPassword();

  const users = data?.users || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const handleConfirmReset = async () => {
    if (!resetTarget) return;
    try {
      await resetPasswordMutation.mutateAsync(resetTarget.userId);
      toast.success(
        `${resetTarget.nickname}님의 비밀번호가 1234로 초기화되었습니다.`,
      );
      setResetTarget(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "비밀번호 초기화에 실패했습니다.";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="닉네임 또는 아이디 검색"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <Card className="border-border/50 relative overflow-hidden border-2 p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[680px]">
                {/* Header Row */}
                <div className="bg-muted/50 border-border/50 grid grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.6fr)] border-b">
                  <div className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                    유저
                  </div>
                  <div className="text-muted-foreground px-4 py-3 text-center text-xs font-medium">
                    아이디
                  </div>
                  <div className="text-muted-foreground px-4 py-3 text-center text-xs font-medium">
                    군
                  </div>
                  <div className="text-muted-foreground px-4 py-3 text-center text-xs font-medium">
                    최근 접속
                  </div>
                  <div className="text-muted-foreground px-4 py-3 text-center text-xs font-medium">
                    유저 정보
                  </div>
                </div>

                {/* Data Rows */}
                {users.map((user, index) => {
                  const tierEnglish = convertKoreanTierToEnglish(user.tier);
                  const tierData = tierEnglish ? TIERS[tierEnglish] : null;
                  const tierColorHex = tierEnglish
                    ? getTierColorHex(tierEnglish)
                    : "#94a3b8";

                  return (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.15 }}
                      className="border-border/50 hover:bg-primary/5 relative grid grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.6fr)] border-b transition-colors last:border-b-0"
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

                      <div className="relative z-10 min-w-0 px-4 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage
                              src={user.profileImage}
                              alt={user.nickname}
                            />
                            <AvatarFallback className="text-xs">
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className="truncate text-sm font-medium"
                            title={user.nickname}
                          >
                            {user.nickname}
                          </span>
                        </div>
                      </div>
                      <div className="relative z-10 flex min-w-0 flex-col items-center justify-center px-4 py-4 text-sm">
                        <span
                          className={`max-w-full truncate ${
                            user.deletedAt
                              ? "font-medium text-red-600 dark:text-red-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {user.loginId}
                        </span>
                        {user.deletedAt && (
                          <span className="text-muted-foreground mt-0.5 text-xs whitespace-nowrap">
                            탈퇴{" "}
                            {(() => {
                              const d = new Date(user.deletedAt);
                              const yy = String(d.getFullYear()).slice(-2);
                              const mm = String(d.getMonth() + 1).padStart(
                                2,
                                "0",
                              );
                              const dd = String(d.getDate()).padStart(2, "0");
                              const hh = String(d.getHours()).padStart(2, "0");
                              const min = String(d.getMinutes()).padStart(
                                2,
                                "0",
                              );
                              return `${yy}-${mm}-${dd} ${hh}:${min}`;
                            })()}
                          </span>
                        )}
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
                          <Badge variant="outline">기록 없음</Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground relative z-10 flex items-center justify-center px-4 py-4 text-sm">
                        {user.lastAccess
                          ? formatRelativeTime(new Date(user.lastAccess))
                          : "접속 기록 없음"}
                      </div>
                      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 px-2 py-4 sm:px-4">
                        <Link href={`/userpage/${user._id}`}>
                          <Button variant="outline" size="sm">
                            정보
                          </Button>
                        </Link>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-700/60 dark:text-red-300 dark:hover:bg-red-950/40"
                          disabled={
                            !!user.deletedAt ||
                            (resetPasswordMutation.isPending &&
                              resetTarget?.userId === user._id)
                          }
                          onClick={() =>
                            setResetTarget({
                              userId: user._id,
                              nickname: user.nickname,
                              loginId: user.loginId,
                            })
                          }
                          title={
                            user.deletedAt
                              ? "탈퇴한 유저는 비밀번호를 초기화할 수 없습니다."
                              : "비밀번호 초기화"
                          }
                          aria-label="비밀번호 초기화"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          <span className="hidden whitespace-nowrap sm:inline">
                            비밀번호 초기화
                          </span>
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Card>

          <AdminPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}

      {/* 비밀번호 초기화 확인 다이얼로그 */}
      <AlertDialog
        open={resetTarget !== null}
        onOpenChange={(open) => {
          if (!open && !resetPasswordMutation.isPending) {
            setResetTarget(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>비밀번호 초기화</AlertDialogTitle>
            <AlertDialogDescription>
              {resetTarget && (
                <>
                  <span className="text-foreground font-medium">
                    {resetTarget.nickname}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    ({resetTarget.loginId})
                  </span>
                  님의 비밀번호를{" "}
                  <span className="text-foreground font-semibold">1234</span>로
                  초기화합니다.
                  <br />이 작업은 되돌릴 수 없습니다. 진행하시겠습니까?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={resetPasswordMutation.isPending}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmReset();
              }}
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  초기화 중
                </>
              ) : (
                "초기화"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
