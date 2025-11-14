/**
 * Statistics API 함수들
 */

import { apiClient } from "./client";
import type {
  StatisticsSummaryResponse,
  RecordStatisticsResponse,
  UserLicenseStatisticsResponse,
} from "./types";

const API_BASE = "/api";

export const statisticsAPI = {
  // 통계 요약 정보 조회
  getSummary: async (season: number): Promise<StatisticsSummaryResponse> => {
    return apiClient<StatisticsSummaryResponse>(
      `${API_BASE}/statistics/summary?season=${season}`,
      {
        method: "GET",
      }
    );
  },

  // 누적 측정 결과 조회
  getRecordStatistics: async (): Promise<RecordStatisticsResponse> => {
    return apiClient<RecordStatisticsResponse>(
      `${API_BASE}/records/statistics`,
      {
        method: "GET",
      }
    );
  },

  // 유저 군 분포 결과 조회
  getUserLicenseStatistics: async (): Promise<UserLicenseStatisticsResponse> => {
    return apiClient<UserLicenseStatisticsResponse>(
      `${API_BASE}/records/statistics/users`,
      {
        method: "GET",
      }
    );
  },
};
