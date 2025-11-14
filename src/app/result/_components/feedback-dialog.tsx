"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSaveFeedback } from "@/hooks/use-feedback";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;
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

  const feedbackForm = useMemo(
    () => (
      <div className="space-y-6">
        {/* 1. 본인의 군 */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            1. 본인의 군을 체크해주세요. <span className="text-red-500">*</span>
          </Label>
          <RadioGroup value={license} onValueChange={setLicense} disabled>
            <div className="grid grid-cols-2 gap-3">
              {["강주력", "주력", "1군", "2군", "3군", "4군", "일반"].map(
                (tier) => (
                  <div key={tier} className="flex items-center space-x-2">
                    <RadioGroupItem value={tier} id={`license-${tier}`} disabled />
                    <Label
                      htmlFor={`license-${tier}`}
                      className="cursor-not-allowed font-normal opacity-70"
                    >
                      {tier}
                    </Label>
                  </div>
                )
              )}
            </div>
          </RadioGroup>
        </div>

        {/* 2. 난이도 */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            2. 이번 시즌 군표 난이도는 어떠셨나요? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={level !== null ? level.toString() : ""}
            onValueChange={(value) => setLevel(parseInt(value))}
          >
            <div className="space-y-2">
              {[
                { value: 1, label: "매우 쉬움" },
                { value: 2, label: "쉬움" },
                { value: 3, label: "보통" },
                { value: 4, label: "어려움" },
                { value: 5, label: "매우 어려움" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`level-${option.value}`}
                  />
                  <Label
                    htmlFor={`level-${option.value}`}
                    className="cursor-pointer font-normal"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* 3. 밸런스 */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            3. 이번 시즌 맵 별로 군표 밸런스는 어떠셨나요? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={balance !== null ? balance.toString() : ""}
            onValueChange={(value) => setBalance(parseInt(value))}
          >
            <div className="space-y-2">
              {[
                { value: 1, label: "매우 좋음" },
                { value: 2, label: "좋음" },
                { value: 3, label: "보통" },
                { value: 4, label: "나쁨" },
                { value: 5, label: "매우 나쁨" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`balance-${option.value}`}
                  />
                  <Label
                    htmlFor={`balance-${option.value}`}
                    className="cursor-pointer font-normal"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* 4. 그 외 의견 */}
        <div className="space-y-3">
          <Label htmlFor="review" className="text-base font-semibold">
            4. 그 외 의견 있으면 편하게 남겨주세요.
          </Label>
          <Textarea
            id="review"
            placeholder="의견을 입력해주세요..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
          />
        </div>
      </div>
    ),
    [license, level, balance, review]
  );

  if (isDesktop) {
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

          {feedbackForm}

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

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="overflow-y-auto px-4">
          <DrawerHeader>
            <DrawerTitle>S{season} 군표 피드백</DrawerTitle>
            <DrawerDescription>
              안녕하세요. 카러플 군 계산기 운영진입니다.
              <br />
              이번 S{season} 군표 기록에 대한 피드백을 받고있습니다.
              <br />
              작성해주신 피드백은 다음 시즌에 반영될 예정입니다.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4">
            {feedbackForm}
          </div>

          <DrawerFooter className="gap-2">
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
            <DrawerClose asChild>
              <Button variant="outline" disabled={saveFeedback.isPending}>
                취소
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
