"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface FeedbackFormProps {
  license: string;
  level: number | null;
  balance: number | null;
  review: string;
  onLicenseChange: (license: string) => void;
  onLevelChange: (level: number) => void;
  onBalanceChange: (balance: number) => void;
  onReviewChange: (review: string) => void;
}

export function FeedbackForm({
  license,
  level,
  balance,
  review,
  onLicenseChange,
  onLevelChange,
  onBalanceChange,
  onReviewChange,
}: FeedbackFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          1. 본인의 군을 체크해주세요. <span className="text-red-500">*</span>
        </Label>
        <RadioGroup value={license} onValueChange={onLicenseChange} disabled>
          <div className="grid grid-cols-2 gap-3">
            {[
              "강주력",
              "주력",
              "1군",
              "2군",
              "3군",
              "4군",
              "라이트",
              "일반",
            ].map((tier) => (
              <div key={tier} className="flex items-center space-x-2">
                <RadioGroupItem value={tier} id={`license-${tier}`} disabled />
                <Label
                  htmlFor={`license-${tier}`}
                  className="cursor-not-allowed font-normal opacity-70"
                >
                  {tier}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">
          2. 이번 시즌 군표 난이도는 어떠셨나요?{" "}
          <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={level !== null ? level.toString() : ""}
          onValueChange={(value) => onLevelChange(parseInt(value))}
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

      <div className="space-y-3">
        <Label className="text-base font-semibold">
          3. 이번 시즌 맵 별로 군표 밸런스는 어떠셨나요?{" "}
          <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={balance !== null ? balance.toString() : ""}
          onValueChange={(value) => onBalanceChange(parseInt(value))}
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

      <div className="space-y-3">
        <Label htmlFor="review" className="text-base font-semibold">
          4. 그 외 의견 있으면 편하게 남겨주세요.
        </Label>
        <Textarea
          id="review"
          placeholder="의견을 입력해주세요..."
          value={review}
          onChange={(event) => onReviewChange(event.target.value)}
          rows={4}
        />
      </div>
    </div>
  );
}
