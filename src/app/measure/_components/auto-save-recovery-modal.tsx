"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AutoSaveRecoveryModalProps {
  open: boolean;
  onRecover: () => void;
  onDiscard: () => void;
  recordCount: number;
  lastMapIndex: number;
  totalMaps: number;
}

export function AutoSaveRecoveryModal({
  open,
  onRecover,
  onDiscard,
  recordCount,
  lastMapIndex,
  totalMaps,
}: AutoSaveRecoveryModalProps) {
  const isMobile = useIsMobile();

  const content = (
    <div className="space-y-4">
      <div className="bg-primary/5 border-primary/20 rounded-lg border p-4">
        <div className="flex items-center gap-3">
          <div className="from-primary/20 to-secondary/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br">
            <Clock className="text-primary h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {lastMapIndex + 1}번째 트랙까지 진행 ({totalMaps}개 중)
            </p>
            <p className="text-muted-foreground text-xs">
              저장된 기록: {recordCount}개
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const footer = (
    <div className="flex w-full gap-2">
      <Button
        variant="outline"
        onClick={onDiscard}
        className="text-destructive hover:bg-destructive/10 flex-1"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        삭제하고 새로 시작
      </Button>
      <Button
        onClick={onRecover}
        className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 flex-1 bg-linear-to-r"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        이어서 측정
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={(isOpen) => !isOpen && onDiscard()}
        shouldScaleBackground={false}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <RotateCcw className="text-primary h-5 w-5" />
              이전 측정 기록 발견
            </DrawerTitle>
            <DrawerDescription>
              이전에 측정 중이던 기록이 있습니다. 이어서 측정하시겠습니까?
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-2">{content}</div>
          <DrawerFooter>{footer}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDiscard()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="text-primary h-5 w-5" />
            이전 측정 기록 발견
          </DialogTitle>
          <DialogDescription>
            이전에 측정 중이던 기록이 있습니다. 이어서 측정하시겠습니까?
          </DialogDescription>
        </DialogHeader>
        {content}
        <DialogFooter className="flex-row gap-2 sm:flex-row">{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
