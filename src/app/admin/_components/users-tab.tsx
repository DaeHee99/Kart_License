"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { User, Loader2, Search } from "lucide-react";
import {
  formatRelativeTime,
  convertKoreanTierToEnglish,
} from "@/lib/utils-calc";
import { TIERS, TierType } from "@/lib/types";
import Link from "next/link";
import { useAdminUsers } from "@/hooks/use-admin";
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

  const users = data?.users || [];
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="닉네임 검색"
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
          <div className="min-w-[600px]">
            {/* Header Row */}
            <div className="bg-muted/50 border-border/50 grid grid-cols-5 border-b">
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
                  className="border-border/50 hover:bg-primary/5 relative grid grid-cols-5 border-b transition-colors last:border-b-0"
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
                      <span className="whitespace-nowrap text-sm font-medium">
                        {user.nickname}
                      </span>
                    </div>
                  </div>
                  <div className="text-muted-foreground relative z-10 flex items-center justify-center px-4 py-4 text-sm">
                    {user.loginId}
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
                  <div className="relative z-10 flex items-center justify-center px-4 py-4">
                    <Link href={`/userpage/${user._id}`}>
                      <Button variant="outline" size="sm">
                        정보
                      </Button>
                    </Link>
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
    </div>
  );
}
