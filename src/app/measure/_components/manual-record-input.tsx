"use client";

import { useState, useRef, useEffect } from "react";
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
  // 개별 인풋 상태
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [centiseconds, setCentiseconds] = useState("");

  // 인풋 레퍼런스 (자동 포커스 이동용)
  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);
  const centisecondsRef = useRef<HTMLInputElement>(null);

  // currentInput이 변경되면 개별 상태 업데이트 (외부에서 값이 설정될 때)
  useEffect(() => {
    if (currentInput && currentInput.includes(":")) {
      const parts = currentInput.split(":");
      if (parts.length === 3) {
        setMinutes(parts[0]);
        setSeconds(parts[1]);
        setCentiseconds(parts[2]);
      }
    } else if (!currentInput) {
      setMinutes("");
      setSeconds("");
      setCentiseconds("");
    }
  }, [currentInput]);

  // 숫자만 허용하는 핸들러
  const handleNumericInput = (value: string) => {
    return value.replace(/\D/g, "");
  };

  // 부모에게 합친 값 전달 (패딩 적용)
  const sendCombinedValue = (min: string, sec: string, centi: string) => {
    if (min || sec || centi) {
      const paddedMin = (min || "0").padStart(2, "0");
      const paddedSec = (sec || "0").padStart(2, "0");
      const paddedCenti = (centi || "0").padStart(2, "0");
      onInputChange(`${paddedMin}:${paddedSec}:${paddedCenti}`);
    }
  };

  // 분 입력 핸들러 (00-99)
  const handleMinutesChange = (value: string) => {
    const numeric = handleNumericInput(value).slice(0, 2);
    setMinutes(numeric);

    // 2자리 입력 완료 시 다음 인풋으로 이동 + 부모에게 전달
    if (numeric.length === 2) {
      sendCombinedValue(numeric, seconds, centiseconds);
      secondsRef.current?.focus();
    }
  };

  // 초 입력 핸들러 (00-59)
  const handleSecondsChange = (value: string) => {
    let numeric = handleNumericInput(value).slice(0, 2);

    // 59 초과 방지
    if (numeric.length === 2) {
      const num = parseInt(numeric, 10);
      if (num > 59) {
        numeric = "59";
      }
    }

    setSeconds(numeric);

    // 2자리 입력 완료 시 다음 인풋으로 이동 + 부모에게 전달
    if (numeric.length === 2) {
      sendCombinedValue(minutes, numeric, centiseconds);
      centisecondsRef.current?.focus();
    }
  };

  // 밀리초 입력 핸들러 (00-99)
  const handleCentisecondsChange = (value: string) => {
    const numeric = handleNumericInput(value).slice(0, 2);
    setCentiseconds(numeric);

    // 2자리 입력 완료 시 부모에게 전달
    if (numeric.length === 2) {
      sendCombinedValue(minutes, seconds, numeric);
    }
  };

  // 포커스 해제 시 부모에게 값 전달
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    setter: (v: string) => void,
    maxValue?: number,
  ) => {
    const value = e.target.value;

    // 최댓값 초과 시 보정
    if (value.length === 2 && maxValue !== undefined) {
      const num = parseInt(value, 10);
      if (num > maxValue) {
        const correctedValue = maxValue.toString().padStart(2, "0");
        setter(correctedValue);
      }
    }

    // 블러 시 부모에게 최종 값 전달 (ref에서 직접 최신 값 읽기)
    setTimeout(() => {
      const min = minutesRef.current?.value || "";
      const sec = secondsRef.current?.value || "";
      const centi = centisecondsRef.current?.value || "";
      if (min || sec || centi) {
        sendCombinedValue(min, sec, centi);
      }
    }, 0);
  };

  // 백스페이스로 이전 인풋으로 이동
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    prevRef: React.RefObject<HTMLInputElement | null> | null,
    currentValue: string,
  ) => {
    if (e.key === "Backspace" && currentValue === "" && prevRef?.current) {
      prevRef.current.focus();
    }
  };

  // 최근 기록 적용
  const handleApplyPreviousRecord = () => {
    if (previousRecord) {
      onInputChange(previousRecord);
    }
  };

  // 다음 버튼 클릭 핸들러: 00:00:00이면 건너뛰기 처리
  const handleNext = () => {
    // 제출 전 최종 값 동기화
    sendCombinedValue(minutes, seconds, centiseconds);

    setTimeout(() => {
      if (currentInput === "00:00:00") {
        onSkip();
      } else {
        onSubmit();
      }
    }, 0);
  };

  // 입력 완료 여부 확인
  const isComplete =
    minutes.length >= 1 && seconds.length >= 1 && centiseconds.length >= 1;

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
            기록 입력 (분:초:밀리초)
          </label>
          {previousRecord && (
            <button
              onClick={handleApplyPreviousRecord}
              className="flex items-center gap-1.5 rounded-md border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-xs transition-colors hover:bg-blue-500/20"
            >
              <History className="h-3 w-3 text-blue-500" />
              <span className="text-blue-500">최근: {previousRecord}</span>
            </button>
          )}
        </div>

        {/* 3개의 분리된 인풋 */}
        <div className="flex items-center justify-center gap-2">
          {/* 분 (MM) */}
          <div className="flex flex-col items-center">
            <Input
              ref={minutesRef}
              type="tel"
              inputMode="numeric"
              placeholder="00"
              value={minutes}
              onChange={(e) => handleMinutesChange(e.target.value)}
              onBlur={(e) => handleBlur(e, setMinutes)}
              onKeyDown={(e) => handleKeyDown(e, null, minutes)}
              className="focus:border-primary focus:ring-primary/20 h-14 w-16 border-2 text-center font-mono text-xl transition-all focus:ring-2"
              maxLength={2}
            />
            <span className="text-muted-foreground mt-1 text-xs">분</span>
          </div>

          <span className="text-muted-foreground pb-5 text-2xl font-bold">
            :
          </span>

          {/* 초 (SS) */}
          <div className="flex flex-col items-center">
            <Input
              ref={secondsRef}
              type="tel"
              inputMode="numeric"
              placeholder="00"
              value={seconds}
              onChange={(e) => handleSecondsChange(e.target.value)}
              onBlur={(e) => handleBlur(e, setSeconds, 59)}
              onKeyDown={(e) => handleKeyDown(e, minutesRef, seconds)}
              className="focus:border-primary focus:ring-primary/20 h-14 w-16 border-2 text-center font-mono text-xl transition-all focus:ring-2"
              maxLength={2}
            />
            <span className="text-muted-foreground mt-1 text-xs">초</span>
          </div>

          <span className="text-muted-foreground pb-5 text-2xl font-bold">
            :
          </span>

          {/* 밀리초 (mm) */}
          <div className="flex flex-col items-center">
            <Input
              ref={centisecondsRef}
              type="tel"
              inputMode="numeric"
              placeholder="00"
              value={centiseconds}
              onChange={(e) => handleCentisecondsChange(e.target.value)}
              onBlur={(e) => handleBlur(e, setCentiseconds)}
              onKeyDown={(e) => handleKeyDown(e, secondsRef, centiseconds)}
              className="focus:border-primary focus:ring-primary/20 h-14 w-16 border-2 text-center font-mono text-xl transition-all focus:ring-2"
              maxLength={2}
            />
            <span className="text-muted-foreground mt-1 text-xs">밀리초</span>
          </div>
        </div>

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
              각 칸에{" "}
              <span className="text-foreground font-medium">
                숫자 2자리씩 입력
              </span>
              하세요
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
            <p className="text-muted-foreground text-xs">
              2자리 입력 시{" "}
              <span className="text-foreground font-medium">
                자동으로 다음 칸으로 이동
              </span>
              합니다
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-secondary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
            <p className="text-muted-foreground text-xs">
              예시: 1분 23초 45 →{" "}
              <span className="text-primary font-mono font-medium">
                01 : 23 : 45
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
          disabled={!isComplete}
          className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 flex-1 bg-linear-to-r"
        >
          다음
        </Button>
      </div>
    </motion.div>
  );
}
