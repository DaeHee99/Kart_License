"use client";

import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trophy, CheckCircle2, History, ChevronLeft } from "lucide-react";
import { TierType } from "@/lib/types";
import { TIERS } from "@/lib/types";

interface ManualRecordInputProps {
  currentInput: string;
  matchedTier: TierType | null;
  previousRecord?: string;
  onInputChange: (value: string) => void;
  onPrevious: () => void;
  onSkip: () => void;
  onSubmit: () => void;
  isEditMode?: boolean;
}

export function ManualRecordInput({
  currentInput,
  matchedTier,
  previousRecord,
  onInputChange,
  onPrevious,
  onSkip,
  onSubmit,
  isEditMode,
}: ManualRecordInputProps) {
  // 다음 버튼 클릭 핸들러: 00:00:00이면 건너뛰기 처리
  const handleNext = () => {
    if (currentInput === "00:00:00") {
      onSkip();
    } else {
      onSubmit();
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.2 }}
      className="relative space-y-4"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">
            기록 입력 (MM:SS:mm)
          </label>
          {previousRecord && (
            <button
              onClick={() => onInputChange(previousRecord)}
              className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors"
            >
              <History className="h-3 w-3 text-blue-500" />
              <span className="text-blue-500">최근: {previousRecord}</span>
            </button>
          )}
        </div>
        <Input
          type="tel"
          inputMode="numeric"
          placeholder={previousRecord || "012345"}
          value={currentInput}
          onChange={(e) => onInputChange(e.target.value)}
          className="focus:border-primary from-background to-background focus:from-primary/5 focus:to-secondary/5 h-14 border-2 bg-linear-to-r text-center font-mono text-lg transition-all"
          maxLength={8}
        />

        {/* Real-time Tier Matching Display */}
        <AnimatePresence mode="wait">
          {matchedTier && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="via-primary/5 to-secondary/5 relative overflow-hidden rounded-lg border-2 border-green-500/30 bg-linear-to-r from-green-500/10 p-4"
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-transparent via-green-500/10 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut",
                }}
              />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Trophy className="h-5 w-5 text-green-500" />
                  </motion.div>
                  <div>
                    <p className="text-muted-foreground mb-0.5 text-xs">
                      예상 군
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`gap-1.5 ${TIERS[matchedTier].color} border-0`}
                      >
                        <div className={`h-2 w-2 rounded-full bg-white`} />
                        {TIERS[matchedTier].nameKo}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        로 매칭됩니다
                      </span>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Guide */}
        <div className="bg-primary/5 border-primary/10 space-y-2 rounded-lg border p-3">
          <div className="flex items-start gap-2">
            <div className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
            <p className="text-muted-foreground text-xs">
              <span className="text-foreground font-medium">
                숫자 6자리만 입력
              </span>
              하세요 (예: 012345)
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
            <p className="text-muted-foreground text-xs">
              구분자(<span className="font-mono">:</span>)는{" "}
              <span className="text-foreground font-medium">자동으로 추가</span>
              됩니다
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-secondary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
            <p className="text-muted-foreground text-xs">
              입력 예시: 1분 23초 45 →{" "}
              <span className="text-foreground font-mono font-medium">
                012345
              </span>{" "}
              →{" "}
              <span className="text-primary font-mono font-medium">
                01:23:45
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {!isEditMode && (
          <Button
            variant="outline"
            onClick={onPrevious}
            className="hover:bg-muted/50 flex-1"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            이전
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={currentInput.length !== 8}
          className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 flex-1 bg-linear-to-r"
        >
          다음
        </Button>
      </div>
    </motion.div>
  );
}
