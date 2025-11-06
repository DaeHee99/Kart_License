import {
  MapRecord,
  TierType,
  User,
  Post,
  MeasurementResult,
  Statistics,
  Announcement,
} from "./types";

// Mock Maps Data (10 maps for testing)
export const MOCK_MAPS: MapRecord[] = [
  {
    id: "map-1",
    name: "노르테유 익스프레스",
    difficulty: "L2",
    tierRecords: {
      elite: "01:15:23",
      master: "01:18:45",
      diamond: "01:22:10",
      platinum: "01:26:30",
      gold: "01:31:00",
      silver: "01:36:50",
      bronze: "01:45:00",
    },
  },
  {
    id: "map-2",
    name: "차이나 서안 병마용",
    difficulty: "L1",
    tierRecords: {
      elite: "01:28:12",
      master: "01:32:45",
      diamond: "01:37:20",
      platinum: "01:42:10",
      gold: "01:48:00",
      silver: "01:54:30",
      bronze: "02:02:00",
    },
  },
  {
    id: "map-3",
    name: "포레스트 지그재그",
    difficulty: "L3",
    tierRecords: {
      elite: "01:22:45",
      master: "01:26:30",
      diamond: "01:30:50",
      platinum: "01:35:20",
      gold: "01:40:10",
      silver: "01:46:00",
      bronze: "01:53:00",
    },
  },
  {
    id: "map-4",
    name: "쥐라기 공룡섬",
    difficulty: "L2",
    tierRecords: {
      elite: "01:35:20",
      master: "01:39:50",
      diamond: "01:44:30",
      platinum: "01:49:40",
      gold: "01:55:20",
      silver: "02:01:50",
      bronze: "02:10:00",
    },
  },
  {
    id: "map-5",
    name: "빌리지 운명의 다리",
    difficulty: "루키",
    tierRecords: {
      elite: "01:18:33",
      master: "01:22:15",
      diamond: "01:26:40",
      platinum: "01:31:20",
      gold: "01:36:50",
      silver: "01:43:00",
      bronze: "01:51:00",
    },
  },
  {
    id: "map-6",
    name: "빌리지 운하",
    difficulty: "L1",
    tierRecords: {
      elite: "01:42:10",
      master: "01:46:45",
      diamond: "01:51:30",
      platinum: "01:56:50",
      gold: "02:02:40",
      silver: "02:09:20",
      bronze: "02:18:00",
    },
  },
  {
    id: "map-7",
    name: "코리아 서킷",
    difficulty: "L3",
    tierRecords: {
      elite: "01:25:55",
      master: "01:29:40",
      diamond: "01:34:10",
      platinum: "01:39:00",
      gold: "01:44:30",
      silver: "01:50:40",
      bronze: "01:58:00",
    },
  },
  {
    id: "map-8",
    name: "사막 빙글빙글 공사장",
    difficulty: "L2",
    tierRecords: {
      elite: "01:31:20",
      master: "01:35:50",
      diamond: "01:40:30",
      platinum: "01:45:40",
      gold: "01:51:20",
      silver: "01:57:50",
      bronze: "02:06:00",
    },
  },
  {
    id: "map-9",
    name: "빌리지 고가의 질주",
    difficulty: "L1",
    tierRecords: {
      elite: "01:38:45",
      master: "01:43:20",
      diamond: "01:48:10",
      platinum: "01:53:30",
      gold: "01:59:20",
      silver: "02:06:00",
      bronze: "02:14:00",
    },
  },
  {
    id: "map-10",
    name: "코리아 서킷",
    difficulty: "루키",
    tierRecords: {
      elite: "01:20:30",
      master: "01:24:15",
      diamond: "01:28:45",
      platinum: "01:33:40",
      gold: "01:39:00",
      silver: "01:45:20",
      bronze: "01:53:00",
    },
  },
];

// Mock Current User
export const MOCK_CURRENT_USER: User = {
  id: "user1",
  nickname: "앵두새",
  profileImage: undefined,
  currentTier: "diamond",
  createdAt: new Date("2025-09-01"),
};

