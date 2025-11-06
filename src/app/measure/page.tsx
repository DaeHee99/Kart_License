"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { MOCK_MAPS } from "@/lib/mock-data";
import { TierType, UserMapRecord, InputMethod } from "@/lib/types";
import { TIERS } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Circle,
  Zap,
  Gauge,
  KeyboardIcon,
  MousePointer2,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { findMatchingTier } from "@/lib/utils-calc";
import { useRouter } from "next/navigation";

export default function MeasurePage() {
  const router = useRouter();

  const onNavigate = (page: string) => {
    router.push(page);
  };

  const onComplete = (records: UserMapRecord[]) => {
    // Store records in sessionStorage for result page
    sessionStorage.setItem("measurementRecords", JSON.stringify(records));
    router.push("/result");
  };
  const [step, setStep] = useState<"select-method" | "input" | "confirm">(
    "select-method",
  );
  const [inputMethod, setInputMethod] = useState<InputMethod | null>(null);
  const [currentMapIndex, setCurrentMapIndex] = useState(0);
  const [records, setRecords] = useState<UserMapRecord[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Generate stable particle positions - reduced count for performance
  const methodParticles = useRef(
    Array.from({ length: 4 }, (_, i) => ({
      left: (i * 25 + 10) % 100,
      top: (i * 25 + 10) % 100,
      x: (i % 3) * 4 - 6,
      duration: 4 + (i % 2) * 2,
      delay: (i * 0.5) % 2,
    })),
  ).current;

  // Reduced particles for input screen
  const inputParticles = useRef(
    Array.from({ length: 6 }, (_, i) => ({
      left: (i * 16 + 10) % 100,
      top: (i * 16 + 10) % 100,
      x: (i % 4) * 3 - 6,
      duration: 4 + (i % 2) * 2,
      delay: (i * 0.4) % 2,
    })),
  ).current;

  // Reduced confetti particles
  const confettiParticles = useRef(
    Array.from({ length: 5 }, (_, i) => ({
      left: 20 + ((i * 12) % 60),
      x: (i % 3) * 30 - 45,
      rotate: 360 * (i % 2 === 0 ? 1 : -1),
      duration: 4 + (i % 2) * 2,
    })),
  ).current;

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

  const currentMap = MOCK_MAPS[currentMapIndex];
  const progress = ((records.length + 1) / MOCK_MAPS.length) * 100;

  // Get matched tier for current input
  const matchedTier =
    currentInput.length === 8
      ? findMatchingTier(currentInput, currentMap.tierRecords)
      : null;

  const handleMethodSelect = (method: InputMethod) => {
    setInputMethod(method);
    setStep("input");
  };

  const handleTierSelect = (tier: TierType) => {
    const newRecord: UserMapRecord = {
      mapId: currentMap.id,
      tier,
      record: currentMap.tierRecords[tier],
    };

    let updatedRecords;
    if (isEditMode && editingIndex !== null) {
      // 편집 모드일 때는 원래 위치에 삽입
      updatedRecords = [...records];
      updatedRecords.splice(editingIndex, 0, newRecord);
      setEditingIndex(null);
    } else {
      // 일반 입력 모드
      updatedRecords = [...records, newRecord];
    }
    setRecords(updatedRecords);

    if (isEditMode) {
      setIsEditMode(false);
      setStep("confirm");
    } else if (currentMapIndex < MOCK_MAPS.length - 1) {
      setCurrentMapIndex(currentMapIndex + 1);
    } else {
      setStep("confirm");
    }
  };

  const handleManualInput = () => {
    if (!currentInput || currentInput.length !== 8) return;

    const newRecord: UserMapRecord = {
      mapId: currentMap.id,
      record: currentInput,
      tier: matchedTier || undefined,
    };

    let updatedRecords;
    if (isEditMode && editingIndex !== null) {
      // 편집 모드일 때는 원래 위치에 삽입
      updatedRecords = [...records];
      updatedRecords.splice(editingIndex, 0, newRecord);
      setEditingIndex(null);
    } else {
      // 일반 입력 모드
      updatedRecords = [...records, newRecord];
    }
    setRecords(updatedRecords);
    setCurrentInput("");

    if (isEditMode) {
      setIsEditMode(false);
      setStep("confirm");
    } else if (currentMapIndex < MOCK_MAPS.length - 1) {
      setCurrentMapIndex(currentMapIndex + 1);
    } else {
      setStep("confirm");
    }
  };

  const handleInputChange = (value: string) => {
    // Auto-format MM:SS:mm
    const numbers = value.replace(/\D/g, "");
    let formatted = "";

    if (numbers.length > 0) {
      formatted = numbers.substring(0, 2);
      if (numbers.length > 2) {
        formatted += ":" + numbers.substring(2, 4);
      }
      if (numbers.length > 4) {
        formatted += ":" + numbers.substring(4, 6);
      }
    }

    setCurrentInput(formatted);
  };

  const handleSkip = () => {
    // Skip with 99:99:99 record and lowest tier (bronze)
    const newRecord: UserMapRecord = {
      mapId: currentMap.id,
      record: "99:99:99",
      tier: "bronze",
    };

    let updatedRecords;
    if (isEditMode && editingIndex !== null) {
      // 편집 모드일 때는 원래 위치에 삽입
      updatedRecords = [...records];
      updatedRecords.splice(editingIndex, 0, newRecord);
      setEditingIndex(null);
    } else {
      // 일반 입력 모드
      updatedRecords = [...records, newRecord];
    }
    setRecords(updatedRecords);

    if (isEditMode) {
      setIsEditMode(false);
      setStep("confirm");
    } else if (currentMapIndex < MOCK_MAPS.length - 1) {
      setCurrentMapIndex(currentMapIndex + 1);
    } else {
      setStep("confirm");
    }
  };

  const handleSubmit = () => {
    onComplete(records);
  };

  const handleEditMap = (mapIndex: number) => {
    // 해당 맵으로 이동하고 그 맵의 기록을 제거
    setCurrentMapIndex(mapIndex);
    const updatedRecords = records.filter((_, index) => index !== mapIndex);
    setRecords(updatedRecords);
    setStep("input");
    setIsEditMode(true);
    setEditingIndex(mapIndex);
  };

  if (step === "select-method") {
    return (
      <div className="relative min-h-screen overflow-hidden px-4">
        {/* Animated Background - optimized */}
        <div className="from-primary/5 via-secondary/5 to-primary/5 absolute inset-0 bg-gradient-to-br">
          <motion.div
            className="bg-primary/10 absolute top-20 left-10 hidden h-64 w-64 rounded-full blur-3xl md:block"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ willChange: "transform, opacity" }}
          />
          <motion.div
            className="bg-secondary/10 absolute right-10 bottom-20 hidden h-64 w-64 rounded-full blur-3xl md:block"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ willChange: "transform, opacity" }}
          />

          {/* Floating particles */}
          {methodParticles.map((particle, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, particle.x, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            >
              {i % 2 === 0 ? (
                <Star className="text-primary fill-primary/50 h-3 w-3" />
              ) : (
                <Sparkles className="text-secondary h-3 w-3" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-4xl pt-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="space-y-4 text-center">
              {/* Hero Card */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Card className="border-primary/20 from-background via-primary/5 to-background overflow-hidden border-2 bg-gradient-to-br p-6">
                  {/* Shimmer effect */}
                  <motion.div
                    className="via-primary/10 absolute inset-0 bg-gradient-to-r from-transparent to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut",
                    }}
                  />

                  <div className="relative flex items-start gap-4">
                    {/* Icon */}
                    <motion.div
                      className="from-primary to-secondary flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br"
                      whileHover={{ scale: 1.05, rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Gauge className="h-7 w-7 text-white" />
                    </motion.div>

                    {/* Text Content */}
                    <div className="flex-1 text-left">
                      <h2 className="mb-1 text-xl font-bold">측정 방식 선택</h2>
                      <p className="text-muted-foreground text-sm">
                        편한 방식을 선택하여 기록을 입력하세요
                      </p>
                    </div>

                    {/* Decorative Sparkle */}
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="hidden sm:block"
                    >
                      <Sparkles className="text-primary h-5 w-5" />
                    </motion.div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="from-primary/20 to-secondary/20 border-primary/20 inline-flex items-center gap-2 rounded-full border bg-gradient-to-r px-4 py-2 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Gauge className="text-primary h-4 w-4" />
                </motion.div>
                <span className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-sm font-medium text-transparent">
                  실력 측정 시작하기
                </span>
              </motion.div>
            </div>

            {/* Options */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Tier Selection Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative"
              >
                {/* Glow effect */}
                <div className="from-primary/20 to-secondary/20 absolute -inset-1 rounded-xl bg-gradient-to-r opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

                <Card
                  className="hover:border-primary from-card via-card to-primary/5 relative cursor-pointer overflow-hidden border-2 bg-gradient-to-br p-8 transition-all"
                  onClick={() => handleMethodSelect("button")}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="via-primary/10 absolute inset-0 bg-gradient-to-r from-transparent to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Icon */}
                  <motion.div
                    className="from-primary/20 to-secondary/20 relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <MousePointer2 className="text-primary h-8 w-8" />
                    </motion.div>
                  </motion.div>

                  <div className="relative space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="text-center text-lg font-bold">
                        군 선택 방식
                      </h3>
                      <Badge className="from-primary to-secondary border-0 bg-gradient-to-r">
                        추천
                      </Badge>
                    </div>

                    <p className="text-muted-foreground line-clamp-2 min-h-[2.5rem] text-center text-sm">
                      각 맵의 군별 기준 기록을 보고 자신의 수준에 맞는 군을
                      선택합니다.
                    </p>

                    <div className="text-primary flex items-center justify-center gap-2 pt-3 text-sm">
                      <Zap className="h-4 w-4" />
                      <span>빠르게 측정</span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Manual Input Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative"
              >
                {/* Glow effect */}
                <div className="from-secondary/20 to-primary/20 absolute -inset-1 rounded-xl bg-gradient-to-r opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

                <Card
                  className="hover:border-primary from-card via-card to-secondary/5 relative cursor-pointer overflow-hidden border-2 bg-gradient-to-br p-8 transition-all"
                  onClick={() => handleMethodSelect("manual")}
                >
                  {/* Shimmer effect */}
                  <motion.div
                    className="via-secondary/10 absolute inset-0 bg-gradient-to-r from-transparent to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Icon */}
                  <motion.div
                    className="from-secondary/20 to-primary/20 relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    >
                      <KeyboardIcon className="text-secondary h-8 w-8" />
                    </motion.div>
                  </motion.div>

                  <div className="relative space-y-3">
                    <h3 className="text-center text-lg font-bold">
                      직접 입력 방식
                    </h3>

                    <p className="text-muted-foreground line-clamp-2 min-h-[2.5rem] text-center text-sm">
                      각 맵의 정확한 기록을 직접 입력합니다.
                    </p>

                    <div className="text-secondary flex items-center justify-center gap-2 pt-3 text-sm">
                      <Trophy className="h-4 w-4" />
                      <span>정확한 측정</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.2 }}
              className="group relative mt-8"
            >
              {/* Enhanced Glow effect on hover */}
              <div className="from-primary/50 via-secondary/50 to-primary/50 absolute -inset-1 rounded-xl bg-gradient-to-r opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate("/")}
                  className="border-border hover:border-primary from-background to-background hover:from-primary/10 hover:to-secondary/10 relative h-14 w-full border-2 bg-gradient-to-r font-medium shadow-md transition-all hover:shadow-xl"
                >
                  <motion.div
                    className="flex w-full items-center justify-center gap-2"
                    whileHover={{ x: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      animate={{ x: [0, -3, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </motion.div>
                    <span>뒤로가기</span>
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="relative min-h-screen overflow-hidden px-4 pb-24">
        {/* Animated Background */}
        <div className="via-primary/5 to-secondary/10 absolute inset-0 bg-gradient-to-br from-green-500/10">
          <motion.div
            className="absolute top-20 left-10 hidden h-72 w-72 rounded-full bg-green-500/20 blur-3xl md:block"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="bg-primary/20 absolute right-10 bottom-20 hidden h-64 w-64 rounded-full blur-3xl md:block"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="bg-secondary/15 absolute top-1/2 right-1/4 hidden h-56 w-56 rounded-full blur-3xl md:block"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating particles */}
          {inputParticles.map((particle, i) => (
            <motion.div
              key={`particle-confirm-${i}`}
              className="absolute"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -25, 0],
                x: [0, particle.x, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: particle.delay,
              }}
            >
              {i % 3 === 0 ? (
                <Star className="h-4 w-4 fill-green-500/50 text-green-500" />
              ) : i % 3 === 1 ? (
                <Sparkles className="text-primary h-3 w-3" />
              ) : (
                <CheckCircle2 className="text-secondary h-3 w-3" />
              )}
            </motion.div>
          ))}

          {/* Celebration confetti */}
          {confettiParticles.map((particle, i) => (
            <motion.div
              key={`confetti-${i}`}
              className="absolute"
              style={{
                left: `${particle.left}%`,
                top: "-10%",
              }}
              animate={{
                y: ["0vh", "120vh"],
                x: [0, particle.x],
                rotate: [0, particle.rotate],
                opacity: [1, 0.8, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeIn",
              }}
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  i % 3 === 0
                    ? "bg-green-500"
                    : i % 3 === 1
                      ? "bg-primary"
                      : "bg-secondary"
                }`}
              />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-2xl py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 pb-24"
          >
            <div className="space-y-3 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
              >
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold"
              >
                입력이 완료되었습니다!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground text-center text-xs"
              >
                각 맵을 누르면 선택 항목을 수정할 수 있습니다.
              </motion.p>
            </div>

            <Card className="border-primary/10 border-2 p-6 shadow-lg">
              <div className="space-y-2">
                {records.map((record, index) => {
                  const map = MOCK_MAPS.find((m) => m.id === record.mapId);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      onClick={() => handleEditMap(index)}
                      className="border-border/50 hover:bg-primary/5 hover:border-primary/30 flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-all duration-200"
                    >
                      <span>{map?.name}</span>
                      <div className="flex items-center gap-2">
                        {record.tier && (
                          <Badge variant="outline" className="gap-1.5">
                            <div
                              className={`h-2 w-2 rounded-full ${TIERS[record.tier].color}`}
                            />
                            {TIERS[record.tier].nameKo}
                          </Badge>
                        )}
                        {record.record && (
                          <span className="text-muted-foreground font-mono text-sm">
                            {record.record}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Sticky Bottom Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-background/95 border-border fixed right-0 bottom-0 left-0 z-60 border-t p-4 backdrop-blur-md"
          >
            <div className="mx-auto flex max-w-2xl gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("input");
                  setCurrentMapIndex(0);
                  setRecords([]);
                }}
                className="flex-1"
              >
                다시 입력
              </Button>
              <Button
                onClick={handleSubmit}
                className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 flex-1 bg-gradient-to-r"
              >
                결과 확인하기
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      {/* Animated Background */}
      <div className="from-primary/5 via-background to-secondary/5 absolute inset-0 bg-gradient-to-br">
        <motion.div
          className="bg-primary/10 absolute top-10 right-20 hidden h-48 w-48 rounded-full blur-3xl md:block"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="bg-secondary/10 absolute bottom-20 left-20 hidden h-48 w-48 rounded-full blur-3xl md:block"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Additional animated blobs */}
        <motion.div
          className="bg-primary/15 absolute top-1/3 left-1/4 hidden h-56 w-56 rounded-full blur-3xl md:block"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="bg-secondary/12 absolute right-1/4 bottom-1/3 hidden h-64 w-64 rounded-full blur-3xl md:block"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        {confirmParticles.map((particle, i) => (
          <motion.div
            key={`particle-input-${i}`}
            className="absolute"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, particle.x, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          >
            {i % 2 === 0 ? (
              <Circle className="text-primary fill-primary/30 h-2 w-2" />
            ) : (
              <Star className="text-secondary fill-secondary/30 h-2 w-2" />
            )}
          </motion.div>
        ))}

        {/* Additional sparkles for more visual interest */}
        {progressParticles.map((particle, i) => (
          <motion.div
            key={`sparkle-input-${i}`}
            className="absolute"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="text-primary h-3 w-3" />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-background/95 border-border relative sticky top-0 z-40 border-b px-4 py-3 shadow-sm backdrop-blur-md">
        {/* Subtle glow effect */}
        <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-r via-transparent opacity-50" />

        <div className="relative mx-auto max-w-2xl space-y-3">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("/")}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                취소
              </Button>
            </motion.div>

            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-sm font-medium text-transparent"
            >
              {records.length + 1} / {MOCK_MAPS.length}
            </motion.span>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="origin-left"
          >
            <Progress value={progress} className="h-2" />
          </motion.div>
        </div>
      </div>

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
              <Card className="border-primary/10 from-card via-card to-primary/5 relative space-y-6 overflow-hidden border-2 bg-gradient-to-br p-6 shadow-xl">
                {/* Shimmer effect */}
                <motion.div
                  className="via-primary/5 absolute inset-0 bg-gradient-to-r from-transparent to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                />

                {/* Map Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                  className="relative mb-0 space-y-4"
                >
                  {/* Map Image and Name in one row */}
                  <div className="flex items-center gap-4">
                    {/* Map Image */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.2 }}
                      className="group relative"
                    >
                      <div className="from-primary/30 to-secondary/30 absolute -inset-1 rounded-xl bg-gradient-to-br opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="from-muted to-muted/50 border-primary/10 relative flex h-20 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-br">
                        <span className="text-muted-foreground text-xs">
                          맵 이미지
                        </span>
                      </div>
                    </motion.div>

                    {/* Map Name and Difficulty */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.2 }}
                      className="min-w-0 flex-1"
                    >
                      <h3 className="from-foreground to-foreground/70 mb-1 truncate bg-gradient-to-r bg-clip-text text-xl font-bold">
                        {currentMap.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="from-primary/20 to-secondary/20 border-primary/20 bg-gradient-to-r text-xs"
                        >
                          {currentMap.difficulty}
                        </Badge>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Input Area */}
                {inputMethod === "button" ? (
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
                      {(Object.keys(TIERS) as TierType[]).map(
                        (tierId, index) => {
                          const tier = TIERS[tierId];
                          const record = currentMap.tierRecords[tierId];
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
                                className={`absolute -inset-0.5 bg-gradient-to-r ${tier.color} rounded-lg opacity-0 blur transition-opacity duration-200 group-hover:opacity-30`}
                              />

                              <Button
                                variant="outline"
                                onClick={() => handleTierSelect(tierId)}
                                className="hover:border-primary hover:from-primary/5 hover:to-secondary/5 relative h-auto w-full justify-between bg-gradient-to-r py-4 transition-all duration-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`h-3 w-3 rounded-full ${tier.color}`}
                                  />
                                  <span className="font-medium">
                                    {tier.nameKo}
                                  </span>
                                </div>
                                <span className="text-muted-foreground font-mono text-sm">
                                  {record}
                                </span>
                              </Button>
                            </motion.div>
                          );
                        },
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.2 }}
                    className="relative space-y-4"
                  >
                    <div className="space-y-3">
                      <label className="mb-2 block text-sm font-medium">
                        기록 입력 (MM:SS:mm)
                      </label>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder="012345"
                        value={currentInput}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="focus:border-primary from-background to-background focus:from-primary/5 focus:to-secondary/5 h-14 border-2 bg-gradient-to-r text-center font-mono text-lg transition-all"
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
                            className="via-primary/5 to-secondary/5 relative overflow-hidden rounded-lg border-2 border-green-500/30 bg-gradient-to-r from-green-500/10 p-4"
                          >
                            {/* Shimmer effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent"
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
                                      <div
                                        className={`h-2 w-2 rounded-full bg-white`}
                                      />
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
                          <div className="bg-primary mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                          <p className="text-muted-foreground text-xs">
                            <span className="text-foreground font-medium">
                              숫자 6자리만 입력
                            </span>
                            하세요 (예: 012345)
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="bg-primary mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                          <p className="text-muted-foreground text-xs">
                            구분자(<span className="font-mono">:</span>)는{" "}
                            <span className="text-foreground font-medium">
                              자동으로 추가
                            </span>
                            됩니다
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="bg-secondary mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
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
                      <Button
                        variant="outline"
                        onClick={handleSkip}
                        className="hover:bg-muted/50 flex-1"
                      >
                        건너뛰기
                      </Button>
                      <Button
                        onClick={handleManualInput}
                        disabled={currentInput.length !== 8}
                        className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 flex-1 bg-gradient-to-r"
                      >
                        다음
                      </Button>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
