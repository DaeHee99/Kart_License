/**
 * API 타입 정의
 */

// 공통 응답 타입
export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// 유저 타입
export interface User {
  _id: string;
  name: string;
  id: string;
  image?: string;
  license: string;
  role: number;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth 관련 타입
export interface LoginRequest {
  id: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  userId?: string;
  name?: string;
  message?: string;
}

export interface RegisterRequest {
  name: string;
  id: string;
  password: string;
  plainPassword: string;
  image?: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
}

export interface AuthResponse {
  _id: string;
  isAuth: boolean;
  name: string;
  image?: string;
  license: string;
  role: number;
  isAdmin: boolean;
  message?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  password?: string;
  image?: string;
}

// Map 관련 타입
export interface MapRecord {
  name: string;
  difficulty: "루키" | "L3" | "L2" | "L1";
  imageUrl: string;
  tierRecords: {
    elite: string;
    master: string;
    diamond: string;
    platinum: string;
    gold: string;
    silver: string;
    bronze: string;
  };
}

export interface MapDataResponse {
  success: boolean;
  data?: {
    season: number;
    maps: MapRecord[];
  };
  message?: string;
  error?: string;
}

// Record 관련 타입
export interface UserMapRecord {
  mapName: string;
  difficulty: "루키" | "L3" | "L2" | "L1";
  record: string; // MM:SS:mm 형식
  tier: "elite" | "master" | "diamond" | "platinum" | "gold" | "silver" | "bronze";
}

export interface SaveRecordRequest {
  userId?: string; // 비로그인 사용자의 경우 없을 수 있음
  season: number;
  records: UserMapRecord[];
}

export interface SaveRecordResponse {
  success: boolean;
  data?: {
    recordId: string;
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
  };
  message?: string;
  error?: string;
}

export interface UserRecord {
  _id: string;
  user?: string;
  season: number;
  records: UserMapRecord[];
  tierDistribution: {
    elite: number;
    master: number;
    diamond: number;
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
  };
  finalTier: string;
  createdAt: string;
  updatedAt: string;
}

export interface LatestRecordResponse {
  success: boolean;
  data?: UserRecord;
  message?: string;
  error?: string;
}

export interface UserRecordListResponse {
  success: boolean;
  data?: UserRecord[];
  message?: string;
  error?: string;
}

export interface RecordDetailResponse {
  success: boolean;
  data?: {
    _id: string;
    user?: {
      _id: string;
      name: string;
      id: string;
      image?: string;
      license: string;
    } | null;
    season: number;
    records: UserMapRecord[];
    tierDistribution: {
      elite: number;
      master: number;
      diamond: number;
      platinum: number;
      gold: number;
      silver: number;
      bronze: number;
    };
    finalTier: string;
    createdAt: string;
    updatedAt: string;
  };
  message?: string;
  error?: string;
}

export interface RecentRecord {
  _id: string;
  user?: {
    _id: string;
    name: string;
    id: string;
    image?: string;
    license: string;
  } | null;
  season: number;
  records: UserMapRecord[];
  tierDistribution: {
    elite: number;
    master: number;
    diamond: number;
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
  };
  finalTier: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecentRecordsResponse {
  success: boolean;
  data?: RecentRecord[];
  message?: string;
  error?: string;
}

// Mypage 관련 타입
export interface MypageLatestRecord {
  season: number;
  tier: string;
  tierEn: string;
  createdAt: Date;
}

export interface MypageTierHistoryItem {
  date: string;
  tier: string;
  value: number;
}

export interface MypageSeasonRecord {
  season: string;
  tier: string;
  tierEn: string;
  value: number;
  recordId: string;
  createdAt: Date;
}

export interface MypageMeasurementHistoryItem {
  id: string;
  season: string;
  tier: string;
  tierEn: string;
  maps: number;
  createdAt: Date;
}

export interface MypageDataResponse {
  success: boolean;
  data?: {
    latestRecord: MypageLatestRecord | null;
    tierHistory: MypageTierHistoryItem[];
    seasonRecords: MypageSeasonRecord[];
    measurementHistory: MypageMeasurementHistoryItem[];
  };
  message?: string;
  error?: string;
}