// Mock Posts
export const MOCK_POSTS: Post[] = [
  {
    id: "post-1",
    userId: "current-user",
    userNickname: "현재유저",
    userTier: "elite",
    title: "강주력 달성했어요! 🎉",
    content:
      "드디어 강주력을 달성했습니다! 3개월 동안 열심히 연습한 결과네요. 특히 노르테유 스카이라인 맵이 제일 어려웠어요.",
    images: [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDA0MTZfMTU5%2FMDAxNTg3MDAyMzkwNTQ0.L7q3wL50VkYdpIHCQ9ufmvBkBmOCSYsWLjmwetpXGoAg.8pcjBOoVnAfl4kjeH5kuYwY6JTE1RYyXC7j8dhcJ0KUg.JPEG.yj120011%2F1587002389523.jpg&type=sc960_832",
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDA1MTBfNyAg%2FMDAxNTg5MTE4ODY3NTc5.odrvgO-kaYuykg6BXQ-2Z0crps2JdL52CjDRGwNjGlwg.jGrj3xJkrMksCs7lfdI4Q2l9TPBh4Z6onCwkYmdVt_Yg.JPEG.ssky337%2Fgammmkn15.jpg&type=sc960_832",
    ],
    comments: [
      {
        id: "comment-1",
        postId: "post-1",
        userId: "user-3",
        userNickname: "레이싱마스터",
        userTier: "master",
        content: "축하합니다! 대단하시네요 👏",
        createdAt: new Date("2025-10-24T10:30:00"),
      },
    ],
    views: 1234,
    createdAt: new Date("2025-10-24T09:15:00"),
  },
  {
    id: "post-2",
    userId: "user-4",
    userNickname: "드리프트왕",
    userTier: "master",
    title: "주력 유지하는 팁 공유합니다",
    content:
      "주력을 유지하려면 꾸준한 연습이 중요해요. 매일 1시간씩 연습하면서 기록을 갱신하고 있습니다.",
    images: [
      "https://search.pstatic.net/common/?src=http%3A%2F%2Fimage.nmv.naver.net%2Fblog_2020_08_13_1083%2F10ab2452-dd68-11ea-9c97-505dac8c381b_01.jpg&type=sc960_832",
    ],
    comments: [],
    views: 567,
    createdAt: new Date("2025-10-23T14:20:00"),
  },
  {
    id: "post-3",
    userId: "user-5",
    userNickname: "초보드라이버",
    userTier: "gold",
    title: "3군에서 2군으로 올라가려면?",
    content:
      "3군인데 2군으로 올라가고 싶어요. 어떤 맵부터 연습하는 게 좋을까요?",
    comments: [
      {
        id: "comment-2",
        postId: "post-3",
        userId: "user-2",
        userNickname: "스피드킹",
        userTier: "elite",
        content: "포레스트 해어핀 맵을 집중 연습해보세요!",
        createdAt: new Date("2025-10-23T16:45:00"),
      },
      {
        id: "comment-3",
        postId: "post-3",
        userId: "user-4",
        userNickname: "드리프트왕",
        userTier: "master",
        content: "드리프트 타이밍이 중요합니다. 연습 모드에서 먼저 익히세요.",
        createdAt: new Date("2025-10-23T17:10:00"),
      },
    ],
    views: 892,
    createdAt: new Date("2025-10-23T15:30:00"),
  },
];

