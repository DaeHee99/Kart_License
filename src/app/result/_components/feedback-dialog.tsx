"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSaveFeedback } from "@/hooks/use-feedback";
import { Loader2 } from "lucide-react";
import { FeedbackForm } from "./feedback-form";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season: number;
  recordId: string;
  userId: string;
  userLicense: string;
}

export function FeedbackDialog({
  open,
  onOpenChange,
  season,
  recordId,
  userId,
  userLicense,
}: FeedbackDialogProps) {
  const [license, setLicense] = useState(userLicense || "");
  const [level, setLevel] = useState<number | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [review, setReview] = useState("");

  const saveFeedback = useSaveFeedback();

  // userLicense가 변경되면 license state 업데이트
  useEffect(() => {
    if (userLicense) {
      setLicense(userLicense);
    }
  }, [userLicense]);

  const handleSubmit = async () => {
    if (!level || !balance) {
      return;
    }

    await saveFeedback.mutateAsync({
      userId,
      license,
      level,
      balance,
      review,
      season,
      recordId,
    });

    onOpenChange(false);
  };

  const isValid = level !== null && balance !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>S{season} 군표 피드백</DialogTitle>
          <DialogDescription>
            안녕하세요. 카러플 군 계산기 운영진입니다.
            <br />
            이번 S{season} 군표 기록에 대한 피드백을 받고있습니다.
            <br />
            작성해주신 피드백은 다음 시즌에 반영될 예정입니다.
          </DialogDescription>
        </DialogHeader>

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

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saveFeedback.isPending}
          >
            취소
          </Button>
          <Button
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
