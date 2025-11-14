"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Loader2 } from "lucide-react";
import { FeedbackTable } from "./feedback-table";
import { useFeedbackStatistics } from "@/hooks/use-feedback";
import { useLatestMaps } from "@/hooks/use-records";

export function FeedbackTab() {
  // 최신 맵 데이터에서 시즌 정보 가져오기
  const { season } = useLatestMaps();

  // 피드백 통계 조회
  const { levelStats, balanceStats, totalCount, latestUpdate, isLoading } =
    useFeedbackStatistics(season);

  if (isLoading) {
    return (
      <Card className="border-border/50 relative overflow-hidden border-2 p-6">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

  // 난이도 피드백 데이터
  const difficultyFeedback = [
    { label: "매우 쉬움", value: levelStats[1], color: "#a855f7" },
    { label: "쉬움", value: levelStats[2], color: "#3b82f6" },
    { label: "보통", value: levelStats[3], color: "#94a3b8" },
    { label: "어려움", value: levelStats[4], color: "#f59e0b" },
    { label: "매우 어려움", value: levelStats[5], color: "#ef4444" },
  ];

  // 밸런스 피드백 데이터
  const balanceFeedback = [
    { label: "매우 좋음", value: balanceStats[1], color: "#a855f7" },
    { label: "좋음", value: balanceStats[2], color: "#3b82f6" },
    { label: "보통", value: balanceStats[3], color: "#94a3b8" },
    { label: "나쁨", value: balanceStats[4], color: "#f59e0b" },
    { label: "매우 나쁨", value: balanceStats[5], color: "#ef4444" },
  ];

  // 최근 업데이트 시간 포맷팅
  const formattedLatestUpdate = latestUpdate
    ? new Date(latestUpdate).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

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
            <h3 className="text-xl font-bold">S{season} 군표 피드백</h3>
          </div>
          <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
            {formattedLatestUpdate && (
              <Badge variant="secondary" className="font-normal">
                {formattedLatestUpdate} 기준
              </Badge>
            )}
            <Badge variant="secondary" className="font-normal">
              총 {totalCount.toLocaleString()}개의 피드백
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">
            {totalCount > 0
              ? "이번 시즌에 유저분들이 작성해주신 결과입니다."
              : "아직 작성된 피드백이 없습니다."}
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
