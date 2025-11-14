"use client";

import { useState, useEffect } from "react";
import { TierType } from "@/lib/types";
import { getTierInsights, convertKoreanTierToEnglish } from "@/lib/utils-calc";
import { useRouter, useParams } from "next/navigation";
import { AnimatedBackground } from "./_components/animated-background";
import { UserInfoCard } from "./_components/user-info-card";
import { TierRevealCard } from "./_components/tier-reveal-card";
import { TierDistributionTable } from "./_components/tier-distribution-table";
import { DetailedRecordsTable } from "./_components/detailed-records-table";
import { ActionButtons } from "./_components/action-buttons";
import { BottomActionButtons } from "./_components/bottom-action-buttons";
import { FeedbackDialog } from "../_components/feedback-dialog";
import { recordsAPI } from "@/lib/api/records";
import { useAuth } from "@/hooks/use-auth";
import { useUserFeedback } from "@/hooks/use-feedback";
import { useLatestMaps } from "@/hooks/use-records";
import type { RecordDetailResponse } from "@/lib/api/types";

export default function ResultDetailPage() {
  const router = useRouter();
  const params = useParams();
  const recordId = params.id as string;

  const [recordData, setRecordData] = useState<
    RecordDetailResponse["data"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  // 유저 인증 정보
  const { user, isAuthenticated } = useAuth();

  // 현재 시즌 정보 가져오기
  const { season: currentSeason } = useLatestMaps();

  // 유저의 피드백 제출 여부 확인
  const { feedback, isLoading: feedbackLoading } = useUserFeedback(
    user?._id,
    recordData?.season,
  );

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

  // 피드백 다이얼로그 자동 표시 로직
  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      recordData &&
      !feedbackLoading &&
      !feedback &&
      recordData.season > 0 &&
      currentSeason > 0
    ) {
      // 조건:
      // 1. 유저가 로그인되어 있어야 함
      // 2. 기록이 로드되었어야 함
      // 3. 피드백 로딩이 완료되어야 함
      // 4. 현재 시즌에 대한 피드백을 아직 제출하지 않았어야 함
      // 5. 해당 기록이 현재 로그인한 유저의 것이어야 함
      // 6. 해당 기록의 시즌이 현재 시즌과 일치해야 함
      const isOwnRecord = recordData.user?._id === user._id;
      const isCurrentSeasonRecord = recordData.season === currentSeason;

      if (isOwnRecord && isCurrentSeasonRecord) {
        setShowFeedbackDialog(true);
      }
    }
  }, [isAuthenticated, user, recordData, feedbackLoading, feedback, currentSeason]);

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
          <UserInfoCard
            user={recordData.user}
            season={recordData.season}
            createdAt={recordData.createdAt}
          />
          <ActionButtons
            finalTier={finalTier}
            user={recordData.user}
            season={recordData.season}
            createdAt={recordData.createdAt}
          />
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

      {/* 피드백 다이얼로그 */}
      {isAuthenticated && user && recordData && (
        <FeedbackDialog
          open={showFeedbackDialog}
          onOpenChange={setShowFeedbackDialog}
          season={recordData.season}
          recordId={recordId}
          userId={user._id}
          userLicense={recordData.finalTier}
        />
      )}
    </div>
  );
}
