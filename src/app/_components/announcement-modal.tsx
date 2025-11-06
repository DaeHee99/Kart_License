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
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
}

interface AnnouncementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
  currentAnnouncement: Announcement | undefined;
  currentIndex: number;
  totalCount: number;
  dontShowAgain: boolean;
  onDontShowAgainChange: (checked: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function AnnouncementModal({
  open,
  onOpenChange,
  isMobile,
  currentAnnouncement,
  currentIndex,
  totalCount,
  dontShowAgain,
  onDontShowAgainChange,
  onPrevious,
  onNext,
  onClose,
}: AnnouncementModalProps) {
  if (!currentAnnouncement) return null;

  const content = (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 shrink-0 rounded-full p-2">
          <Sparkles className="text-primary h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="mb-1 font-bold">{currentAnnouncement.title}</h4>
          <p className="text-muted-foreground text-sm whitespace-pre-wrap">
            {currentAnnouncement.content}
          </p>
        </div>
      </div>

      {/* 페이지네이션 인디케이터 */}
      {totalCount > 1 && (
        <div className="flex items-center justify-center gap-2 py-2">
          {Array.from({ length: totalCount }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/30 w-1.5"
              }`}
            />
          ))}
        </div>
      )}

      {/* 다시 보지 않기 체크박스 */}
      <div className="flex items-center gap-2 px-1">
        <Checkbox
          id="dont-show-again"
          checked={dontShowAgain}
          onCheckedChange={(checked) => onDontShowAgainChange(checked as boolean)}
        />
        <Label
          htmlFor="dont-show-again"
          className="text-muted-foreground cursor-pointer text-sm"
        >
          이 공지사항 다시 보지 않기
        </Label>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2">
        {totalCount > 1 && currentIndex > 0 && (
          <Button
            variant="outline"
            onClick={onPrevious}
            className="flex-1"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            이전
          </Button>
        )}
        <Button onClick={onClose} className="flex-1">
          {currentIndex < totalCount - 1 ? (
            <>
              다음
              <ChevronRight className="ml-1 h-4 w-4" />
            </>
          ) : (
            "확인"
          )}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
