"use client";

import { useState, useEffect } from "react";
import { TierType } from "@/lib/types";
import { getTierInsights, convertKoreanTierToEnglish } from "@/lib/utils-calc";
import { useRouter, useParams } from "next/navigation";
import { AnimatedBackground } from "./_components/animated-background";
import { TierRevealCard } from "./_components/tier-reveal-card";
import { TierDistributionTable } from "./_components/tier-distribution-table";
import { DetailedRecordsTable } from "./_components/detailed-records-table";
import { ActionButtons } from "./_components/action-buttons";
import { BottomActionButtons } from "./_components/bottom-action-buttons";
import { recordsAPI } from "@/lib/api/records";
import type { RecordDetailResponse } from "@/lib/api/types";

export default function ResultDetailPage() {
  const router = useRouter();
  const params = useParams();
  const recordId = params.id as string;

  const [recordData, setRecordData] = useState<RecordDetailResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setIsLoading(true);
        const response = await recordsAPI.getRecordById(recordId);

        if (response.success && response.data) {
          setRecordData(response.data);
        } else {
          setError(response.message || "기록을 불러올 수 없습니다.");
          router.push("/measure");
        }
      } catch (err: any) {
        console.error("Failed to fetch record:", err);
        setError(err.message || "기록 조회 중 오류가 발생했습니다.");
        router.push("/measure");
      } finally {
        setIsLoading(false);
      }
    };

    if (recordId) {
      fetchRecord();
    }
  }, [recordId, router]);

  if (isLoading || !recordData) {
    return null; // Loading state
  }

  if (error) {
    return null; // Error state (will redirect)
  }

  // tierDistribution을 Record<TierType, number> 타입으로 변환
  const tierDistribution: Record<TierType, number> = {
    elite: recordData.tierDistribution.elite,
    master: recordData.tierDistribution.master,
    diamond: recordData.tierDistribution.diamond,
    platinum: recordData.tierDistribution.platinum,
    gold: recordData.tierDistribution.gold,
    silver: recordData.tierDistribution.silver,
    bronze: recordData.tierDistribution.bronze,
  };

  // 한국어 티어를 영어 TierType으로 변환
  const finalTier = convertKoreanTierToEnglish(recordData.finalTier);
  const insights = getTierInsights(finalTier, tierDistribution);

  // API 데이터를 컴포넌트가 기대하는 형식으로 변환
  const transformedRecords = recordData.records.map((record) => ({
    mapName: record.mapName,
    difficulty: record.difficulty,
    record: record.record,
    tier: record.tier,
  }));

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      <AnimatedBackground />

      <div className="relative z-10 px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <TierRevealCard finalTier={finalTier} insights={insights} />
          <ActionButtons finalTier={finalTier} />
          <TierDistributionTable
            tierDistribution={tierDistribution}
            finalTier={finalTier}
            totalMaps={recordData.records.length}
          />
          <DetailedRecordsTable
            records={transformedRecords}
            totalMaps={recordData.records.length}
          />
          <BottomActionButtons />
        </div>
      </div>
    </div>
  );
}
