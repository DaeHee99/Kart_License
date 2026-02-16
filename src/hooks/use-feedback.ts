/**
 * 피드백 관련 Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { feedbackAPI } from "@/lib/api/feedback";
import { toast } from "sonner";
import type { SaveFeedbackRequest } from "@/lib/api/types";

// Query Keys
export const FEEDBACK_STATISTICS_QUERY_KEY = (season: number) =>
  ["feedback", "statistics", season] as const;
export const USER_FEEDBACK_QUERY_KEY = (userId: string, season: number) =>
  ["feedback", "user", userId, season] as const;

/**
 * 피드백 통계 조회
 */
export function useFeedbackStatistics(season: number) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: FEEDBACK_STATISTICS_QUERY_KEY(season),
    queryFn: () => feedbackAPI.getFeedbackStatistics(season),
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
  });

  return {
    levelStats: data?.data?.levelStats ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    balanceStats: data?.data?.balanceStats ?? {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    totalCount: data?.data?.totalCount ?? 0,
    latestUpdate: data?.data?.latestUpdate ?? null,
    isLoading,
    error,
    refetch,
  };
}

/**
 * 유저의 특정 시즌 피드백 조회
 */
export function useUserFeedback(userId?: string, season?: number) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey:
      userId && season
        ? USER_FEEDBACK_QUERY_KEY(userId, season)
        : ["feedback", "user"],
    queryFn: () => {
      if (!userId || !season)
        throw new Error("userId and season are required");
      return feedbackAPI.getUserFeedback(userId, season);
    },
    enabled: !!userId && !!season,
    staleTime: 5 * 60 * 1000, // 5분
    retry: false, // 피드백이 없을 수 있으므로 재시도 안함
  });

  return {
    feedback: data?.data ?? null,
    isLoading,
    error,
    refetch,
  };
}

/**
 * 피드백 저장 Mutation
 */
export function useSaveFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveFeedbackRequest) => feedbackAPI.saveFeedback(data),
    onSuccess: (data, variables) => {
      if (data.success) {
        toast.success("피드백이 저장되었습니다. 감사합니다! 🎉");

        // 피드백 통계 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: FEEDBACK_STATISTICS_QUERY_KEY(variables.season),
        });

        // 유저 피드백 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: USER_FEEDBACK_QUERY_KEY(variables.userId, variables.season),
        });

        // 통계 요약 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: ["statistics", "summary"],
        });
      } else {
        toast.error(data.message || "피드백 저장에 실패했습니다.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "피드백 저장 중 오류가 발생했습니다.");
    },
  });
}
