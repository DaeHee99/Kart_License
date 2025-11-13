/**
 * Records API 함수들
 */

import { apiClient } from "./client";
import type {
  MapDataResponse,
  SaveRecordRequest,
  SaveRecordResponse,
  LatestRecordResponse,
  UserRecordListResponse,
  RecordDetailResponse,
  RecentRecordsResponse,
} from "./types";

const API_BASE = "/api";

export const recordsAPI = {
  // 맵 데이터 조회
  getLatestMaps: async (): Promise<MapDataResponse> => {
    return apiClient<MapDataResponse>(`${API_BASE}/maps/latest`, {
      method: "GET",
    });
  },

  // 기록 저장
  saveRecord: async (data: SaveRecordRequest): Promise<SaveRecordResponse> => {
    return apiClient<SaveRecordResponse>(`${API_BASE}/records`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // 유저 최근 기록 조회
  getLatestRecord: async (userId: string): Promise<LatestRecordResponse> => {
    return apiClient<LatestRecordResponse>(
      `${API_BASE}/records/latest?userId=${userId}`,
      {
        method: "GET",
      }
    );
  },

  // 유저 기록 목록 조회
  getUserRecords: async (
    userId: string,
    season?: number
  ): Promise<UserRecordListResponse> => {
    const params = new URLSearchParams({ userId });
    if (season) {
      params.append("season", season.toString());
    }
    return apiClient<UserRecordListResponse>(
      `${API_BASE}/records/user?${params.toString()}`,
      {
        method: "GET",
      }
    );
  },

  // 특정 기록 조회 (결과 페이지용)
  getRecordById: async (recordId: string): Promise<RecordDetailResponse> => {
    return apiClient<RecordDetailResponse>(`${API_BASE}/records/${recordId}`, {
      method: "GET",
    });
  },

  // 최근 기록 조회 (홈페이지용)
  getRecentRecords: async (limit?: number): Promise<RecentRecordsResponse> => {
    const params = limit ? `?limit=${limit}` : "";
    return apiClient<RecentRecordsResponse>(
      `${API_BASE}/records/recent${params}`,
      {
        method: "GET",
      }
    );
  },
};
