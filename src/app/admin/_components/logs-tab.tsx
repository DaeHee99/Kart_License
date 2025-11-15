"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { User, Loader2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils-calc";
import { useAdminLogs } from "@/hooks/use-admin";

export function LogsTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminLogs({ page, limit: 50 });

  const getActionTypeColor = (actionType: string) => {
    const colorMap: Record<string, string> = {
      LOGIN: "bg-green-100 text-green-700",
      LOGOUT: "bg-gray-100 text-gray-700",
      REGISTER: "bg-blue-100 text-blue-700",
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
      PROFILE_PICTURE_UPDATE: "bg-emerald-100 text-emerald-700",
      FEEDBACK_SUBMIT: "bg-violet-100 text-violet-700",
    };
    return colorMap[actionType] || "bg-gray-100 text-gray-700";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const logs = data?.logs || [];
  const pagination = data?.pagination || { totalPages: 1 };

  return (
    <div className="space-y-4">
      <Card className="border-border/50 relative overflow-hidden border-2 p-0">
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
          {logs.map((log, index) => (
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
                    <AvatarImage src={log.profilePicture} alt={log.nickname} />
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
                    className={`text-xs ${getActionTypeColor(log.actionType)}`}
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
          ))}
          </div>
        </div>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            이전
          </Button>
          <span className="text-muted-foreground text-sm">
            {page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={page === pagination.totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
