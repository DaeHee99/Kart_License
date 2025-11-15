"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useCreateAnnouncement, useAnnouncements } from "@/hooks/use-announcements";
import { toast } from "sonner";
import { Megaphone, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AnnouncementForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const createAnnouncement = useCreateAnnouncement();
  const { announcements, isLoading } = useAnnouncements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const result = await createAnnouncement.mutateAsync({
        title: title.trim(),
        content: content.trim(),
      });

      if (result.success) {
        toast.success("공지사항이 등록되었습니다!");
        setTitle("");
        setContent("");
      } else {
        toast.error(result.message || "공지사항 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("Announcement create error:", error);
      toast.error("공지사항 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 공지사항 등록 폼 */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Megaphone className="text-primary h-5 w-5" />
          <h3 className="font-bold text-lg">새 공지사항 등록</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="announcement-title">제목</Label>
            <Input
              id="announcement-title"
              placeholder="공지사항 제목을 입력하세요 (최대 100자)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              disabled={createAnnouncement.isPending}
            />
            <p className="text-muted-foreground text-xs">
              {title.length}/100자
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="announcement-content">내용</Label>
            <Textarea
              id="announcement-content"
              placeholder="공지사항 내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
              disabled={createAnnouncement.isPending}
            />
          </div>

          <Button
            type="submit"
            disabled={createAnnouncement.isPending}
            className="w-full"
          >
            {createAnnouncement.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                등록 중...
              </>
            ) : (
              "공지사항 등록"
            )}
          </Button>
        </form>
      </Card>

      {/* 현재 활성 공지사항 목록 */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-lg">현재 활성 공지사항</h3>
          {!isLoading && (
            <Badge variant="secondary">
              {announcements.length}개
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            활성 공지사항이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement, index) => (
              <div
                key={announcement._id}
                className={`rounded-lg border p-4 ${
                  index === 0 ? "border-primary/50 bg-primary/5" : "border-border"
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <h4 className="font-semibold">{announcement.title}</h4>
                  {index === 0 && (
                    <Badge variant="default" className="text-xs">
                      최신
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-2 whitespace-pre-wrap text-sm">
                  {announcement.content}
                </p>
                <p className="text-muted-foreground text-xs">
                  {new Date(announcement.createdAt).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
