"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { TierType } from "@/lib/types";
import { ShareContent } from "./share-content";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finalTier: TierType;
  user?: {
    name: string;
    image?: string;
  } | null;
  season: number;
  createdAt: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  finalTier,
  user,
  season,
  createdAt,
}: ShareDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>공유하기</DrawerTitle>
            <DrawerDescription>
              결과를 공유할 수 있는 링크를 생성합니다.
            </DrawerDescription>
          </DrawerHeader>

          <ScrollArea className="max-h-[90vh] overflow-y-auto px-1">
            <ShareContent
              finalTier={finalTier}
              user={user}
              season={season}
              createdAt={createdAt}
              onDialogClose={() => onOpenChange(false)}
            />
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col px-0 sm:max-w-[500px]">
        <DialogHeader className="px-6">
          <DialogTitle>공유하기</DialogTitle>
          <DialogDescription>
            결과를 공유할 수 있는 링크를 생성합니다.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] overflow-y-auto pr-4 pl-6">
          <ShareContent
            finalTier={finalTier}
            user={user}
            season={season}
            createdAt={createdAt}
            onDialogClose={() => onOpenChange(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
