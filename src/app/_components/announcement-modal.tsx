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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect, useMemo } from "react";
import { useAnnouncements } from "@/hooks/use-announcements";

const DISMISSED_ANNOUNCEMENTS_KEY = "dismissed-announcement-ids";

export function AnnouncementModal() {
  const isMobile = useIsMobile();
  const { announcements, isLoading } = useAnnouncements();

  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  // 각 공지사항의 "다시 보지 않기" 상태를 Map으로 관리
  const [dontShowAgainMap, setDontShowAgainMap] = useState<
    Map<string, boolean>
  >(new Map());
  // 로컬스토리지에 저장된 숨긴 공지사항 ID들
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // 로컬스토리지에서 숨긴 공지사항 ID들 가져오기
  useEffect(() => {
    try {
      const stored = localStorage.getItem(DISMISSED_ANNOUNCEMENTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setDismissedIds(new Set(Array.isArray(parsed) ? parsed : []));
      }
    } catch {
      setDismissedIds(new Set());
    }
  }, []);

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
    } catch (error) {
      console.error("Failed to save dismissed announcement:", error);
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

  // 현재 공지사항의 "다시 보지 않기" 체크 상태
  const currentDontShowAgain = currentAnnouncement
    ? dontShowAgainMap.get(currentAnnouncement._id) || false
    : false;

  useEffect(() => {
    // 공지사항이 있고, 아직 표시되지 않았으면 500ms 후에 표시
    if (visibleAnnouncements.length > 0 && !isLoading) {
      setTimeout(() => {
        setShowAnnouncement(true);
      }, 500);
    } else if (visibleAnnouncements.length === 0) {
      // 보여줄 공지사항이 없으면 모달 닫기
      setShowAnnouncement(false);
    }
  }, [visibleAnnouncements.length, isLoading]);

  // 현재 공지사항의 "다시 보지 않기" 체크 상태 토글
  const handleDontShowAgainChange = (checked: boolean) => {
    if (!currentAnnouncement) return;

    const newMap = new Map(dontShowAgainMap);
    newMap.set(currentAnnouncement._id, checked);
    setDontShowAgainMap(newMap);
  };

  const handleCloseAnnouncement = () => {
    if (!currentAnnouncement) return;

    // 현재 공지사항을 "다시 보지 않기" 체크했으면 로컬스토리지에 저장
    if (currentDontShowAgain) {
      addDismissedAnnouncementId(currentAnnouncement._id);
    }

    // 확인 버튼을 눌렀으므로 모달 닫기
    setShowAnnouncement(false);
    setCurrentIndex(0);
    setDontShowAgainMap(new Map());
  };

  const handleNext = () => {
    if (!currentAnnouncement) return;

    // 다음으로 넘어가기 전에 현재 공지사항의 "다시 보지 않기" 체크 상태 저장
    if (currentDontShowAgain) {
      addDismissedAnnouncementId(currentAnnouncement._id);
      // 저장 후 visibleAnnouncements가 업데이트되므로 currentIndex는 유지
      // (현재 항목이 제거되면 다음 항목이 같은 인덱스로 옴)
    } else {
      // 체크하지 않았으면 다음 항목으로 이동
      if (currentIndex < visibleAnnouncements.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkipAll = () => {
    // 모든 남은 공지사항을 건너뛰기
    setShowAnnouncement(false);
    setCurrentIndex(0);
    setDontShowAgainMap(new Map());
  };

  // 모달이 닫힐 때 초기화
  const handleModalClose = (open: boolean) => {
    if (!open) {
      setShowAnnouncement(false);
      setCurrentIndex(0);
      setDontShowAgainMap(new Map());
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

      {/* 다시 보지 않기 체크박스 */}
      <div className="flex items-center gap-2 px-1">
        <Checkbox
          id={`dont-show-again-${currentAnnouncement._id}`}
          checked={currentDontShowAgain}
          onCheckedChange={handleDontShowAgainChange}
        />
        <Label
          htmlFor={`dont-show-again-${currentAnnouncement._id}`}
          className="text-muted-foreground cursor-pointer text-sm"
        >
          이 공지사항 다시 보지 않기
        </Label>
      </div>

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
        {hasMultiple && (
          <Button
            onClick={handleSkipAll}
            variant="ghost"
            size="sm"
            className="flex-1"
          >
            모두 건너뛰기
          </Button>
        )}
        {isLastAnnouncement ? (
          <Button
            onClick={handleCloseAnnouncement}
            size="sm"
            className="flex-1"
          >
            확인
          </Button>
        ) : (
          <Button onClick={handleNext} size="sm" className="flex-1">
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
        <DrawerContent>
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>공지사항</DialogTitle>
          <DialogDescription>새로운 소식을 확인하세요</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
