"use client";

import { useState, useEffect } from "react";
import { TierType } from "@/lib/types";
import { getTierInsights, convertKoreanTierToEnglish } from "@/lib/utils-calc";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
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

const COMPACT_LAYOUT_QUERY = "(max-width: 1023px)";
const FEEDBACK_DISMISSED_QUERY = "feedbackDismissed";

export default function ResultDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const recordId = params.id as string;

  const [recordData, setRecordData] = useState<
    RecordDetailResponse["data"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackPromptDismissed, setFeedbackPromptDismissed] = useState(false);
  const [isRedirectingToFeedback, setIsRedirectingToFeedback] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState<boolean | null>(
    null,
  );
  const hasFeedbackDismissedQuery =
    searchParams.get(FEEDBACK_DISMISSED_QUERY) === "1";

  // 유저 인증 정보
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // 현재 시즌 정보 가져오기
  const { season: currentSeason, isLoading: mapsLoading } = useLatestMaps();

  // 유저의 피드백 제출 여부 확인
  const { feedback, isLoading: feedbackLoading } = useUserFeedback(
    user?._id,
    recordData?.season,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(COMPACT_LAYOUT_QUERY);
    const handleChange = () => setIsCompactViewport(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

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

  useEffect(() => {
    if (!hasFeedbackDismissedQuery) return;

    setFeedbackPromptDismissed(true);
    window.history.replaceState(
      window.history.state,
      "",
      `/result/${recordId}`,
    );
  }, [hasFeedbackDismissedQuery, recordId]);

  const isFeedbackDecisionPending =
    !isLoading &&
    !!recordData &&
    (authLoading ||
      (isAuthenticated &&
        (feedbackLoading || mapsLoading || isCompactViewport === null)));

  const shouldPromptForFeedback = Boolean(
    !isLoading &&
      recordData &&
      !isFeedbackDecisionPending &&
      isAuthenticated &&
      user &&
      !feedback &&
      !feedbackPromptDismissed &&
      !hasFeedbackDismissedQuery &&
      recordData.season > 0 &&
      currentSeason > 0 &&
      recordData.user?._id === user._id &&
      recordData.season === currentSeason,
  );

  const shouldRedirectToFeedbackPage =
    shouldPromptForFeedback && isCompactViewport === true;
  const shouldShowFeedbackDialog =
    shouldPromptForFeedback && isCompactViewport === false;

  useEffect(() => {
    if (!shouldRedirectToFeedbackPage) return;

    setIsRedirectingToFeedback(true);
    setFeedbackPromptDismissed(true);
    window.history.replaceState(
      window.history.state,
      "",
      `/result/${recordId}?${FEEDBACK_DISMISSED_QUERY}=1`,
    );
    router.push(`/result/${recordId}/feedback`);
  }, [recordId, router, shouldRedirectToFeedbackPage]);

  const handleFeedbackDialogChange = (open: boolean) => {
    if (!open) {
      setFeedbackPromptDismissed(true);
    }
  };

  if (isLoading || !recordData) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return null; // Error state (will redirect)
  }

  if (
    isFeedbackDecisionPending ||
    shouldRedirectToFeedbackPage ||
    isRedirectingToFeedback
  ) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  // tierDistribution을 Record<TierType, number> 타입으로 변환
  // 라이트 등급은 신규 추가 필드이므로 구버전 데이터에서는 undefined일 수 있음
  const tierDistribution: Record<TierType, number> = {
    elite: recordData.tierDistribution.elite ?? 0,
    master: recordData.tierDistribution.master ?? 0,
    diamond: recordData.tierDistribution.diamond ?? 0,
    platinum: recordData.tierDistribution.platinum ?? 0,
    gold: recordData.tierDistribution.gold ?? 0,
    silver: recordData.tierDistribution.silver ?? 0,
    light: recordData.tierDistribution.light ?? 0,
    bronze: recordData.tierDistribution.bronze ?? 0,
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
          open={shouldShowFeedbackDialog}
          onOpenChange={handleFeedbackDialogChange}
          season={recordData.season}
          recordId={recordId}
          userId={user._id}
          userLicense={recordData.finalTier}
        />
      )}
    </div>
  );
}
