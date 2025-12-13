import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ============= Types =============

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UserData {
  _id: string;
  nickname: string;
  profileImage: string;
  tier: string;
  lastAccess: string | null;
}

interface UsersResponse {
  users: UserData[];
  pagination: PaginationInfo;
}

interface RecordData {
  _id: string;
  userId: string;
  user?: {
    name: string;
    image: string;
  };
  season: number;
  finalTier: string;
  tierDistribution: {
    elite: number;
    master: number;
    diamond: number;
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
  };
  createdAt: string;
}

interface FeedbackData {
  _id: string;
  userNickname: string;
  userProfileImage: string;
  season: number;
  license: string;
  level: number;
  balance: number;
  review: string;
  recordId: string | null;
  createdAt: string;
}

interface FeedbacksResponse {
  feedbacks: FeedbackData[];
  pagination: PaginationInfo;
}

interface LogData {
  _id: string;
  nickname: string;
  profilePicture: string;
  actionType: string;
  content: string;
  createdAt: string;
  metadata?: {
    recordId?: string;
    postId?: string;
    commentId?: string;
    season?: number;
    tier?: string;
    ip?: string;
    userAgent?: string;
    [key: string]: unknown;
  };
}

interface LogsResponse {
  logs: LogData[];
  pagination: PaginationInfo;
}

interface AnnouncementData {
  _id: string;
  title: string;
  content: string;
  show: boolean;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

interface AnnouncementsResponse {
  announcements: AnnouncementData[];
  pagination: PaginationInfo;
}

interface StatsData {
  totalUsers: number;
  totalMeasurements: number;
  totalFeedbacks: number;
  totalLogs: number;
}

// ============= Query Keys =============

export const adminKeys = {
  all: ["admin"] as const,
  users: (params?: PaginationParams) => [...adminKeys.all, "users", params] as const,
  feedbacks: (params?: PaginationParams) => [...adminKeys.all, "feedbacks", params] as const,
  logs: (params?: PaginationParams) => [...adminKeys.all, "logs", params] as const,
  announcements: (params?: PaginationParams) => [...adminKeys.all, "announcements", params] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
};

export const staffKeys = {
  all: ["staff"] as const,
  feedbacks: (params?: PaginationParams) => [...staffKeys.all, "feedbacks", params] as const,
};

export const recordKeys = {
  all: ["records"] as const,
  recent: (limit?: number) => [...recordKeys.all, "recent", limit] as const,
};

// ============= Hooks =============

/**
 * 관리자 유저 목록 조회
 */
export function useAdminUsers(params: PaginationParams = {}) {
  const { page = 1, limit = 20 } = params;

  return useQuery({
    queryKey: adminKeys.users({ page, limit }),
    queryFn: async (): Promise<UsersResponse> => {
      const response = await fetch(`/api/admin/users?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });
}

/**
 * 최근 측정 기록 조회
 */
export function useRecentRecords(limit: number = 20) {
  return useQuery({
    queryKey: recordKeys.recent(limit),
    queryFn: async (): Promise<{ success: boolean; data: RecordData[] }> => {
      const response = await fetch(`/api/records/recent?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recent records");
      }
      return response.json();
    },
  });
}

/**
 * 관리자 피드백 목록 조회
 */
export function useAdminFeedbacks(params: PaginationParams = {}) {
  const { page = 1, limit = 20 } = params;

  return useQuery({
    queryKey: adminKeys.feedbacks({ page, limit }),
    queryFn: async (): Promise<FeedbacksResponse> => {
      const response = await fetch(`/api/admin/feedbacks?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch feedbacks");
      }
      return response.json();
    },
  });
}

/**
 * 운영진용 피드백 목록 조회 (관리자/운영진 모두 사용 가능)
 */
export function useStaffFeedbacks(params: PaginationParams = {}) {
  const { page = 1, limit = 20 } = params;

  return useQuery({
    queryKey: staffKeys.feedbacks({ page, limit }),
    queryFn: async (): Promise<FeedbacksResponse> => {
      const response = await fetch(`/api/admin/feedbacks?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch feedbacks");
      }
      return response.json();
    },
  });
}

/**
 * 관리자 로그 목록 조회
 */
export function useAdminLogs(params: PaginationParams = {}) {
  const { page = 1, limit = 50 } = params;

  return useQuery({
    queryKey: adminKeys.logs({ page, limit }),
    queryFn: async (): Promise<LogsResponse> => {
      const response = await fetch(`/api/logs?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }
      return response.json();
    },
  });
}

/**
 * 관리자 공지사항 목록 조회
 */
export function useAdminAnnouncements(params: PaginationParams = {}) {
  const { page = 1, limit = 20 } = params;

  return useQuery({
    queryKey: adminKeys.announcements({ page, limit }),
    queryFn: async (): Promise<AnnouncementsResponse> => {
      const response = await fetch(`/api/admin/announcements?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }
      return response.json();
    },
  });
}

/**
 * 관리자 통계 조회
 */
export function useAdminStats() {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: async (): Promise<StatsData> => {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      return response.json();
    },
  });
}

/**
 * 공지사항 표시 상태 토글 Mutation
 */
export function useToggleAnnouncementShow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, show }: { id: string; show: boolean }) => {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ show }),
      });

      if (!response.ok) {
        throw new Error("Failed to update announcement");
      }

      return response.json();
    },
    onSuccess: () => {
      // 관리자 공지사항 쿼리 무효화 (모든 페이지)
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      // 사용자 공지사항 모달 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
