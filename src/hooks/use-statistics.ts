/**
 * 통계 관련 Hooks
 */

import { useQuery } from "@tanstack/react-query";
import { statisticsAPI } from "@/lib/api/statistics";

// Query Keys
export const STATISTICS_SUMMARY_QUERY_KEY = (season: number) =>
  ["statistics", "summary", season] as const;
export const RECORD_STATISTICS_QUERY_KEY = ["statistics", "records"] as const;
export const USER_LICENSE_STATISTICS_QUERY_KEY = [
  "statistics",
  "userLicenses",
] as const;

/**
 * 통계 요약 정보 조회
 */
export function useStatisticsSummary(season: number) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: STATISTICS_SUMMARY_QUERY_KEY(season),
    queryFn: () => statisticsAPI.getSummary(season),
    staleTime: 1 * 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
  });

  return {
    totalUsers: data?.data?.totalUsers ?? 0,
    totalRecords: data?.data?.totalRecords ?? 0,
    seasonRecords: data?.data?.seasonRecords ?? 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * 누적 측정 결과 조회
 */
export function useRecordStatistics() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: RECORD_STATISTICS_QUERY_KEY,
    queryFn: statisticsAPI.getRecordStatistics,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  return {
    recordData: data?.data?.recordData ?? [0, 0, 0, 0, 0, 0, 0],
    recordSum: data?.data?.recordSum ?? 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * 유저 군 분포 결과 조회
 */
export function useUserLicenseStatistics() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: USER_LICENSE_STATISTICS_QUERY_KEY,
    queryFn: statisticsAPI.getUserLicenseStatistics,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  return {
    licenseData: data?.data?.licenseData ?? [0, 0, 0, 0, 0, 0, 0],
    isLoading,
    error,
    refetch,
  };
}
