// Tier Types
export type TierType =
  | "elite"
  | "master"
  | "diamond"
  | "platinum"
  | "gold"
  | "silver"
  | "bronze";

export interface Tier {
  id: TierType;
  name: string;
  nameKo: string;
  color: string;
  minScore: number;
  description: string;
}

export const TIERS: Record<TierType, Tier> = {
  elite: {
    id: "elite",
    name: "Elite Master",
    nameKo: "강주력",
    color: "tier-elite",
    minScore: 90,
    description: "최상위 프로급 실력",
  },
  master: {
    id: "master",
    name: "Master",
    nameKo: "주력",
    color: "tier-master",
    minScore: 80,
    description: "고수 수준의 실력",
  },
  diamond: {
    id: "diamond",
    name: "Diamond",
    nameKo: "1군",
    color: "tier-diamond",
    minScore: 70,
    description: "뛰어난 실력",
  },
  platinum: {
    id: "platinum",
    name: "Platinum",
    nameKo: "2군",
    color: "tier-platinum",
    minScore: 60,
    description: "준수한 실력",
  },
  gold: {
    id: "gold",
    name: "Gold",
    nameKo: "3군",
    color: "tier-gold",
    minScore: 50,
    description: "평균 이상의 실력",
  },
  silver: {
    id: "silver",
    name: "Silver",
    nameKo: "4군",
    color: "tier-silver",
    minScore: 40,
    description: "평균 수준의 실력",
  },
  bronze: {
    id: "bronze",
    name: "Bronze",
    nameKo: "일반",
    color: "tier-bronze",
    minScore: 0,
    description: "기본 수준의 실력",
  },
};

// Map Types
export type MapDifficulty = "루키" | "L3" | "L2" | "L1";

export interface MapRecord {
  id: string;
  name: string;
  difficulty: MapDifficulty;
  imageUrl?: string;
  tierRecords: Record<TierType, string>; // 각 군별 기준 기록
}

// User Record Types
export interface UserMapRecord {
  mapId: string;
  record?: string; // MM:SS:mm format
  tier?: TierType; // 선택한 군 (버튼 방식일 때)
}

export interface MeasurementResult {
  id: string;
  userId: string;
  timestamp: Date;
  tier: TierType;
  totalMaps: number;
  tierDistribution: Record<TierType, number>;
  records: UserMapRecord[];
}

// User Types
export interface User {
  id: string;
  nickname: string;
  profileImage?: string;
  currentTier?: TierType;
  createdAt: Date;
}

// Community Post Types
export interface Comment {
  id: string;
  postId?: string;
  userId: string;
  userNickname: string;
  userProfileImage?: string;
  userTier?: TierType;
  userRole?: number; // 0: 일반, 1: 관리자, 2: 운영진
  content: string;
  createdAt: Date;
  likes: string[]; // 좋아요를 누른 유저 ID 배열
  likeCount: number; // 좋아요 수
  isLiked?: boolean; // 현재 유저가 좋아요를 눌렀는지 여부
}

export type PostCategory = "notice" | "general" | "question";

export interface Post {
  _id: string; // MongoDB ObjectId
  userId: string;
  userNickname: string;
  userProfileImage?: string;
  userTier?: TierType;
  userRole?: number; // 0: 일반, 1: 관리자, 2: 운영진
  category?: PostCategory;
  title: string;
  content: string;
  images?: string[]; // 업로드된 이미지들
  comments: Comment[];
  commentCount?: number; // API 응답에서 오는 댓글 수
  views?: number;
  likes: string[]; // 좋아요를 누른 유저 ID 배열
  likeCount: number; // 좋아요 수
  isLiked?: boolean; // 현재 유저가 좋아요를 눌렀는지 여부
  createdAt: Date;
}

// Statistics Types
export interface Statistics {
  totalUsers: number;
  totalMeasurements: number;
  tierDistribution: Record<TierType, number>;
  recentMeasurements: MeasurementResult[];
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "error";
  createdAt: Date;
  isActive: boolean;
}

export type InputMethod = "button" | "manual";
