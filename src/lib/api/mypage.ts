/**
 * Mypage API 함수들
 */

import { apiClient } from "./client";
import type {
  DeleteMeasurementRecordResponse,
  MypageDataResponse,
} from "./types";

const API_BASE = "/api";

interface GetMypageDataOptions {
  hideDeletedHistory?: boolean;
}

export const mypageAPI = {
  // 마이페이지 데이터 조회
  getMypageData: async (
    userId: string,
    options: GetMypageDataOptions = {},
  ): Promise<MypageDataResponse> => {
    const params = new URLSearchParams({ userId });

    if (options.hideDeletedHistory) {
      params.set("hideDeletedHistory", "true");
    }

    return apiClient<MypageDataResponse>(`${API_BASE}/mypage/data?${params}`, {
      method: "GET",
    });
  },

  // 마이페이지 측정 기록 탭에서 기록 삭제(soft delete)
  deleteMeasurementRecord: async (
    recordId: string,
  ): Promise<DeleteMeasurementRecordResponse> => {
    return apiClient<DeleteMeasurementRecordResponse>(
      `${API_BASE}/records/${recordId}`,
      {
        method: "DELETE",
      },
    );
  },
};
