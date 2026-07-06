"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronLeft, ChevronRight, EyeOff } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect, useMemo, useRef } from "react";
import { useAnnouncements } from "@/hooks/use-announcements";
import { toast } from "sonner";

const DISMISSED_ANNOUNCEMENTS_KEY = "dismissed-announcement-ids";

const getStoredDismissedAnnouncementIds = () => {
  if (typeof window === "undefined") return new Set<string>();

  try {
    const stored = localStorage.getItem(DISMISSED_ANNOUNCEMENTS_KEY);
    if (!stored) return new Set<string>();

    const parsed = JSON.parse(stored);
    return new Set<string>(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set<string>();
  }
};

export function AnnouncementModal() {
  const isMobile = useIsMobile();
  const { announcements, isLoading } = useAnnouncements();

  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // 로컬스토리지에 저장된 숨긴 공지사항 ID들
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(
    getStoredDismissedAnnouncementIds,
  );
  const primaryActionRef = useRef<HTMLButtonElement>(null);

  // 숨긴 공지사항 ID 저장하기
  const addDismissedAnnouncementId = (id: string) => {
    try {
      const newDismissed = new Set(dismissedIds);
      newDismissed.add(id);

      localStorage.setItem(
        DISMISSED_ANNOUNCEMENTS_KEY,
        JSON.stringify([...newDismissed]),
      );

      // 상태 즉시 업데이트
      setDismissedIds(newDismissed);
      return true;
    } catch (error) {
      console.error("Failed to save dismissed announcement:", error);
      return false;
    }
  };

  // 숨기지 않은 공지사항들만 필터링 (useMemo로 최적화)
  const visibleAnnouncements = useMemo(() => {
    return announcements.filter(
      (announcement) => !dismissedIds.has(announcement._id),
    );
  }, [announcements, dismissedIds]);

  const currentAnnouncement = visibleAnnouncements[currentIndex] || null;
  const hasMultiple = visibleAnnouncements.length > 1;

  useEffect(() => {
    // 공지사항이 있고, 아직 표시되지 않았으면 500ms 후에 표시
    if (visibleAnnouncements.length > 0 && !isLoading) {
      const timerId = setTimeout(() => {
        setShowAnnouncement(true);
      }, 500);

      return () => clearTimeout(timerId);
    }
  }, [visibleAnnouncements.length, isLoading]);

  useEffect(() => {
    if (!showAnnouncement || !currentAnnouncement) return;

    const animationFrameId = requestAnimationFrame(() => {
      primaryActionRef.current?.focus();
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, [currentAnnouncement, showAnnouncement]);

  const closeAnnouncementModal = () => {
    setShowAnnouncement(false);
    setCurrentIndex(0);
  };

  const dismissCurrentAnnouncementAndContinue = () => {
    if (!currentAnnouncement) return;

    const isCurrentLast = currentIndex >= visibleAnnouncements.length - 1;
    const saved = addDismissedAnnouncementId(currentAnnouncement._id);

    if (!saved) {
      toast.error("공지사항 숨김 저장에 실패했습니다.");
      return;
    }

    toast.success("공지사항을 다시 표시하지 않도록 저장했습니다.");

    if (isCurrentLast) {
      closeAnnouncementModal();
    }
  };

  const handleCloseAnnouncement = () => {
    if (!currentAnnouncement) return;

    // 확인 버튼을 눌렀으므로 모달 닫기
    closeAnnouncementModal();
  };

  const handleNext = () => {
    if (!currentAnnouncement) return;

    if (currentIndex < visibleAnnouncements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 모달이 닫힐 때 초기화
  const handleModalClose = (open: boolean) => {
    if (!open) {
      closeAnnouncementModal();
    }
  };

  if (!currentAnnouncement || isLoading) return null;

  const isLastAnnouncement = currentIndex === visibleAnnouncements.length - 1;

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  const content = (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 shrink-0 rounded-full p-2">
          <Sparkles className="text-primary h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h4 className="font-bold">{currentAnnouncement.title}</h4>
            {hasMultiple && (
              <Badge variant="secondary" className="text-xs">
                {currentIndex + 1} / {visibleAnnouncements.length}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm whitespace-pre-wrap">
            {currentAnnouncement.content}
          </p>
          {currentAnnouncement.createdAt && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {formatDate(currentAnnouncement.createdAt)}
            </p>
          )}
        </div>
      </div>

      <Button
        onClick={dismissCurrentAnnouncementAndContinue}
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground w-full"
      >
        <EyeOff className="mr-1 h-4 w-4" />
        이 공지 다시 보지 않기
      </Button>

      {/* 버튼들 */}
      <div className="flex gap-2">
        {hasMultiple && currentIndex > 0 && (
          <Button
            onClick={handlePrevious}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            이전
          </Button>
        )}
        {isLastAnnouncement ? (
          <Button
            ref={primaryActionRef}
            onClick={handleCloseAnnouncement}
            size="sm"
            className="flex-1"
          >
            확인
          </Button>
        ) : (
          <Button
            ref={primaryActionRef}
            onClick={handleNext}
            size="sm"
            className="flex-1"
          >
            다음
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={showAnnouncement} onOpenChange={handleModalClose}>
        <DrawerContent
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            primaryActionRef.current?.focus();
          }}
        >
          <DrawerHeader>
            <DrawerTitle>공지사항</DrawerTitle>
            <DrawerDescription>새로운 소식을 확인하세요</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={showAnnouncement} onOpenChange={handleModalClose}>
      <DialogContent
        className="sm:max-w-md"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          primaryActionRef.current?.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle>공지사항</DialogTitle>
          <DialogDescription>새로운 소식을 확인하세요</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
