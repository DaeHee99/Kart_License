import { TierType } from "@/lib/types";

export interface TierHistoryItem {
  date: string;
  tier: string;
  value: number;
  createdAt?: Date | string;
}

export interface MeasurementHistoryItem {
  id: string;
  date: string;
  tier: TierType;
  maps: number;
  season: string;
}

export interface SeasonRecord {
  season: string;
  tier: TierType;
  value: number;
}

// 시즌별 색상 정의
export const SEASON_COLORS: { [key: string]: { bg: string; border: string } } =
  {
    S35: { bg: "bg-blue-500/10", border: "border-blue-500" },
    S29: { bg: "bg-purple-500/10", border: "border-purple-500" },
    S18: { bg: "bg-gray-500/10", border: "border-gray-500" },
    S17: { bg: "bg-green-500/10", border: "border-green-500" },
  };

// 아바타 옵션
export const AVATAR_OPTIONS = [
  { id: "1", emoji: "🐻", color: "bg-red-100" },
  { id: "2", emoji: "😡", color: "bg-pink-100" },
  { id: "3", emoji: "😎", color: "bg-yellow-100" },
  { id: "4", emoji: "🥷", color: "bg-gray-100" },
  { id: "5", emoji: "😤", color: "bg-orange-100" },
  { id: "6", emoji: "🐵", color: "bg-red-200" },
  { id: "7", emoji: "😍", color: "bg-pink-200" },
  { id: "8", emoji: "🤓", color: "bg-blue-100" },
  { id: "9", emoji: "🤢", color: "bg-green-100" },
  { id: "10", emoji: "👽", color: "bg-green-200" },
  { id: "11", emoji: "😏", color: "bg-blue-200" },
  { id: "12", emoji: "🥳", color: "bg-purple-100" },
  { id: "13", emoji: "😺", color: "bg-purple-200" },
  { id: "14", emoji: "👾", color: "bg-indigo-100" },
  { id: "15", emoji: "🐶", color: "bg-orange-200" },
  { id: "16", emoji: "🦊", color: "bg-red-300" },
];
