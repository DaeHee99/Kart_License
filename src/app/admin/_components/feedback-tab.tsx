"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { User, Loader2, Star, Scale } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils-calc";
import Link from "next/link";
import { useAdminFeedbacks } from "@/hooks/use-admin";

export function FeedbackTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminFeedbacks({ page, limit: 20 });

  const renderRatingStars = (rating: number, icon: "difficulty" | "balance") => {
    const Icon = icon === "difficulty" ? Star : Scale;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const feedbacks = data?.feedbacks || [];
  const pagination = data?.pagination || { totalPages: 1 };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {feedbacks.map((feedback, index) => (
          <motion.div
            key={feedback._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6">
              <div className="flex items-start gap-4">
                {/* User Info */}
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={feedback.userProfileImage}
                    alt={feedback.userNickname}
                  />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{feedback.userNickname}</p>
                      <p className="text-muted-foreground text-sm">
                        {formatRelativeTime(new Date(feedback.createdAt))}
                      </p>
                    </div>
                    {feedback.recordId && (
                      <Link href={`/result/${feedback.recordId}`}>
                        <Button variant="outline" size="sm">
                          결과 보기
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Feedback Details */}
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline">시즌 {feedback.season}</Badge>
                    <Badge variant="outline">{feedback.license}</Badge>
                  </div>

                  {/* Ratings */}
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs font-medium">
                        난이도
                      </p>
                      {renderRatingStars(feedback.level, "difficulty")}
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs font-medium">
                        밸런스
                      </p>
                      {renderRatingStars(feedback.balance, "balance")}
                    </div>
                  </div>

                  {/* Review */}
                  {feedback.review && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-muted-foreground mb-1 text-xs font-medium">
                        의견
                      </p>
                      <p className="text-sm">{feedback.review}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            이전
          </Button>
          <span className="text-muted-foreground text-sm">
            {page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
