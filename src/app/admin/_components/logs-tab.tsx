"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { User, Loader2, ListFilter, X } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils-calc";
import { useAdminLogs } from "@/hooks/use-admin";
import { LogActionType } from "@/lib/services/log-action-types";
import { AdminPagination } from "./admin-pagination";

interface LogsTabProps {
  page: number;
  onPageChange: (page: number) => void;
}

const ACTION_TYPE_COLOR: Record<string, string> = {
  LOGIN: "bg-green-100 text-green-700",
  LOGOUT: "bg-gray-100 text-gray-700",
  REGISTER: "bg-blue-100 text-blue-700",
  WITHDRAW: "bg-red-100 text-red-700",
  MEASUREMENT_COMPLETE: "bg-purple-100 text-purple-700",
  POST_CREATE: "bg-cyan-100 text-cyan-700",
  POST_EDIT: "bg-cyan-50 text-cyan-600",
  POST_DELETE: "bg-red-100 text-red-700",
  COMMENT_CREATE: "bg-teal-100 text-teal-700",
  COMMENT_EDIT: "bg-teal-50 text-teal-600",
  COMMENT_DELETE: "bg-red-50 text-red-600",
  KAKAO_SHARE_RESULT: "bg-yellow-100 text-yellow-700",
  KAKAO_SHARE_POST: "bg-yellow-100 text-yellow-700",
  QR_DOWNLOAD_RESULT: "bg-indigo-100 text-indigo-700",
  QR_DOWNLOAD_POST: "bg-indigo-100 text-indigo-700",
  LINK_COPY_RESULT: "bg-pink-100 text-pink-700",
  LINK_COPY_POST: "bg-pink-100 text-pink-700",
  IMAGE_DOWNLOAD: "bg-orange-100 text-orange-700",
  NICKNAME_UPDATE: "bg-lime-100 text-lime-700",
  PASSWORD_UPDATE: "bg-amber-100 text-amber-700",
  ADMIN_PASSWORD_RESET: "bg-red-200 text-red-900",
  PROFILE_PICTURE_UPDATE: "bg-emerald-100 text-emerald-700",
  FEEDBACK_SUBMIT: "bg-violet-100 text-violet-700",
};

const ACTION_TYPE_LABEL: Record<string, string> = {
  LOGIN: "로그인",
  LOGOUT: "로그아웃",
  REGISTER: "회원가입",
  WITHDRAW: "회원탈퇴",
  MEASUREMENT_COMPLETE: "측정 완료",
  POST_CREATE: "글 작성",
  POST_EDIT: "글 수정",
  POST_DELETE: "글 삭제",
  COMMENT_CREATE: "댓글 작성",
  COMMENT_EDIT: "댓글 수정",
  COMMENT_DELETE: "댓글 삭제",
  KAKAO_SHARE_RESULT: "카카오 공유(결과)",
  KAKAO_SHARE_POST: "카카오 공유(게시글)",
  QR_DOWNLOAD_RESULT: "QR 다운로드(결과)",
  QR_DOWNLOAD_POST: "QR 다운로드(게시글)",
  LINK_COPY_RESULT: "링크 복사(결과)",
  LINK_COPY_POST: "링크 복사(게시글)",
  IMAGE_DOWNLOAD: "이미지 다운로드",
  NICKNAME_UPDATE: "닉네임 변경",
  PASSWORD_UPDATE: "비밀번호 변경",
  ADMIN_PASSWORD_RESET: "관리자 비밀번호 초기화",
  PROFILE_PICTURE_UPDATE: "프로필 사진 변경",
  FEEDBACK_SUBMIT: "피드백 제출",
};

// 카테고리별 그룹 — 필터 UI에서 가독성 향상
const ACTION_TYPE_GROUPS: { title: string; types: string[] }[] = [
  {
    title: "인증",
    types: ["LOGIN", "LOGOUT", "REGISTER", "WITHDRAW"],
  },
  {
    title: "측정",
    types: ["MEASUREMENT_COMPLETE"],
  },
  {
    title: "프로필",
    types: [
      "NICKNAME_UPDATE",
      "PASSWORD_UPDATE",
      "ADMIN_PASSWORD_RESET",
      "PROFILE_PICTURE_UPDATE",
    ],
  },
  {
    title: "커뮤니티",
    types: [
      "POST_CREATE",
      "POST_EDIT",
      "POST_DELETE",
      "COMMENT_CREATE",
      "COMMENT_EDIT",
      "COMMENT_DELETE",
    ],
  },
  {
    title: "공유 & 다운로드",
    types: [
      "KAKAO_SHARE_RESULT",
      "KAKAO_SHARE_POST",
      "QR_DOWNLOAD_RESULT",
      "QR_DOWNLOAD_POST",
      "LINK_COPY_RESULT",
      "LINK_COPY_POST",
      "IMAGE_DOWNLOAD",
    ],
  },
  {
    title: "피드백",
    types: ["FEEDBACK_SUBMIT"],
  },
];

const getActionTypeColor = (actionType: string) =>
  ACTION_TYPE_COLOR[actionType] || "bg-gray-100 text-gray-700";

const getActionTypeLabel = (actionType: string) =>
  ACTION_TYPE_LABEL[actionType] || actionType;

