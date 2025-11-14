/**
 * Feedback API 함수들
 */

import { apiClient } from "./client";
import type {
  FeedbackStatisticsResponse,
  SaveFeedbackRequest,
  SaveFeedbackResponse,
  UserFeedbackResponse,
} from "./types";

const API_BASE = "/api";

export const feedbackAPI = {
  // 피드백 저장
  saveFeedback: async (
    data: SaveFeedbackRequest
  ): Promise<SaveFeedbackResponse> => {
    return apiClient<SaveFeedbackResponse>(`${API_BASE}/feedback`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // 유저의 특정 시즌 피드백 조회
  getUserFeedback: async (
    userId: string,
    season: number
  ): Promise<UserFeedbackResponse> => {
    return apiClient<UserFeedbackResponse>(
      `${API_BASE}/feedback?userId=${userId}&season=${season}`,
      {
        method: "GET",
      }
    );
  },

  // 특정 시즌 피드백 통계 조회
  getFeedbackStatistics: async (
    season: number
  ): Promise<FeedbackStatisticsResponse> => {
    return apiClient<FeedbackStatisticsResponse>(
      `${API_BASE}/feedback/statistics?season=${season}`,
      {
        method: "GET",
      }
    );
  },
};
