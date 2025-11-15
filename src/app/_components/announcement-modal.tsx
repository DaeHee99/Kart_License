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
import { Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { useAnnouncements } from "@/hooks/use-announcements";

export function AnnouncementModal() {
  const isMobile = useIsMobile();
  const { announcements, isLoading } = useAnnouncements();

  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // 로컬스토리지에서 숨긴 공지사항 ID 가져오기
  const getDismissedAnnouncementId = (): string | null => {
    try {
      return localStorage.getItem("dismissed-announcement-id");
    } catch {
      return null;
    }
  };

  // 가장 최근 공지사항 1개만 가져오기 (이미 숨긴 공지사항 제외)
  const latestAnnouncement =
    announcements.length > 0 &&
    announcements[0]._id !== getDismissedAnnouncementId()
      ? announcements[0]
      : null;

  useEffect(() => {
    // 공지사항이 있고, 아직 표시되지 않았으면 500ms 후에 표시
    if (latestAnnouncement && !isLoading) {
      setTimeout(() => {
        setShowAnnouncement(true);
      }, 500);
    }
  }, [latestAnnouncement, isLoading]);

  const handleCloseAnnouncement = () => {
    if (latestAnnouncement && dontShowAgain) {
      // 이 공지사항 ID를 로컬스토리지에 저장
      localStorage.setItem(
        "dismissed-announcement-id",
        latestAnnouncement._id
      );
    }

    setShowAnnouncement(false);
    setDontShowAgain(false);
  };

  if (!latestAnnouncement || isLoading) return null;

  const content = (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 shrink-0 rounded-full p-2">
          <Sparkles className="text-primary h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="mb-1 font-bold">{latestAnnouncement.title}</h4>
          <p className="text-muted-foreground whitespace-pre-wrap text-sm">
            {latestAnnouncement.content}
          </p>
        </div>
      </div>

      {/* 다시 보지 않기 체크박스 */}
      <div className="flex items-center gap-2 px-1">
        <Checkbox
          id="dont-show-again"
          checked={dontShowAgain}
          onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
        />
        <Label
          htmlFor="dont-show-again"
          className="text-muted-foreground cursor-pointer text-sm"
        >
          이 공지사항 다시 보지 않기
        </Label>
      </div>

      {/* 확인 버튼 */}
      <Button onClick={handleCloseAnnouncement} className="w-full">
        확인
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={showAnnouncement} onOpenChange={setShowAnnouncement}>
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
    <Dialog open={showAnnouncement} onOpenChange={setShowAnnouncement}>
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
