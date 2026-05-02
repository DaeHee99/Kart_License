/**
 * 마이페이지 관련 Hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mypageAPI } from "@/lib/api/mypage";
import type { MypageDataResponse } from "@/lib/api/types";
import { toast } from "sonner";

// Query Keys
export const MYPAGE_DATA_QUERY_KEY = (
  userId: string,
  hideDeletedHistory = false,
) => ["mypage", "data", userId, { hideDeletedHistory }] as const;

interface UseMypageDataOptions {
  hideDeletedHistory?: boolean;
}

/**
 * 마이페이지 데이터 조회
 */
export function useMypageData(
  userId?: string,
  options: UseMypageDataOptions = {},
) {
  const hideDeletedHistory = options.hideDeletedHistory ?? false;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: userId
      ? MYPAGE_DATA_QUERY_KEY(userId, hideDeletedHistory)
      : ["mypage", "data", { hideDeletedHistory }],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return mypageAPI.getMypageData(userId, { hideDeletedHistory });
    },
    enabled: !!userId, // userId가 있을 때만 실행
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 10 * 60 * 1000, // 10분
  });

  return {
    latestRecord: data?.data?.latestRecord ?? null,
    tierHistory: data?.data?.tierHistory ?? [],
    seasonRecords: data?.data?.seasonRecords ?? [],
    measurementHistory: data?.data?.measurementHistory ?? [],
    isLoading,
    error,
    refetch,
  };
}

/**
 * 마이페이지 측정 기록 삭제
 *
 * 성공 시 마이페이지 전체 데이터를 다시 불러오지 않고 measurementHistory만
 * 캐시에서 제거해 스크롤 위치와 다른 탭 데이터가 유지되도록 한다.
 */
export function useDeleteMeasurementRecord(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recordId: string) =>
      mypageAPI.deleteMeasurementRecord(recordId),
    onMutate: async (recordId) => {
      if (!userId) return { previousData: undefined };

      const queryKey = MYPAGE_DATA_QUERY_KEY(userId, true);
      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<MypageDataResponse>(queryKey);

      queryClient.setQueryData<MypageDataResponse>(queryKey, (oldData) => {
        if (!oldData?.data) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            measurementHistory: oldData.data.measurementHistory.filter(
              (item) => item.id !== recordId,
            ),
          },
        };
      });

      return { previousData };
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("측정 기록이 삭제되었습니다.");
      } else {
        toast.error(response.error || "측정 기록 삭제에 실패했습니다.");
      }
    },
    onError: (error: any, _recordId, context) => {
      if (userId && context?.previousData) {
        queryClient.setQueryData(
          MYPAGE_DATA_QUERY_KEY(userId, true),
          context.previousData,
        );
      }

      toast.error(error.message || "측정 기록 삭제 중 오류가 발생했습니다.");
    },
  });
}
