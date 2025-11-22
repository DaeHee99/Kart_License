"use client";

import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputMethod, TierType, UserMapRecord } from "@/lib/types";
import { MapRecord as APIMapRecord } from "@/lib/api/types";
import { AnimatedBackground } from "./animated-background";
import { InputHeader } from "./input-header";
import { MapInfoCard } from "./map-info-card";
import { TierSelectionInput } from "./tier-selection-input";
import { ManualRecordInput } from "./manual-record-input";
import { useRef } from "react";
import { History } from "lucide-react";

interface InputStepProps {
  inputMethod: InputMethod;
  currentMapIndex: number;
  totalMaps: number;
  currentMap: APIMapRecord & { id: string };
  records: UserMapRecord[];
  currentInput: string;
  matchedTier: TierType | null;
  previousRecord: {
    mapName: string;
    difficulty: string;
    record: string;
    tier: TierType;
  } | null;
  hasPreviousRecords?: boolean;
  onCancel: () => void;
  onTierSelect: (tier: TierType) => void;
  onInputChange: (value: string) => void;
  onManualInput: () => void;
  onSkip: () => void;
  onUsePreviousRecords?: () => void;
  onSearchTrack?: () => void;
  isEditMode?: boolean;
}

export function InputStep({
  inputMethod,
  currentMapIndex,
  totalMaps,
  currentMap,
  records,
  currentInput,
  matchedTier,
  previousRecord,
  hasPreviousRecords,
  onCancel,
  onTierSelect,
  onInputChange,
  onManualInput,
  onSkip,
  onUsePreviousRecords,
  onSearchTrack,
  isEditMode,
}: InputStepProps) {
  const progress = ((records.length + 1) / totalMaps) * 100;

  // Reduced particles for confirm screen
  const confirmParticles = useRef(
    Array.from({ length: 4 }, (_, i) => ({
      left: 25 + ((i * 16) % 50),
      top: 25 + ((i * 16) % 50),
      x: (i % 3) * 3 - 4,
      duration: 3 + (i % 2) * 2,
      delay: (i * 0.5) % 2,
    })),
  ).current;

  // Reduced progress particles
  const progressParticles = useRef(
    Array.from({ length: 5 }, (_, i) => ({
      left: 15 + ((i * 15) % 70),
      top: 15 + ((i * 15) % 70),
      duration: 3 + (i % 2) * 2,
      delay: (i * 0.6) % 3,
    })),
  ).current;

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      <AnimatedBackground
        variant="input"
        particles={confirmParticles}
        progressParticles={progressParticles}
      />

      {/* Header */}
      <InputHeader
        currentMapNumber={records.length + 1}
        totalMaps={totalMaps}
        progress={progress}
        onCancel={onCancel}
        onSearchTrack={onSearchTrack}
        isEditMode={isEditMode}
      />

      {/* Main Content */}
      <div className="relative z-10 px-4 pt-10">
        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMapIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-primary/10 from-card via-card to-primary/5 relative space-y-6 overflow-hidden border-2 bg-linear-to-br p-6 shadow-xl">
                {/* Shimmer effect */}
                <motion.div
                  className="via-primary/5 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                />

                {/* Map Info */}
                <MapInfoCard map={currentMap} />

                {/* Input Area */}
                {inputMethod === "button" ? (
                  <TierSelectionInput
                    map={currentMap}
                    previousTier={previousRecord?.tier}
                    onTierSelect={onTierSelect}
                  />
                ) : (
                  <ManualRecordInput
                    currentInput={currentInput}
                    matchedTier={matchedTier}
                    previousRecord={previousRecord?.record}
                    onInputChange={onInputChange}
                    onSkip={onSkip}
                    onSubmit={onManualInput}
                  />
                )}
              </Card>

              {/* Quick Result Button - Only shown on first map when previous records exist */}
              {currentMapIndex === 0 &&
                hasPreviousRecords &&
                onUsePreviousRecords && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.2 }}
                    className="mt-4"
                  >
                    <Card className="border-muted-foreground/20 bg-muted/30 p-4">
                      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                        <div className="flex items-center gap-2">
                          <History className="text-muted-foreground h-5 w-5" />
                          <span className="text-muted-foreground text-sm">
                            이전 측정 기록이 있습니다
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          onClick={onUsePreviousRecords}
                          className="w-full sm:w-auto"
                        >
                          <History className="mr-2 h-4 w-4" />
                          이전 기록으로 즉시 결과 확인
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
