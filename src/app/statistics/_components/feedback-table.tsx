"use client";

import { motion } from "motion/react";

interface FeedbackItem {
  label: string;
  value: number;
  color: string;
}

interface FeedbackTableProps {
  title: string;
  feedbackData: FeedbackItem[];
}

export function FeedbackTable({ title, feedbackData }: FeedbackTableProps) {
  const totalFeedback = feedbackData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <div className="space-y-4">
      <h4 className="text-muted-foreground text-sm font-medium">{title}</h4>

      <div className="border-border/50 space-y-0 overflow-hidden rounded-lg border">
        <div className="bg-muted/50 border-border/50 grid grid-cols-2 border-b">
          <div className="text-muted-foreground px-4 py-2 text-xs font-medium">
            {title.includes("난이도") ? "난이도" : "밸런스"}
          </div>
          <div className="text-muted-foreground px-4 py-2 text-right text-xs font-medium">
            인원
          </div>
        </div>

        {feedbackData.map((feedback, index) => {
          const percentage = Math.round(
            (feedback.value / totalFeedback) * 100,
          );

          return (
            <motion.div
              key={feedback.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.15,
                delay: index * 0.03,
              }}
              className="border-border/50 hover:bg-primary/5 relative grid grid-cols-2 border-b transition-colors last:border-b-0"
              style={{
                backgroundColor: `${feedback.color}10`,
              }}
            >
              <motion.div
                className="absolute top-0 bottom-0 left-0 opacity-20"
                style={{ backgroundColor: feedback.color }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.03 + 0.1,
                }}
              />

              <div className="relative z-10 flex items-center gap-2 px-4 py-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: feedback.color }}
                />
                <span className="text-sm font-medium">{feedback.label}</span>
              </div>
              <div className="relative z-10 px-4 py-3 text-right">
                <span className="font-mono text-sm font-medium">
                  {feedback.value.toLocaleString()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
