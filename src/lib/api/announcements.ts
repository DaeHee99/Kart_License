/**
 * 공지사항 API
 */

import {
  Announcement,
  AnnouncementsResponse,
  CreateAnnouncementRequest,
  CreateAnnouncementResponse,
} from "./types";

const API_BASE_URL = "/api/announcements";

export const announcementAPI = {
  /**
   * 공지사항 목록 조회
   */
  getAnnouncements: async (): Promise<AnnouncementsResponse> => {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  },

  /**
   * 공지사항 등록
   */
  createAnnouncement: async (
    data: CreateAnnouncementRequest
  ): Promise<CreateAnnouncementResponse> => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    return response.json();
  },
};
