/**
 * 기록 관련 Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recordsAPI } from "@/lib/api/records";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { SaveRecordRequest } from "@/lib/api/types";

// Query Keys
export const MAPS_QUERY_KEY = ["maps", "latest"] as const;
export const LATEST_RECORD_QUERY_KEY = (userId: string) =>
  ["records", "latest", userId] as const;
export const USER_RECORDS_QUERY_KEY = (userId: string, season?: number) =>
  season ? ["records", "user", userId, season] : ["records", "user", userId];

/**
 * 최신 맵 데이터 조회
 * 측정 페이지에서 사용
 */
export function useLatestMaps() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: MAPS_QUERY_KEY,
    queryFn: recordsAPI.getLatestMaps,
    staleTime: 10 * 60 * 1000, // 10분 (맵 데이터는 자주 변경되지 않음)
    gcTime: 30 * 60 * 1000, // 30분
  });

  return {
    maps: data?.data?.maps ?? [],
    season: data?.data?.season ?? 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * 유저 최근 기록 조회
 * 측정 페이지에서 이전 기록 불러오기 위해 사용
 */
export function useLatestRecord(userId?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: userId ? LATEST_RECORD_QUERY_KEY(userId) : ["records", "latest"],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return recordsAPI.getLatestRecord(userId);
    },
    enabled: !!userId, // userId가 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분
    retry: false, // 기록이 없을 수 있으므로 재시도 안함
  });

  return {
    record: data?.data,
    isLoading,
    error,
    refetch,
  };
}

/**
 * 기록 저장 Mutation
 * 측정 완료 시 사용
 */
export function useSaveRecord() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SaveRecordRequest) => recordsAPI.saveRecord(data),
    onSuccess: (data) => {
      if (data.success && data.data) {
        // 최근 기록 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: ["records", "latest"],
        });

        // 로딩 페이지로 이동 (recordId를 쿼리 파라미터로 전달)
        router.push(`/result?id=${data.data.recordId}`);
      } else {
        toast.error(data.message || "기록 저장에 실패했습니다.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "기록 저장 중 오류가 발생했습니다.");
    },
  });
}

/**
 * 유저 기록 목록 조회 (추후 필요시 사용)
 */
export function useUserRecords(userId?: string, season?: number) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: userId
      ? USER_RECORDS_QUERY_KEY(userId, season)
      : ["records", "user"],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return recordsAPI.getUserRecords(userId, season);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    records: data?.data ?? [],
    isLoading,
    error,
    refetch,
  };
}

/**
 * 최근 기록 조회 (홈페이지용)
 */
export function useRecentRecords(limit?: number) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["records", "recent", limit],
    queryFn: () => recordsAPI.getRecentRecords(limit),
    staleTime: 1 * 60 * 1000, // 1분 (자주 업데이트되는 데이터)
    gcTime: 5 * 60 * 1000, // 5분
  });

  return {
    records: data?.data ?? [],
    isLoading,
    error,
    refetch,
  };
}
