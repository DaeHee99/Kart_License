"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TierType, TIERS } from "@/lib/types";
import { History, ChevronLeft, SkipForward } from "lucide-react";

interface TierSelectionInputProps {
  map: {
    id: string;
    name: string;
    difficulty: "루키" | "L3" | "L2" | "L1";
    imageUrl?: string;
    tierRecords: Record<TierType, string>;
  };
  previousTier?: TierType;
  onTierSelect: (tier: TierType) => void;
  onPrevious: () => void;
  onSkip: () => void;
  isEditMode?: boolean;
}

export function TierSelectionInput({
  map,
  previousTier,
  onTierSelect,
  onPrevious,
  onSkip,
  isEditMode,
}: TierSelectionInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.2 }}
      className="relative space-y-3"
    >
      <p className="text-muted-foreground text-center text-sm">
        자신의 기록과 가장 가까운 군을 선택하세요
      </p>
      {previousTier && (
        <div className="bg-blue-500/10 border-blue-500/30 flex items-center gap-2 rounded-lg border p-2">
          <History className="h-4 w-4 text-blue-500" />
          <span className="text-muted-foreground text-xs">
            최근 기록: <span className="text-blue-500 font-medium">{TIERS[previousTier].nameKo}</span>
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 gap-2">
        {(Object.keys(TIERS) as TierType[]).map((tierId, index) => {
          const tier = TIERS[tierId];
          const record = map.tierRecords[tierId];
          const isPreviousTier = tierId === previousTier;

          return (
            <motion.div
              key={tierId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.3 + index * 0.03,
                duration: 0.2,
              }}
              className="group relative"
            >
              {/* Glow on hover or if previous tier */}
              <div
                className={`absolute -inset-0.5 bg-linear-to-r ${tier.color} rounded-lg blur transition-opacity duration-200 ${
                  isPreviousTier ? 'opacity-40' : 'opacity-0 group-hover:opacity-30'
                }`}
              />

              <Button
                variant="outline"
                onClick={() => onTierSelect(tierId)}
                className={`relative h-auto w-full justify-between py-4 transition-all duration-200 ${
                  isPreviousTier
                    ? 'border-blue-500/50 bg-blue-500/10'
                    : 'hover:border-primary hover:from-primary/5 hover:to-secondary/5 bg-linear-to-r'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${tier.color}`} />
                  <span className="font-medium">{tier.nameKo}</span>
                  {isPreviousTier && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      최근
                    </Badge>
                  )}
                </div>
                <span className="text-muted-foreground font-mono text-sm">
                  {record}
                </span>
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* 이전/건너뛰기 버튼 */}
      {!isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.2 }}
          className="flex gap-2 pt-2"
        >
          <Button
            variant="outline"
            onClick={onPrevious}
            className="hover:bg-muted/50 flex-1"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            이전
          </Button>
          <Button
            variant="outline"
            onClick={onSkip}
            className="hover:bg-muted/50 flex-1"
          >
            건너뛰기
            <SkipForward className="ml-1 h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
