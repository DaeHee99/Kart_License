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
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TierBadge } from "@/components/tier-badge";
import { TIERS, TierType } from "@/lib/types";
import { TIER_DETAILS } from "@/lib/tier-details-data";
import { Target, Lightbulb, BarChart3, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TierDetailModalProps {
  selectedTier: TierType | null;
  onClose: () => void;
}

export function TierDetailModal({
  selectedTier,
  onClose,
}: TierDetailModalProps) {
  const isMobile = useIsMobile();

  if (!selectedTier) return null;

  const content = (
    <div className="space-y-6">
      {/* Tier Badge */}
      <div className="flex flex-col items-center py-4">
        <TierBadge tier={selectedTier} size="xl" showLabel={false} animate />
        <div className="mt-4 text-center">
          <h3 className="mb-1 text-2xl font-bold">
            {TIERS[selectedTier].nameKo}
          </h3>
          <p className="text-muted-foreground">{TIERS[selectedTier].name}</p>
        </div>
      </div>

      <Separator />

      {/* Skill Level & Percentage */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Target className="text-primary h-4 w-4" />
            <span className="text-muted-foreground text-sm">실력 수준</span>
          </div>
          <p className="font-semibold">
            {TIER_DETAILS[selectedTier].skillLevel}
          </p>
        </Card>
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <BarChart3 className="text-primary h-4 w-4" />
            <span className="text-muted-foreground text-sm">유저 분포</span>
          </div>
          <p className="font-semibold">
            {TIER_DETAILS[selectedTier].percentage}
          </p>
        </Card>
      </div>

      {/* Characteristics */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-semibold">
          <Sparkles className="text-primary h-4 w-4" />군 특징
        </h4>
        <ul className="space-y-2">
          {TIER_DETAILS[selectedTier].characteristics.map((char, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <div
                className={`h-1.5 w-1.5 rounded-full ${TIERS[selectedTier].color} mt-1.5 shrink-0`}
              />
              <span className="text-muted-foreground">{char}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tips */}
      <div>
        <h4 className="mb-3 flex items-center gap-2 font-semibold">
          <Lightbulb className="text-primary h-4 w-4" />
          실력 향상 팁
        </h4>
        <ul className="space-y-2">
          {TIER_DETAILS[selectedTier].tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <div className="bg-primary/10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                <span className="text-primary text-xs">{index + 1}</span>
              </div>
              <span className="text-muted-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button className="w-full" onClick={onClose}>
        확인
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={!!selectedTier} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>군 상세 정보</DrawerTitle>
            <DrawerDescription>
              {TIERS[selectedTier].nameKo} 군에 대해 자세히 알아보세요
            </DrawerDescription>
          </DrawerHeader>

          <div className="max-h-[calc(80vh-120px)] space-y-6 overflow-y-auto px-4 pb-6">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={!!selectedTier} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>군 상세 정보</DialogTitle>
          <DialogDescription>
            {TIERS[selectedTier].nameKo} 군에 대해 자세히 알아보세요
          </DialogDescription>
        </DialogHeader>

        {content}
      </DialogContent>
    </Dialog>
  );
}
