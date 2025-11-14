/**
 * 마이페이지 관련 Hooks
 */

import { useQuery } from "@tanstack/react-query";
import { mypageAPI } from "@/lib/api/mypage";

// Query Keys
export const MYPAGE_DATA_QUERY_KEY = (userId: string) =>
  ["mypage", "data", userId] as const;

/**
 * 마이페이지 데이터 조회
 */
export function useMypageData(userId?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: userId ? MYPAGE_DATA_QUERY_KEY(userId) : ["mypage", "data"],
    queryFn: () => {
      if (!userId) throw new Error("User ID is required");
      return mypageAPI.getMypageData(userId);
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
