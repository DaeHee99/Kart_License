"use client";

import { useState, useEffect, useMemo } from "react";
import { TierType, UserMapRecord, InputMethod } from "@/lib/types";
import { findMatchingTier } from "@/lib/utils-calc";
import { MethodSelectStep } from "./_components/method-select-step";
import { ConfirmStep } from "./_components/confirm-step";
import { InputStep } from "./_components/input-step";
import { useLatestMaps, useLatestRecord } from "@/hooks/use-records";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

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

  // API 데이터 불러오기
  const { maps, season, isLoading: mapsLoading } = useLatestMaps();
  const { user, isAuthenticated } = useAuth();
  const { record: latestRecord, isLoading: recordLoading } = useLatestRecord(
    user?._id,
  );

  // 맵 데이터를 프론트엔드 형식으로 변환 (id 추가)
  const mapsWithId = useMemo(() => {
    return maps.map((map, index) => ({
      ...map,
      id: `map-${index}`,
    }));
  }, [maps]);

  const currentMap = mapsWithId[currentMapIndex];

  // 현재 맵의 최근 기록 찾기 (맵 이름으로 매칭)
  const previousRecordForCurrentMap = useMemo(() => {
    if (!latestRecord || !latestRecord.records || !currentMap) {
      return null;
    }
    // 현재 맵과 이름이 같은 기록 찾기
    const matchedRecord = latestRecord.records.find(
      (r) => r.mapName === currentMap.name,
    );
    return matchedRecord || null;
  }, [latestRecord, currentMap]);

  // 맵이 변경되거나 최근 기록이 있을 때 자동으로 입력값 설정
  useEffect(() => {
    if (
      step === "input" &&
      inputMethod === "manual" &&
      previousRecordForCurrentMap?.record
    ) {
      setCurrentInput(previousRecordForCurrentMap.record);
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
    setStep("select-method");
    setCurrentMapIndex(0);
    setRecords([]);
  };

  if (step === "select-method") {
    return <MethodSelectStep onMethodSelect={handleMethodSelect} />;
  }

  if (step === "confirm") {
    return (
      <ConfirmStep
        records={records}
        maps={mapsWithId}
        season={season}
        userId={user?._id}
        onEditMap={handleEditMap}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <InputStep
      inputMethod={inputMethod!}
      currentMapIndex={currentMapIndex}
      totalMaps={mapsWithId.length}
      currentMap={currentMap}
      records={records}
      currentInput={currentInput}
      matchedTier={matchedTier}
      previousRecord={previousRecordForCurrentMap}
      onCancel={handleCancel}
      onTierSelect={handleTierSelect}
      onInputChange={handleInputChange}
      onManualInput={handleManualInput}
      onSkip={handleSkip}
    />
  );
}
