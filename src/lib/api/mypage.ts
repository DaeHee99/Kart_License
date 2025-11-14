/**
 * Mypage API 함수들
 */

import { apiClient } from "./client";
import type { MypageDataResponse } from "./types";

const API_BASE = "/api";

export const mypageAPI = {
  // 마이페이지 데이터 조회
  getMypageData: async (userId: string): Promise<MypageDataResponse> => {
    return apiClient<MypageDataResponse>(
      `${API_BASE}/mypage/data?userId=${userId}`,
      {
        method: "GET",
      }
    );
  },
};
