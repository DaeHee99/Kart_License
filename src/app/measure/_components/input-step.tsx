"use client";

import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/card";
import { InputMethod, TierType, UserMapRecord } from "@/lib/types";
import { MapRecord as APIMapRecord } from "@/lib/api/types";
import { AnimatedBackground } from "./animated-background";
import { InputHeader } from "./input-header";
import { MapInfoCard } from "./map-info-card";
import { TierSelectionInput } from "./tier-selection-input";
import { ManualRecordInput } from "./manual-record-input";
import { useRef } from "react";

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
  onCancel: () => void;
  onTierSelect: (tier: TierType) => void;
  onInputChange: (value: string) => void;
  onManualInput: () => void;
  onSkip: () => void;
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
  onCancel,
  onTierSelect,
  onInputChange,
  onManualInput,
  onSkip,
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
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
