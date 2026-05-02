"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/tier-badge";
import { TIERS, TierType } from "@/lib/types";
import { SEASON_COLORS } from "../../../lib/mypage-constants";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  FileChartColumnIncreasing,
  Loader2,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";

interface MeasurementHistoryItem {
  id: string;
  date: string;
  tier: TierType;
  maps: number;
  season: string;
  deletedAt?: Date | string | null;
}

interface MeasurementHistoryTabProps {
  measurements: MeasurementHistoryItem[];
  isLoading?: boolean;
  allowDelete?: boolean;
  deletingId?: string | null;
  onDelete?: (measurementId: string) => void;
}

export function MeasurementHistoryTab({
  measurements,
  isLoading,
  allowDelete = false,
  deletingId,
  onDelete,
}: MeasurementHistoryTabProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] =
    useState<MeasurementHistoryItem | null>(null);
  const canDelete = allowDelete && !!onDelete;
  const visibleMeasurements = canDelete
    ? measurements.filter((measurement) => !measurement.deletedAt)
    : measurements;

  // 시즌 색상 생성 함수 (빨주노초파남보 반복)
  const getSeasonColor = (season: string) => {
    if (SEASON_COLORS[season]) {
      return SEASON_COLORS[season];
    }

    // 기본 색상 배열 (빨주노초파남보)
    const colors = [
      { bg: "bg-red-500/10", border: "border-red-500" },
      { bg: "bg-orange-500/10", border: "border-orange-500" },
      { bg: "bg-yellow-500/10", border: "border-yellow-500" },
      { bg: "bg-green-500/10", border: "border-green-500" },
      { bg: "bg-blue-500/10", border: "border-blue-500" },
      { bg: "bg-indigo-500/10", border: "border-indigo-500" },
      { bg: "bg-purple-500/10", border: "border-purple-500" },
    ];

    const seasonNumber = parseInt(season.replace("S", ""));
    return colors[seasonNumber % colors.length];
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="border-primary/20 flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin" />
        </Card>
      </div>
    );
  }

  if (visibleMeasurements.length === 0) {
    return (
      <div className="space-y-4">
        <Card className="border-primary/20 p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileChartColumnIncreasing className="text-primary h-5 w-5" />
            <h3 className="font-bold">나의 측정 기록</h3>
          </div>
          <div className="text-muted-foreground flex h-[300px] items-center justify-center text-center">
            <p>측정 기록이 없습니다. 기록 측정을 해보세요!</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <FileChartColumnIncreasing className="text-primary h-5 w-5" />
            <h3 className="font-bold">나의 측정 기록</h3>
          </div>
          {canDelete && (
            <div className="text-muted-foreground bg-muted/60 border-border/60 flex w-fit items-center gap-1 rounded-full border px-3 py-1 text-xs">
              <ChevronLeft className="h-3.5 w-3.5" />
              왼쪽으로 밀어 기록 삭제
            </div>
          )}
        </div>
        <div className="space-y-3">
          {visibleMeasurements.map((measurement, index) => {
            const seasonColor = getSeasonColor(measurement.season);
            return (
              <SwipeableMeasurementItem
                key={measurement.id}
                measurement={measurement}
                index={index}
                seasonColor={seasonColor}
                canDelete={canDelete}
                isDeleting={deletingId === measurement.id}
                onOpen={() => router.push(`/result/${measurement.id}`)}
                onRequestDelete={() => setDeleteTarget(measurement)}
              />
            );
          })}
        </div>
      </Card>

      <AlertDialog
        open={canDelete && deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>측정 기록 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 기록을 나의 측정 기록 목록에서 삭제하시겠습니까? 군 변화와
              시즌별 최고 기록에는 반영되지 않습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteTarget?.id === deletingId}>
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={
                !deleteTarget || !onDelete || deleteTarget.id === deletingId
              }
              className="border border-rose-500/20 bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300 dark:hover:bg-rose-400/15"
              onClick={() => {
                if (!deleteTarget || !onDelete) return;
                onDelete(deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface SwipeableMeasurementItemProps {
  measurement: MeasurementHistoryItem;
  index: number;
  seasonColor: { bg: string; border: string };
  canDelete: boolean;
  isDeleting: boolean;
  onOpen: () => void;
  onRequestDelete: () => void;
}

function SwipeableMeasurementItem({
  measurement,
  index,
  seasonColor,
  canDelete,
  isDeleting,
  onOpen,
  onRequestDelete,
}: SwipeableMeasurementItemProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const suppressClickRef = useRef(false);
  const actionProgress = canDelete ? (isRevealed ? 1 : dragProgress) : 0;

  const handleOpen = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    if (canDelete && isRevealed) {
      setIsRevealed(false);
      return;
    }

    onOpen();
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-transparent">
      {canDelete && actionProgress > 0 && (
        <motion.button
          type="button"
          aria-label={`${measurement.date} 측정 기록 삭제`}
          disabled={isDeleting}
          initial={false}
          animate={{
            opacity: actionProgress,
            scale: 0.72 + actionProgress * 0.28,
          }}
          transition={{ type: "spring", stiffness: 520, damping: 34 }}
          onClick={(event) => {
            event.stopPropagation();
            onRequestDelete();
          }}
          style={{ transformOrigin: "center right" }}
          className="absolute inset-y-0 right-0 flex w-24 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-700 transition-colors hover:bg-rose-500/15 disabled:opacity-60 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300 dark:hover:bg-rose-400/15"
        >
          {isDeleting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Trash2 className="h-5 w-5" />
          )}
        </motion.button>
      )}

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: canDelete && isRevealed ? -96 : 0 }}
        transition={{
          opacity: { delay: index * 0.05, duration: 0.2 },
          x: { type: "spring", stiffness: 500, damping: 40 },
        }}
        drag={canDelete ? "x" : false}
        dragConstraints={{ left: -96, right: 0 }}
        dragElastic={0.04}
        dragMomentum={false}
        onDragStart={() => {
          if (!canDelete) return;
          suppressClickRef.current = true;
        }}
        onDrag={(_, info) => {
          if (!canDelete) return;
          const nextProgress = Math.min(1, Math.max(0, -info.offset.x / 96));
          setDragProgress(nextProgress);
        }}
        onDragEnd={(_, info) => {
          if (!canDelete) return;
          const shouldReveal = info.offset.x < -40 || info.velocity.x < -350;
          setIsRevealed(shouldReveal);
          setDragProgress(0);
          window.setTimeout(() => {
            suppressClickRef.current = false;
          }, 0);
        }}
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleOpen();
          }

          if (
            canDelete &&
            (event.key === "Delete" || event.key === "Backspace")
          ) {
            event.preventDefault();
            onRequestDelete();
          }
        }}
        className={cn(
          "focus-visible:ring-ring group relative z-10 flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 shadow-sm transition-shadow duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          seasonColor.border,
          seasonColor.bg,
        )}
      >
        <div className="bg-foreground/4 pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <div className="flex min-w-0 items-center gap-4">
          <TierBadge tier={measurement.tier} size="sm" showLabel={false} />
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <div
                  className={`h-2 w-2 rounded-full ${TIERS[measurement.tier].color}`}
                />
                {TIERS[measurement.tier].nameKo}
              </Badge>
              <Badge variant="secondary" className="font-mono">
                {measurement.season}
              </Badge>
            </div>
            <p className="text-muted-foreground truncate text-sm">
              {measurement.date}
            </p>
          </div>
        </div>
        <div className="shrink-0 pl-3 text-right">
          <p className="text-sm font-medium">{measurement.maps}개 맵</p>
        </div>
      </motion.div>
    </div>
  );
}
