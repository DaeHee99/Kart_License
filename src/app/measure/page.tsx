"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { TierType, UserMapRecord, InputMethod } from "@/lib/types";
import { findMatchingTier } from "@/lib/utils-calc";
import { MethodSelectStep } from "./_components/method-select-step";
import { ConfirmStep } from "./_components/confirm-step";
import { InputStep } from "./_components/input-step";
import { LoginPromptModal } from "./_components/login-prompt-modal";
import { TrackSearchModal } from "./_components/track-search-modal";
import { AutoSaveRecoveryModal } from "./_components/auto-save-recovery-modal";
import { useLatestMaps, useLatestRecord } from "@/hooks/use-records";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { loadGuestMeasurement } from "@/lib/guest-storage";
import { toast } from "sonner";

// 자동 저장 관련 상수 및 타입
const AUTOSAVE_KEY = "kart-measure-autosave";

interface AutoSaveData {
  inputMethod: InputMethod;
  currentMapIndex: number;
  allRecords: Record<number, UserMapRecord>;
  season: number;
  timestamp: number;
}

// 자동 저장 유틸리티 함수
const saveToAutoSave = (data: AutoSaveData) => {
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Auto-save failed:", error);
  }
};

const loadAutoSave = (): AutoSaveData | null => {
  try {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Auto-save load failed:", error);
  }
  return null;
};

const clearAutoSave = () => {
  try {
    localStorage.removeItem(AUTOSAVE_KEY);
  } catch (error) {
    console.error("Auto-save clear failed:", error);
  }
};

