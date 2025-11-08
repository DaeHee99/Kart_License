"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { TierType, MapRecord } from "@/lib/types";
import { TIERS } from "@/lib/types";

interface TierSelectionInputProps {
  map: MapRecord;
  onTierSelect: (tier: TierType) => void;
}

export function TierSelectionInput({
  map,
  onTierSelect,
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
      <div className="grid grid-cols-1 gap-2">
        {(Object.keys(TIERS) as TierType[]).map((tierId, index) => {
          const tier = TIERS[tierId];
          const record = map.tierRecords[tierId];
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
              {/* Glow on hover */}
              <div
                className={`absolute -inset-0.5 bg-linear-to-r ${tier.color} rounded-lg opacity-0 blur transition-opacity duration-200 group-hover:opacity-30`}
              />

              <Button
                variant="outline"
                onClick={() => onTierSelect(tierId)}
                className="hover:border-primary hover:from-primary/5 hover:to-secondary/5 relative h-auto w-full justify-between bg-linear-to-r py-4 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${tier.color}`} />
                  <span className="font-medium">{tier.nameKo}</span>
                </div>
                <span className="text-muted-foreground font-mono text-sm">
                  {record}
                </span>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
