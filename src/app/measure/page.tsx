"use client";

import { useState, useEffect, useMemo } from "react";
import { TierType, UserMapRecord, InputMethod } from "@/lib/types";
import { findMatchingTier } from "@/lib/utils-calc";
import { MethodSelectStep } from "./_components/method-select-step";
import { ConfirmStep } from "./_components/confirm-step";
import { InputStep } from "./_components/input-step";
import { LoginPromptModal } from "./_components/login-prompt-modal";
import { TrackSearchModal } from "./_components/track-search-modal";
import { useLatestMaps, useLatestRecord } from "@/hooks/use-records";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { loadGuestMeasurement } from "@/lib/guest-storage";
import { toast } from "sonner";

export default function MeasurePage() {
  const [step, setStep] = useState<"select-method" | "input" | "confirm">(
    "select-method",
  );
  const [inputMethod, setInputMethod] = useState<InputMethod | null>(null);
  const [currentMapIndex, setCurrentMapIndex] = useState(0);
  const [records, setRecords] = useState<UserMapRecord[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [hasShownLoginPrompt, setHasShownLoginPrompt] = useState(false);
  const [hasShownPreviousRecordToast, setHasShownPreviousRecordToast] =
    useState(false);
  const [showTrackSearchModal, setShowTrackSearchModal] = useState(false);
  const [originalRecordBeforeEdit, setOriginalRecordBeforeEdit] =
    useState<UserMapRecord | null>(null);

  // API 데이터 불러오기
  const { maps, season, isLoading: mapsLoading } = useLatestMaps();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { record: latestRecord, isLoading: recordLoading } = useLatestRecord(
    user?._id,
  );

  // 비로그인 유저를 위한 localStorage 기반 이전 기록
  const guestRecord = useMemo(() => {
    if (isAuthenticated || authLoading) return null;
    return loadGuestMeasurement();
  }, [isAuthenticated, authLoading]);

  // 이전 기록 존재 여부 확인
  const hasPreviousRecords = useMemo(() => {
    if (isAuthenticated && latestRecord?.records?.length) {
      return true;
    }
    if (!isAuthenticated && guestRecord?.records?.length) {
      return true;
    }
    return false;
  }, [isAuthenticated, latestRecord, guestRecord]);

  // 비로그인 유저에게 로그인 유도 모달 표시
  useEffect(() => {
    if (!authLoading && !isAuthenticated && !hasShownLoginPrompt) {
      setShowLoginPrompt(true);
      setHasShownLoginPrompt(true);
    }
  }, [authLoading, isAuthenticated, hasShownLoginPrompt]);

  // 이전 기록이 있으면 input step에서 토스트 표시
  useEffect(() => {
    if (
      step === "input" &&
      hasPreviousRecords &&
      !hasShownPreviousRecordToast
    ) {
      toast.info("이전에 측정한 기록으로 기본 선택됩니다.", {
        duration: 4000,
      });
      setHasShownPreviousRecordToast(true);
    }
  }, [step, hasPreviousRecords, hasShownPreviousRecordToast]);

  // 맵 데이터를 프론트엔드 형식으로 변환 (id 추가)
  const mapsWithId = useMemo(() => {
    return maps.map((map, index) => ({
      ...map,
      id: `map-${index}`,
    }));
  }, [maps]);

  const currentMap = mapsWithId[currentMapIndex];

  // 현재 맵의 최근 기록 찾기 (맵 이름으로 매칭)
  // 로그인 유저는 서버에서, 비로그인 유저는 localStorage에서
  const previousRecordForCurrentMap = useMemo(() => {
    if (!currentMap) return null;

    // 로그인 유저: 서버에서 가져온 기록 사용
    if (isAuthenticated && latestRecord?.records) {
      const matchedRecord = latestRecord.records.find(
        (r) => r.mapName === currentMap.name,
      );
      return matchedRecord || null;
    }

    // 비로그인 유저: localStorage에서 가져온 기록 사용
    if (!isAuthenticated && guestRecord?.records) {
      const matchedRecord = guestRecord.records.find(
        (r) => r.mapName === currentMap.name,
      );
      return matchedRecord || null;
    }

    return null;
  }, [latestRecord, currentMap, isAuthenticated, guestRecord]);

  // '+' 문자가 있는 기록을 처리하여 0.01초를 더한 값으로 변환
  const processRecordWithPlus = (record: string): string => {
    // '+' 문자가 없으면 그대로 반환
    if (!record.includes("+")) {
      return record;
    }

    // '+' 제거하고 trim
    const cleanRecord = record.replace("+", "").trim();

    // MM:SS:mm 형식 파싱
    const parts = cleanRecord.split(":");
    if (parts.length !== 3) {
      return cleanRecord; // 형식이 맞지 않으면 그대로 반환
    }

    let minutes = parseInt(parts[0], 10);
    let seconds = parseInt(parts[1], 10);
    let centiseconds = parseInt(parts[2], 10);

    // 0.01초 (1 centisecond) 추가
    centiseconds += 1;

    // Overflow 처리
    if (centiseconds >= 100) {
      centiseconds = 0;
      seconds += 1;
    }

    if (seconds >= 60) {
      seconds = 0;
      minutes += 1;
    }

    // 포맷팅 (2자리 숫자로)
    const formatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(centiseconds).padStart(2, "0")}`;

    return formatted;
  };

  // 맵이 변경되거나 최근 기록이 있을 때 자동으로 입력값 설정
  useEffect(() => {
    if (
      step === "input" &&
      inputMethod === "manual" &&
      previousRecordForCurrentMap?.record
    ) {
      const processedRecord = processRecordWithPlus(
        previousRecordForCurrentMap.record,
      );
      setCurrentInput(processedRecord);
    }
  }, [currentMapIndex, previousRecordForCurrentMap, step, inputMethod]);

  // 로딩 중
  if (mapsLoading || (isAuthenticated && recordLoading)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // 맵 데이터가 없으면 에러 표시
  if (!mapsWithId || mapsWithId.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">맵 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

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
      setOriginalRecordBeforeEdit(null); // 원래 기록 초기화
    } else {
      // 일반 입력 모드
      updatedRecords = [...records, newRecord];
    }
    setRecords(updatedRecords);

    if (isEditMode) {
      setIsEditMode(false);
      setStep("confirm");
    } else if (currentMapIndex < mapsWithId.length - 1) {
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
      setOriginalRecordBeforeEdit(null); // 원래 기록 초기화
    } else {
      // 일반 입력 모드
      updatedRecords = [...records, newRecord];
    }
    setRecords(updatedRecords);
    setCurrentInput("");

    if (isEditMode) {
      setIsEditMode(false);
      setStep("confirm");
    } else if (currentMapIndex < mapsWithId.length - 1) {
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
      setOriginalRecordBeforeEdit(null); // 원래 기록 초기화
    } else {
      // 일반 입력 모드
      updatedRecords = [...records, newRecord];
    }
    setRecords(updatedRecords);

    if (isEditMode) {
      setIsEditMode(false);
      setStep("confirm");
    } else if (currentMapIndex < mapsWithId.length - 1) {
      setCurrentMapIndex(currentMapIndex + 1);
    } else {
      setStep("confirm");
    }
  };

  const handleEditMap = (mapIndex: number) => {
    // 수정 전 원래 기록을 저장
    const originalRecord = records[mapIndex];
    setOriginalRecordBeforeEdit(originalRecord);

    // 해당 맵으로 이동하고 그 맵의 기록을 제거
    setCurrentMapIndex(mapIndex);
    const updatedRecords = records.filter((_, index) => index !== mapIndex);
    setRecords(updatedRecords);
    setStep("input");
    setIsEditMode(true);
    setEditingIndex(mapIndex);
  };

  const handleRestart = () => {
    setStep("input");
    setCurrentMapIndex(0);
    setRecords([]);
  };

  const handleCancel = () => {
    // 수정 모드일 때: 원래 기록을 복원하고 컨펌으로 돌아감
    if (isEditMode && editingIndex !== null && originalRecordBeforeEdit) {
      const restoredRecords = [...records];
      restoredRecords.splice(editingIndex, 0, originalRecordBeforeEdit);
      setRecords(restoredRecords);
      setStep("confirm");
      setIsEditMode(false);
      setEditingIndex(null);
      setOriginalRecordBeforeEdit(null);
    } else {
      // 일반 모드일 때: 처음부터 다시 시작
      setStep("select-method");
      setCurrentMapIndex(0);
      setRecords([]);
    }
  };

  // 트랙 점프 핸들러 (중간 트랙들을 기본값으로 채움)
  const handleJumpToTrack = (targetMapIndex: number) => {
    // 이미 완료된 트랙이거나 현재 트랙이면 무시
    if (targetMapIndex <= currentMapIndex) {
      toast.error("이미 완료된 트랙이거나 현재 트랙입니다.");
      return;
    }

    // 현재 트랙부터 목표 트랙 직전까지 기본값으로 채우기
    const newRecords = [...records];
    for (let i = currentMapIndex; i < targetMapIndex; i++) {
      const map = mapsWithId[i];

      // 이전 기록 찾기
      let previousRecord = null;
      if (isAuthenticated && latestRecord?.records) {
        previousRecord = latestRecord.records.find(
          (r) => r.mapName === map.name,
        );
      } else if (!isAuthenticated && guestRecord?.records) {
        previousRecord = guestRecord.records.find(
          (r) => r.mapName === map.name,
        );
      }

      // 이전 기록이 있으면 사용, 없으면 기본값
      if (previousRecord) {
        const processedRecord = processRecordWithPlus(previousRecord.record);
        newRecords.push({
          mapId: map.id,
          record: processedRecord,
          tier: previousRecord.tier,
        });
      } else {
        // 기본값: manual 방식이든 button 방식이든 bronze + 99:99:99
        newRecords.push({
          mapId: map.id,
          record: "99:99:99",
          tier: "bronze",
        });
      }
    }

    setRecords(newRecords);
    setCurrentMapIndex(targetMapIndex);
    setShowTrackSearchModal(false);

    toast.success(
      `${mapsWithId[targetMapIndex].name} 트랙으로 이동했습니다. (${targetMapIndex - currentMapIndex}개 트랙 기본값 적용)`,
    );
  };

  // 이전 기록으로 즉시 결과 확인
  const handleUsePreviousRecords = () => {
    const previousRecords = isAuthenticated
      ? latestRecord?.records
      : guestRecord?.records;

    if (!previousRecords || !mapsWithId.length) return;

    // 모든 맵에 대해 이전 기록을 사용하여 records 배열 생성
    const newRecords: UserMapRecord[] = mapsWithId.map((map) => {
      const prevRecord = previousRecords.find((r) => r.mapName === map.name);

      if (prevRecord) {
        return {
          mapId: map.id,
          record: prevRecord.record,
          tier: prevRecord.tier,
        };
      }

      // 이전 기록이 없는 맵은 bronze로 스킵 처리
      return {
        mapId: map.id,
        record: "99:99:99",
        tier: "bronze" as const,
      };
    });

    setRecords(newRecords);
    setStep("confirm");
  };

  if (step === "select-method") {
    return (
      <>
        <MethodSelectStep onMethodSelect={handleMethodSelect} />
        <LoginPromptModal
          open={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
        />
      </>
    );
  }

  if (step === "confirm") {
    return (
      <ConfirmStep
        records={records}
        maps={mapsWithId}
        season={season}
        userId={user?._id}
        isAuthenticated={isAuthenticated}
        onEditMap={handleEditMap}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <>
      <InputStep
        inputMethod={inputMethod!}
        currentMapIndex={currentMapIndex}
        totalMaps={mapsWithId.length}
        currentMap={currentMap}
        records={records}
        currentInput={currentInput}
        matchedTier={matchedTier}
        previousRecord={previousRecordForCurrentMap}
        hasPreviousRecords={hasPreviousRecords}
        onCancel={handleCancel}
        onTierSelect={handleTierSelect}
        onInputChange={handleInputChange}
        onManualInput={handleManualInput}
        onSkip={handleSkip}
        onUsePreviousRecords={handleUsePreviousRecords}
        onSearchTrack={() => setShowTrackSearchModal(true)}
        isEditMode={isEditMode}
      />
      <TrackSearchModal
        open={showTrackSearchModal}
        onClose={() => setShowTrackSearchModal(false)}
        maps={mapsWithId}
        currentMapIndex={currentMapIndex}
        onSelectTrack={handleJumpToTrack}
      />
    </>
  );
}