export default function MeasurePage() {
  const [step, setStep] = useState<"select-method" | "input" | "confirm">(
    "select-method",
  );
  const [inputMethod, setInputMethod] = useState<InputMethod | null>(null);
  const [currentMapIndex, setCurrentMapIndex] = useState(0);
  // 모든 맵의 기록을 인덱스별로 관리 (핵심 상태)
  const [allRecords, setAllRecords] = useState<Record<number, UserMapRecord>>(
    {},
  );
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
  // 자동 저장 복구 모달
  const [showAutoSaveModal, setShowAutoSaveModal] = useState(false);
  const [autoSaveData, setAutoSaveData] = useState<AutoSaveData | null>(null);

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

  // allRecords를 순서대로 배열로 변환 (확인 단계용)
  const records = useMemo(() => {
    const result: UserMapRecord[] = [];
    const sortedKeys = Object.keys(allRecords)
      .map(Number)
      .sort((a, b) => a - b);
    for (const key of sortedKeys) {
      result.push(allRecords[key]);
    }
    return result;
  }, [allRecords]);

  // 맵 데이터를 프론트엔드 형식으로 변환 (id 추가)
  const mapsWithId = useMemo(() => {
    return maps.map((map, index) => ({
      ...map,
      id: `map-${index}`,
    }));
  }, [maps]);

  const currentMap = mapsWithId[currentMapIndex];

  // 자동 저장 복구 확인 (최초 1회)
  useEffect(() => {
    if (mapsLoading) return;

    const savedData = loadAutoSave();
    if (savedData && savedData.season === season) {
      // 유효한 자동 저장 데이터가 있고 시즌이 같으면 복구 모달 표시
      const hasRecords = Object.keys(savedData.allRecords).length > 0;
      if (hasRecords) {
        setAutoSaveData(savedData);
        setShowAutoSaveModal(true);
      } else {
        // 기록이 없으면 자동 저장 데이터 삭제
        clearAutoSave();
      }
    } else if (savedData && savedData.season !== season) {
      // 시즌이 다르면 자동 저장 데이터 삭제
      clearAutoSave();
    }
  }, [mapsLoading, season]);

  // 자동 저장 (step이 input일 때만)
  useEffect(() => {
    if (step === "input" && inputMethod && season) {
      const hasRecords = Object.keys(allRecords).length > 0;
      if (hasRecords) {
        saveToAutoSave({
          inputMethod,
          currentMapIndex,
          allRecords,
          season,
          timestamp: Date.now(),
        });
      }
    }
  }, [step, inputMethod, currentMapIndex, allRecords, season]);

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

  // 현재 맵의 최근 기록 찾기 (맵 이름으로 매칭)
  // 우선순위: allRecords > 서버/localStorage 기록
  const previousRecordForCurrentMap = useMemo(() => {
    if (!currentMap) return null;

    // 1. 현재 세션에서 입력한 기록이 있으면 우선 사용
    const existingRecord = allRecords[currentMapIndex];
    if (existingRecord && existingRecord.record) {
      return {
        mapName: currentMap.name,
        difficulty: currentMap.difficulty,
        record: existingRecord.record,
        tier: existingRecord.tier || ("bronze" as TierType),
      };
    }

    // 2. 로그인 유저: 서버에서 가져온 기록 사용
    if (isAuthenticated && latestRecord?.records) {
      const matchedRecord = latestRecord.records.find(
        (r) => r.mapName === currentMap.name,
      );
      return matchedRecord || null;
    }

    // 3. 비로그인 유저: localStorage에서 가져온 기록 사용
    if (!isAuthenticated && guestRecord?.records) {
      const matchedRecord = guestRecord.records.find(
        (r) => r.mapName === currentMap.name,
      );
      return matchedRecord || null;
    }

    return null;
  }, [
    latestRecord,
    currentMap,
    currentMapIndex,
    isAuthenticated,
    guestRecord,
    allRecords,
  ]);

  // '+' 문자가 있는 기록을 처리하여 0.01초를 더한 값으로 변환
  const processRecordWithPlus = useCallback((record: string): string => {
    if (!record.includes("+")) {
      return record;
    }

    const cleanRecord = record.replace("+", "").trim();
    const parts = cleanRecord.split(":");
    if (parts.length !== 3) {
      return cleanRecord;
    }

    let minutes = parseInt(parts[0], 10);
    let seconds = parseInt(parts[1], 10);
    let centiseconds = parseInt(parts[2], 10);

    centiseconds += 1;

    if (centiseconds >= 100) {
      centiseconds = 0;
      seconds += 1;
    }

    if (seconds >= 60) {
      seconds = 0;
      minutes += 1;
    }

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(centiseconds).padStart(2, "0")}`;
  }, []);

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
  }, [
    currentMapIndex,
    previousRecordForCurrentMap,
    step,
    inputMethod,
    processRecordWithPlus,
  ]);

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

  // 자동 저장 복구 핸들러
  const handleRecoverAutoSave = () => {
    if (autoSaveData) {
      setInputMethod(autoSaveData.inputMethod);
      setCurrentMapIndex(autoSaveData.currentMapIndex);
      setAllRecords(autoSaveData.allRecords);
      setStep("input");
      setShowAutoSaveModal(false);
      toast.success("이전 측정 기록을 복구했습니다.");
    }
  };

  const handleDiscardAutoSave = () => {
    clearAutoSave();
    setShowAutoSaveModal(false);
    setAutoSaveData(null);
  };

  const handleMethodSelect = (method: InputMethod) => {
    setInputMethod(method);
    setStep("input");
  };

  // 기록 저장 공통 함수
  const saveRecord = (newRecord: UserMapRecord) => {
    setAllRecords((prev) => ({
      ...prev,
      [currentMapIndex]: newRecord,
    }));
  };

  const handleTierSelect = (tier: TierType) => {
    const newRecord: UserMapRecord = {
      mapId: currentMap.id,
      tier,
      record: currentMap.tierRecords[tier],
    };

    if (isEditMode && editingIndex !== null) {
      // 편집 모드
      setAllRecords((prev) => ({
        ...prev,
        [editingIndex]: newRecord,
      }));
      setEditingIndex(null);
      setOriginalRecordBeforeEdit(null);
      setIsEditMode(false);
      setStep("confirm");
    } else {
      // 일반 입력 모드
      saveRecord(newRecord);

      if (currentMapIndex < mapsWithId.length - 1) {
        setCurrentMapIndex(currentMapIndex + 1);
      } else {
        setStep("confirm");
      }
    }
  };

  const handleManualInput = () => {
    if (!currentInput || currentInput.length !== 8) return;

    const newRecord: UserMapRecord = {
      mapId: currentMap.id,
      record: currentInput,
      tier: matchedTier || undefined,
    };

    if (isEditMode && editingIndex !== null) {
      // 편집 모드
      setAllRecords((prev) => ({
        ...prev,
        [editingIndex]: newRecord,
      }));
      setEditingIndex(null);
      setOriginalRecordBeforeEdit(null);
      setIsEditMode(false);
      setStep("confirm");
    } else {
      // 일반 입력 모드
      saveRecord(newRecord);
      setCurrentInput("");

      if (currentMapIndex < mapsWithId.length - 1) {
        setCurrentMapIndex(currentMapIndex + 1);
      } else {
        setStep("confirm");
      }
    }
  };

  const handleInputChange = (value: string) => {
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
    const newRecord: UserMapRecord = {
      mapId: currentMap.id,
      record: "99:99:99",
      tier: "bronze",
    };

    if (isEditMode && editingIndex !== null) {
      setAllRecords((prev) => ({
        ...prev,
        [editingIndex]: newRecord,
      }));
      setEditingIndex(null);
      setOriginalRecordBeforeEdit(null);
      setIsEditMode(false);
      setStep("confirm");
    } else {
      saveRecord(newRecord);

      if (currentMapIndex < mapsWithId.length - 1) {
        setCurrentMapIndex(currentMapIndex + 1);
      } else {
        setStep("confirm");
      }
    }
  };

  // 이전 맵으로 돌아가기 핸들러 (기록 유지)
  const handleGoToPreviousMap = () => {
    if (isEditMode) return;

    // 첫 번째 맵이면 메소드 선택으로 돌아가기
    if (currentMapIndex === 0) {
      setStep("select-method");
      setInputMethod(null);
      setAllRecords({});
      setCurrentInput("");
      return;
    }

    // 이전 맵으로 이동 (기록은 그대로 유지)
    setCurrentMapIndex(currentMapIndex - 1);
    setCurrentInput("");
  };

  // 기록 선택 방식에서 건너뛰기 (이전 선택된 tier 또는 bronze)
  const handleSkipWithSelection = (previousTier?: TierType) => {
    const tier = previousTier || "bronze";
    const record = previousTier
      ? currentMap.tierRecords[previousTier]
      : "99:99:99";

    const newRecord: UserMapRecord = {
      mapId: currentMap.id,
      tier,
      record,
    };

    if (isEditMode && editingIndex !== null) {
      setAllRecords((prev) => ({
        ...prev,
        [editingIndex]: newRecord,
      }));
      setEditingIndex(null);
      setOriginalRecordBeforeEdit(null);
      setIsEditMode(false);
      setStep("confirm");
    } else {
      saveRecord(newRecord);

      if (currentMapIndex < mapsWithId.length - 1) {
        setCurrentMapIndex(currentMapIndex + 1);
      } else {
        setStep("confirm");
      }
    }
  };

  const handleEditMap = (mapIndex: number) => {
    const originalRecord = allRecords[mapIndex];
    setOriginalRecordBeforeEdit(originalRecord || null);

    setCurrentMapIndex(mapIndex);
    setStep("input");
    setIsEditMode(true);
    setEditingIndex(mapIndex);
  };

  const handleRestart = () => {
    setStep("input");
    setCurrentMapIndex(0);
    setAllRecords({});
    clearAutoSave();
  };

  const handleCancel = () => {
    if (isEditMode && editingIndex !== null && originalRecordBeforeEdit) {
      // 수정 모드일 때: 원래 기록을 복원하고 컨펌으로 돌아감
      setAllRecords((prev) => ({
        ...prev,
        [editingIndex]: originalRecordBeforeEdit,
      }));
      setStep("confirm");
      setIsEditMode(false);
      setEditingIndex(null);
      setOriginalRecordBeforeEdit(null);
    } else {
      // 일반 모드일 때: 처음부터 다시 시작
      setStep("select-method");
      setCurrentMapIndex(0);
      setAllRecords({});
    }
  };

  // 트랙 점프 핸들러 (앞/뒤 모두 지원, 기록 유지)
  const handleJumpToTrack = (targetMapIndex: number) => {
    if (targetMapIndex === currentMapIndex) {
      setShowTrackSearchModal(false);
      return;
    }

    if (isEditMode) {
      toast.error("수정 모드에서는 트랙 이동이 불가능합니다.");
      return;
    }

    // 이전 트랙으로 이동하는 경우 (기록 유지)
    if (targetMapIndex < currentMapIndex) {
      setCurrentMapIndex(targetMapIndex);
      setCurrentInput("");
      setShowTrackSearchModal(false);

      toast.success(
        `${mapsWithId[targetMapIndex].name} 트랙으로 돌아갔습니다.`,
      );
      return;
    }

    // 다음 트랙으로 점프하는 경우
    // 현재 트랙부터 목표 트랙 직전까지 기본값으로 채우기 (기존에 입력된 기록은 유지)
    const newAllRecords = { ...allRecords };
    let filledCount = 0;

    for (let i = currentMapIndex; i < targetMapIndex; i++) {
      // 이미 기록이 있으면 스킵
      if (newAllRecords[i]) continue;

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
        newAllRecords[i] = {
          mapId: map.id,
          record: processedRecord,
          tier: previousRecord.tier,
        };
      } else {
        newAllRecords[i] = {
          mapId: map.id,
          record: "99:99:99",
          tier: "bronze",
        };
      }
      filledCount++;
    }

    setAllRecords(newAllRecords);
    setCurrentMapIndex(targetMapIndex);
    setShowTrackSearchModal(false);

    if (filledCount > 0) {
      toast.success(
        `${mapsWithId[targetMapIndex].name} 트랙으로 이동했습니다. (${filledCount}개 트랙 기본값 적용)`,
      );
    } else {
      toast.success(
        `${mapsWithId[targetMapIndex].name} 트랙으로 이동했습니다.`,
      );
    }
  };

  // 이전 기록으로 즉시 결과 확인
  const handleUsePreviousRecords = () => {
    const previousRecords = isAuthenticated
      ? latestRecord?.records
      : guestRecord?.records;

    if (!previousRecords || !mapsWithId.length) return;

    const newAllRecords: Record<number, UserMapRecord> = {};

    mapsWithId.forEach((map, index) => {
      const prevRecord = previousRecords.find((r) => r.mapName === map.name);

      if (prevRecord) {
        newAllRecords[index] = {
          mapId: map.id,
          record: prevRecord.record,
          tier: prevRecord.tier,
        };
      } else {
        newAllRecords[index] = {
          mapId: map.id,
          record: "99:99:99",
          tier: "bronze" as const,
        };
      }
    });

    setAllRecords(newAllRecords);
    setStep("confirm");
  };

  // 측정 완료 후 자동 저장 삭제 (ConfirmStep에서 호출)
  const handleMeasurementComplete = () => {
    clearAutoSave();
  };

  if (step === "select-method") {
    return (
      <>
        <MethodSelectStep onMethodSelect={handleMethodSelect} />
        <LoginPromptModal
          open={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
        />
        <AutoSaveRecoveryModal
          open={showAutoSaveModal}
          onRecover={handleRecoverAutoSave}
          onDiscard={handleDiscardAutoSave}
          recordCount={
            autoSaveData ? Object.keys(autoSaveData.allRecords).length : 0
          }
          lastMapIndex={autoSaveData?.currentMapIndex ?? 0}
          totalMaps={mapsWithId.length}
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
        onComplete={handleMeasurementComplete}
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
        onPrevious={handleGoToPreviousMap}
        onSkipWithSelection={handleSkipWithSelection}
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
        isEditMode={isEditMode}
      />
    </>
  );
}