// Mock Recent Measurements
export const MOCK_RECENT_MEASUREMENTS: MeasurementResult[] = [
  {
    id: "measure-1",
    userId: "user-1",
    tier: "master" as TierType,
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
    totalMaps: 70,
    tierDistribution: {
      elite: 0,
      master: 40,
      diamond: 20,
      platinum: 10,
      gold: 0,
      silver: 0,
      bronze: 0,
    },
    records: [],
  },
  {
    id: "measure-2",
    userId: "user-2",
    tier: "diamond" as TierType,
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15분 전
    totalMaps: 70,
    tierDistribution: {
      elite: 0,
      master: 20,
      diamond: 30,
      platinum: 15,
      gold: 5,
      silver: 0,
      bronze: 0,
    },
    records: [],
  },
  {
    id: "measure-3",
    userId: "user-3",
    tier: "platinum" as TierType,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    totalMaps: 70,
    tierDistribution: {
      elite: 0,
      master: 10,
      diamond: 20,
      platinum: 25,
      gold: 10,
      silver: 5,
      bronze: 0,
    },
    records: [],
  },
  {
    id: "measure-4",
    userId: "user-4",
    tier: "gold" as TierType,
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45분 전
    totalMaps: 70,
    tierDistribution: {
      elite: 0,
      master: 5,
      diamond: 15,
      platinum: 20,
      gold: 20,
      silver: 10,
      bronze: 0,
    },
    records: [],
  },
  {
    id: "measure-5",
    userId: "user-5",
    tier: "silver" as TierType,
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1시간 전
    totalMaps: 70,
    tierDistribution: {
      elite: 0,
      master: 2,
      diamond: 10,
      platinum: 15,
      gold: 20,
      silver: 15,
      bronze: 8,
    },
    records: [],
  },
  {
    id: "measure-6",
    userId: "user-6",
    tier: "elite" as TierType,
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1시간 30분 전
    totalMaps: 70,
    tierDistribution: {
      elite: 50,
      master: 15,
      diamond: 5,
      platinum: 0,
      gold: 0,
      silver: 0,
      bronze: 0,
    },
    records: [],
  },
  {
    id: "measure-7",
    userId: "user-7",
    tier: "master" as TierType,
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2시간 전
    totalMaps: 70,
    tierDistribution: {
      elite: 0,
      master: 40,
      diamond: 20,
      platinum: 10,
      gold: 0,
      silver: 0,
      bronze: 0,
    },
    records: [],
  },
  {
    id: "measure-8",
    userId: "user-8",
    tier: "diamond" as TierType,
    timestamp: new Date(Date.now() - 1000 * 60 * 150), // 2시간 30분 전
    totalMaps: 70,
    tierDistribution: {
      elite: 0,
      master: 20,
      diamond: 30,
      platinum: 15,
      gold: 5,
      silver: 0,
      bronze: 0,
    },
    records: [],
  },
  {
    id: "measure-9",
    userId: "user-9",
    tier: "platinum" as TierType,
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3시간 전
    totalMaps: 70,
    tierDistribution: {
      elite: 0,
      master: 10,
      diamond: 20,
      platinum: 25,
      gold: 10,
      silver: 5,
      bronze: 0,
    },
    records: [],
  },
  {
    id: "measure-10",
    userId: "user-1",
    tier: "gold" as TierType,
    timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4시간 전
    totalMaps: 70,
    tierDistribution: {
      elite: 0,
      master: 5,
      diamond: 15,
      platinum: 20,
      gold: 20,
      silver: 10,
      bronze: 0,
    },
    records: [],
  },
];

// Mock Statistics
export const MOCK_STATISTICS: Statistics = {
  totalUsers: 15234,
  totalMeasurements: 48921,
  tierDistribution: {
    elite: 234,
    master: 1523,
    diamond: 3456,
    platinum: 4321,
    gold: 3210,
    silver: 1890,
    bronze: 600,
  },
  recentMeasurements: MOCK_RECENT_MEASUREMENTS,
};

// Mock Announcements
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "announce-1",
    title: "🎉 서비스 정식 오픈!",
    content:
      "카러플 군 계산기 v2가 정식으로 오픈했습니다! 새로운 디자인과 기능을 경험해보세요.",
    type: "success",
    createdAt: new Date("2025-10-25T09:00:00"),
    isActive: true,
  },
  {
    id: "announce-2",
    title: "⚡ 신규 맵 추가 예정",
    content: "다음 업데이트에서 신규 맵 1개가 추가될 예정입니다.",
    type: "info",
    createdAt: new Date("2025-10-24T14:00:00"),
    isActive: true,
  },
];

// Helper function to get user nickname
export function getUserNickname(userId: string): string {
  const nicknames: Record<string, string> = {
    "user-1": "카트라이더Pro",
    "user-2": "스피드킹",
    "user-3": "레이싱마스터",
    "user-4": "드리프트왕",
    "user-5": "초보드라이버",
    "user-6": "부스터매니아",
    "user-7": "트랙의신",
    "user-8": "레이서123",
    "user-9": "프로게이머",
  };
  return nicknames[userId] || `유저${userId.slice(-3)}`;
}
