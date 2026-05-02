"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackForm } from "../../_components/feedback-form";
import { useAuth } from "@/hooks/use-auth";
import { useSaveFeedback, useUserFeedback } from "@/hooks/use-feedback";
import { useLatestMaps } from "@/hooks/use-records";
import { recordsAPI } from "@/lib/api/records";
import type { RecordDetailResponse } from "@/lib/api/types";

const FEEDBACK_DISMISSED_QUERY = "feedbackDismissed";

export default function ResultFeedbackPage() {
  const router = useRouter();
  const params = useParams();
  const recordId = params.id as string;

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { season: currentSeason, isLoading: mapsLoading } = useLatestMaps();
  const saveFeedback = useSaveFeedback();

  const [recordData, setRecordData] = useState<
    RecordDetailResponse["data"] | null
  >(null);
  const [recordLoading, setRecordLoading] = useState(true);
  const [license, setLicense] = useState("");
  const [level, setLevel] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [isRedirectingToResult, setIsRedirectingToResult] = useState(false);

  const { feedback, isLoading: feedbackLoading } = useUserFeedback(
    user?._id,
    recordData?.season,
  );

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setRecordLoading(true);
        const response = await recordsAPI.getRecordById(recordId);

        if (response.success && response.data) {
          setRecordData(response.data);
          setLicense(response.data.finalTier);
        } else {
          router.replace("/measure");
        }
      } catch (error) {
        console.error("Failed to fetch record:", error);
        router.replace("/measure");
      } finally {
        setRecordLoading(false);
      }
    };

    if (recordId) {
      fetchRecord();
    }
  }, [recordId, router]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(`/auth?redirect=/result/${recordId}/feedback`);
    }
  }, [authLoading, isAuthenticated, recordId, router]);

  const handleCancel = () => {
    router.push(`/result/${recordId}?${FEEDBACK_DISMISSED_QUERY}=1`);
  };

  const handleSubmit = async () => {
    if (!user || !recordData || level === null || balance === null) return;

    await saveFeedback.mutateAsync({
      userId: user._id,
      license,
      level,
      balance,
      review,
      season: recordData.season,
      recordId,
    });

    router.push(`/result/${recordId}`);
  };

  const isLoading =
    authLoading ||
    recordLoading ||
    mapsLoading ||
    feedbackLoading ||
    !isAuthenticated ||
    !user ||
    !recordData;

  const shouldRedirectToResult =
    !isLoading &&
    (!recordData ||
      !user ||
      recordData.user?._id !== user._id ||
      recordData.season !== currentSeason ||
      !!feedback);

  const isValid = level !== null && balance !== null;

  useEffect(() => {
    if (!shouldRedirectToResult) return;

    setIsRedirectingToResult(true);
    router.replace(`/result/${recordId}`);
  }, [recordId, router, shouldRedirectToResult]);

  if (isLoading || shouldRedirectToResult || isRedirectingToResult) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="from-primary/5 via-background to-background min-h-screen bg-linear-to-b pb-28">
      <div className="px-4 py-6">
        <div className="mx-auto max-w-xl space-y-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              disabled={saveFeedback.isPending}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                S{recordData.season} 군표 피드백
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                작성해주신 피드백은 다음 시즌에 반영될 예정입니다.
              </p>
            </div>
          </div>

          <div className="text-muted-foreground text-sm leading-6">
            안녕하세요. 카러플 군 계산기 운영진입니다.
            <br />
            이번 S{recordData.season} 군표 기록에 대한 피드백을 받고있습니다.
          </div>

          <FeedbackForm
            license={license}
            level={level}
            balance={balance}
            review={review}
            onLicenseChange={setLicense}
            onLevelChange={setLevel}
            onBalanceChange={setBalance}
            onReviewChange={setReview}
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
              disabled={saveFeedback.isPending}
            >
              취소
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={!isValid || saveFeedback.isPending}
            >
              {saveFeedback.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  제출 중...
                </>
              ) : (
                "제출하기"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
