"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { FeedbackTable } from "./feedback-table";

export function FeedbackTab() {
  // Feedback data
  const difficultyFeedback = [
    { label: "매우 쉬움", value: 13, color: "#a855f7" },
    { label: "쉬움", value: 9, color: "#3b82f6" },
    { label: "보통", value: 107, color: "#94a3b8" },
    { label: "어려움", value: 56, color: "#f59e0b" },
    { label: "매우 어려움", value: 28, color: "#ef4444" },
  ];

  const balanceFeedback = [
    { label: "매우 좋음", value: 10, color: "#a855f7" },
    { label: "좋음", value: 26, color: "#3b82f6" },
    { label: "보통", value: 126, color: "#94a3b8" },
    { label: "나쁨", value: 23, color: "#f59e0b" },
    { label: "매우 나쁨", value: 28, color: "#ef4444" },
  ];

  const totalDifficultyFeedback = difficultyFeedback.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <Card className="border-border/50 relative overflow-hidden border-2 p-6">
      <motion.div
        className="via-secondary/5 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
        animate={{ x: ["-200%", "200%"] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />

      <div className="relative space-y-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <MessageCircle className="text-secondary h-5 w-5" />
            <h3 className="text-xl font-bold">S35 군표 피드백</h3>
          </div>
          <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
            <Badge variant="secondary" className="font-normal">
              2025/10/26 07:34:17 기준
            </Badge>
            <Badge variant="secondary" className="font-normal">
              총 {totalDifficultyFeedback.toLocaleString()}개의 피드백
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            이번 시즌에 유저분들이 작성해주신 결과입니다.
          </p>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 난이도 피드백 */}
          <FeedbackTable
            title="이번 시즌 군표 난이도는 어떠셨나요?"
            feedbackData={difficultyFeedback}
          />

          {/* 밸런스 피드백 */}
          <FeedbackTable
            title="이번 시즌 맵 밸런스 군표 밸런스는 어떠셨나요?"
            feedbackData={balanceFeedback}
          />
        </div>
      </div>
    </Card>
  );
}
