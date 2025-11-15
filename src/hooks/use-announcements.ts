/**
 * 공지사항 관련 Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { announcementAPI } from "@/lib/api/announcements";
import { CreateAnnouncementRequest } from "@/lib/api/types";

// Query Keys
export const ANNOUNCEMENTS_QUERY_KEY = ["announcements"] as const;

/**
 * 공지사항 목록 조회
 */
export function useAnnouncements() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ANNOUNCEMENTS_QUERY_KEY,
    queryFn: () => announcementAPI.getAnnouncements(),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  return {
    announcements: data?.data ?? [],
    isLoading,
    error,
    refetch,
  };
}

/**
 * 공지사항 등록
 */
export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnnouncementRequest) =>
      announcementAPI.createAnnouncement(data),
    onSuccess: () => {
      // 공지사항 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY });
    },
  });
}
