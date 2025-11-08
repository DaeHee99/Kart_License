"use client";

import { useState } from "react";
import { MOCK_MAPS } from "@/lib/mock-data";
import { TierType, UserMapRecord, InputMethod } from "@/lib/types";
import { findMatchingTier } from "@/lib/utils-calc";
import { MethodSelectStep } from "./_components/method-select-step";
import { ConfirmStep } from "./_components/confirm-step";
import { InputStep } from "./_components/input-step";

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

  const currentMap = MOCK_MAPS[currentMapIndex];

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
        onEditMap={handleEditMap}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <InputStep
      inputMethod={inputMethod!}
      currentMapIndex={currentMapIndex}
      records={records}
      currentInput={currentInput}
      matchedTier={matchedTier}
      onCancel={handleCancel}
      onTierSelect={handleTierSelect}
      onInputChange={handleInputChange}
      onManualInput={handleManualInput}
      onSkip={handleSkip}
    />
  );
}
