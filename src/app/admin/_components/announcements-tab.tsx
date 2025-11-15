"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion } from "motion/react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils-calc";
import {
  useAdminAnnouncements,
  useToggleAnnouncementShow,
} from "@/hooks/use-admin";

export function AnnouncementsTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminAnnouncements({ page, limit: 20 });
  const toggleMutation = useToggleAnnouncementShow();

  const handleToggle = (id: string, currentShow: boolean) => {
    toggleMutation.mutate({ id, show: !currentShow });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const announcements = data?.announcements || [];
  const pagination = data?.pagination || { totalPages: 1 };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {announcements.map((announcement, index) => (
          <motion.div
            key={announcement._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`p-6 ${!announcement.show ? "opacity-60" : ""}`}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {announcement.title}
                      </h3>
                      <Badge
                        variant={announcement.show ? "default" : "secondary"}
                        className="gap-1"
                      >
                        {announcement.show ? (
                          <>
                            <Eye className="h-3 w-3" />
                            표시 중
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            숨김
                          </>
                        )}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
                      <span>작성자: {announcement.authorName}</span>
                      <span>•</span>
                      <span>
                        작성:{" "}
                        {formatRelativeTime(new Date(announcement.createdAt))}
                      </span>
                      {announcement.createdAt !== announcement.updatedAt && (
                        <>
                          <span>•</span>
                          <span>
                            수정:{" "}
                            {formatRelativeTime(
                              new Date(announcement.updatedAt),
                            )}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">표시</span>
                    <Switch
                      checked={announcement.show}
                      onCheckedChange={() =>
                        handleToggle(announcement._id, announcement.show)
                      }
                      disabled={toggleMutation.isPending}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm whitespace-pre-wrap">
                    {announcement.content}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

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
