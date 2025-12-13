"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { motion } from "motion/react";
import { User, Loader2, Star, Scale, MessageSquare } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils-calc";
import Link from "next/link";
import { useStaffFeedbacks } from "@/hooks/use-admin";
import { AnimatedBackground } from "./_components/animated-background";
import { FeedbackHeader } from "./_components/feedback-header";

function FeedbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const { data, isLoading } = useStaffFeedbacks({
    page: currentPage,
    limit: 20,
  });

  const renderRatingStars = (
    rating: number,
    icon: "difficulty" | "balance",
  ) => {
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

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/feedback?${params.toString()}`);
  };

  // 페이지네이션 번호 생성 함수
  const generatePaginationNumbers = (
    currentPage: number,
    totalPages: number,
  ): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // 전체 페이지가 7개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 항상 첫 페이지 표시
      pages.push(1);

      if (currentPage <= 3) {
        // 현재 페이지가 앞쪽인 경우
        for (let i = 2; i <= Math.min(maxVisible, totalPages - 1); i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
      } else if (currentPage >= totalPages - 2) {
        // 현재 페이지가 뒤쪽인 경우
        pages.push("ellipsis");
        for (
          let i = Math.max(2, totalPages - maxVisible + 1);
          i < totalPages;
          i++
        ) {
          pages.push(i);
        }
      } else {
        // 현재 페이지가 중간인 경우
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
      }

      // 항상 마지막 페이지 표시
      pages.push(totalPages);
    }

    return pages;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const feedbacks = data?.feedbacks || [];
  const pagination = data?.pagination || { totalPages: 1, total: 0 };
  const paginationNumbers = generatePaginationNumbers(
    currentPage,
    pagination.totalPages,
  );

  return (
    <div className="space-y-6">
      {/* 피드백 목록 */}
      <div className="grid gap-4">
        {feedbacks.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">피드백이 없습니다.</p>
          </Card>
        ) : (
          feedbacks.map((feedback, index) => (
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
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    handlePageChange(currentPage - 1);
                  }
                }}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {paginationNumbers.map((pageNum, index) =>
              pageNum === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pageNum);
                    }}
                    isActive={currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < pagination.totalPages) {
                    handlePageChange(currentPage + 1);
                  }
                }}
                className={
                  currentPage === pagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <main className="relative min-h-screen overflow-hidden pb-24">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        }
      >
        <AnimatedBackground />
        <div className="relative z-10 px-4 py-6">
          <div className="mx-auto max-w-6xl space-y-6">
            <FeedbackHeader />
            <FeedbackContent />
          </div>
        </div>
      </Suspense>
    </main>
  );
}
