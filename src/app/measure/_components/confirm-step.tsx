"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2 } from "lucide-react";
import { UserMapRecord } from "@/lib/types";
import { MapRecord as APIMapRecord } from "@/lib/api/types";
import { TIERS } from "@/lib/types";
import { AnimatedBackground } from "./animated-background";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import Portal from "@/components/portal";
import { useSaveRecord } from "@/hooks/use-records";
import { saveGuestMeasurement } from "@/lib/guest-storage";
import { useInView } from "react-intersection-observer";

// Difficulty 뱃지 색상 매핑
const DIFFICULTY_COLORS = {
  루키: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  L3: "bg-green-500/10 text-green-600 border-green-500/30",
  L2: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  L1: "bg-red-500/10 text-red-600 border-red-500/30",
};

// 개별 기록 항목 컴포넌트 (Intersection Observer 적용)
function RecordItem({
  record,
  map,
  onEdit,
}: {
  record: UserMapRecord;
  map: (APIMapRecord & { id: string }) | undefined;
  onEdit: () => void;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -10 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      onClick={onEdit}
      className="border-border/50 hover:bg-primary/5 hover:border-primary/30 flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-all duration-200"
    >
      <div className="flex min-w-0 items-center gap-2">
        {map?.difficulty && (
          <Badge
            variant="outline"
            className={`shrink-0 text-xs font-semibold ${DIFFICULTY_COLORS[map.difficulty as keyof typeof DIFFICULTY_COLORS]}`}
          >
            {map.difficulty}
          </Badge>
        )}
        <span className="truncate">{map?.name}</span>
      </div>
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
}

interface ConfirmStepProps {
  records: UserMapRecord[];
  maps: Array<APIMapRecord & { id: string }>;
  season: number;
  userId?: string;
  isAuthenticated: boolean;
  onEditMap: (mapIndex: number) => void;
  onRestart: () => void;
}

export function ConfirmStep({
  records,
  maps,
  season,
  userId,
  isAuthenticated,
  onEditMap,
  onRestart,
}: ConfirmStepProps) {
  const router = useRouter();
  const { mutate: saveRecord, isPending } = useSaveRecord();

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

  const handleSubmit = () => {
    // 서버에 저장할 데이터 준비
    const recordsToSave = records.map((record, index) => {
      const map = maps[index];
      return {
        mapName: map.name,
        difficulty: map.difficulty,
        record: record.record || "",
        tier: record.tier || "bronze",
      };
    });

    // 비로그인 유저의 경우 로컬 스토리지에도 저장
    if (!isAuthenticated) {
      saveGuestMeasurement({
        season,
        records: recordsToSave,
      });
    }

    // 서버에 저장
    saveRecord({
      userId,
      season,
      records: recordsToSave,
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-24">
      <AnimatedBackground
        variant="confirm"
        particles={inputParticles}
        confettiParticles={confettiParticles}
      />

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
                const map = maps.find((m) => m.id === record.mapId);
                return (
                  <RecordItem
                    key={index}
                    record={record}
                    map={map}
                    onEdit={() => onEditMap(index)}
                  />
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Sticky Bottom Buttons */}
        <Portal>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-background/95 border-border fixed right-0 bottom-0 left-0 z-50 border-t p-4 backdrop-blur-md"
          >
            <div className="mx-auto flex max-w-2xl gap-3">
              <Button variant="outline" onClick={onRestart} className="flex-1">
                다시 입력
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 flex-1 bg-linear-to-r"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  "결과 확인하기"
                )}
              </Button>
            </div>
          </motion.div>
        </Portal>
      </div>
    </div>
  );
}