export function LogsTab({ page, onPageChange }: LogsTabProps) {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [showFilter, setShowFilter] = useState(false);

  const actionTypesArray = useMemo(
    () => Array.from(selectedTypes),
    [selectedTypes],
  );

  // 사용 가능한 액션 타입 목록 - LogActionType enum 값들로 생성하여 누락 방지
  const allActionTypes = useMemo(
    () => Object.values(LogActionType) as string[],
    [],
  );

  const { data, isLoading, isFetching } = useAdminLogs({
    page,
    limit: 50,
    actionTypes: actionTypesArray,
  });

  const toggleType = (actionType: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(actionType)) {
        next.delete(actionType);
      } else {
        next.add(actionType);
      }
      return next;
    });
    onPageChange(1);
  };

  const clearFilter = () => {
    setSelectedTypes(new Set());
    onPageChange(1);
  };

  const logs = data?.logs || [];
  const pagination = data?.pagination || { totalPages: 1, total: 0 };
  const selectedCount = selectedTypes.size;

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={showFilter ? "default" : "outline"}
            size="sm"
            className="gap-1"
            onClick={() => setShowFilter((v) => !v)}
          >
            <ListFilter className="h-4 w-4" />
            액션 타입 필터
            {selectedCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 min-w-5 justify-center px-1.5 text-xs"
              >
                {selectedCount}
              </Badge>
            )}
          </Button>

          {selectedCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-1"
              onClick={clearFilter}
            >
              <X className="h-3.5 w-3.5" />
              초기화
            </Button>
          )}
        </div>

        <div className="text-muted-foreground text-xs">
          {selectedCount > 0
            ? `${selectedCount}개 타입 · 총 ${pagination.total ?? 0}건`
            : `총 ${pagination.total ?? 0}건`}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <Card className="border-border/50 space-y-4 border-2 p-4">
          {/* 활성 칩 요약 */}
          {selectedCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 border-b pb-3">
              <span className="text-muted-foreground mr-1 text-xs">
                선택됨:
              </span>
              {actionTypesArray.map((t) => (
                <button
                  key={`active-${t}`}
                  type="button"
                  onClick={() => toggleType(t)}
                  className={`hover:opacity-80 ${getActionTypeColor(t)} flex items-center gap-1 rounded-md border-transparent px-2 py-0.5 text-xs font-medium`}
                  title="제거"
                >
                  {getActionTypeLabel(t)}
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          {/* 카테고리별 그룹 */}
          <div className="space-y-3">
            {ACTION_TYPE_GROUPS.map((group) => {
              // 정의된 enum에 포함된 타입만 노출 (누락된 신규 타입은 enum 기준으로 자동 추가 가능)
              const visible = group.types.filter((t) =>
                allActionTypes.includes(t),
              );
              if (visible.length === 0) return null;
              return (
                <div key={group.title}>
                  <p className="text-muted-foreground mb-1.5 text-xs font-medium">
                    {group.title}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {visible.map((t) => {
                      const active = selectedTypes.has(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleType(t)}
                          aria-pressed={active}
                          className={`rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
                            active
                              ? `${getActionTypeColor(t)} border-transparent ring-2 ring-offset-1 ring-current`
                              : "border-border bg-background text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          {getActionTypeLabel(t)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Logs Table */}
      <Card className="border-border/50 relative overflow-hidden border-2 p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Header Row */}
              <div className="bg-muted/50 border-border/50 grid grid-cols-4 border-b">
                <div className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                  유저
                </div>
                <div className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                  액션 타입
                </div>
                <div className="text-muted-foreground px-4 py-3 text-left text-xs font-medium">
                  내용
                </div>
                <div className="text-muted-foreground px-4 py-3 text-right text-xs font-medium">
                  시간
                </div>
              </div>

              {/* Data Rows */}
              {logs.length === 0 ? (
                <div className="text-muted-foreground px-4 py-12 text-center text-sm">
                  {selectedCount > 0
                    ? "선택한 필터 조건에 해당하는 로그가 없습니다."
                    : "로그가 없습니다."}
                </div>
              ) : (
                logs.map((log, index) => (
                  <motion.div
                    key={log._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02, duration: 0.15 }}
                    className="border-border/50 hover:bg-accent/50 grid grid-cols-4 border-b transition-colors last:border-b-0"
                  >
                    <div className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={log.profilePicture}
                            alt={log.nickname}
                          />
                          <AvatarFallback className="text-xs">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium">
                          {log.nickname || "알 수 없음"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center px-4 py-4">
                      {log.actionType && (
                        <Badge
                          variant="outline"
                          className={`cursor-pointer text-xs transition-opacity hover:opacity-80 ${getActionTypeColor(log.actionType)}`}
                          onClick={() => toggleType(log.actionType)}
                          title={`이 타입만 필터링: ${getActionTypeLabel(log.actionType)}`}
                        >
                          {log.actionType}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center px-4 py-4">
                      <p className="text-sm">{log.content}</p>
                    </div>
                    <div className="flex items-center justify-end px-4 py-4">
                      <p className="text-muted-foreground text-xs">
                        {formatRelativeTime(new Date(log.createdAt))}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Re-fetch overlay (필터 변경 등으로 데이터 다시 받는 동안) */}
        {isFetching && !isLoading && (
          <div className="bg-background/40 pointer-events-none absolute inset-0 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        )}
      </Card>

      <AdminPagination
        currentPage={page}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
