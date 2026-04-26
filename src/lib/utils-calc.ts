import { TierType, TIERS, UserMapRecord } from "./types";

// Calculate tier based on tier distribution
export function calculateTier(
  tierDistribution: Record<TierType, number>,
): TierType {
  // Weighted scoring system
  const weights: Record<TierType, number> = {
    elite: 8,
    master: 7,
    diamond: 6,
    platinum: 5,
    gold: 4,
    silver: 3,
    light: 2,
    bronze: 1,
  };

  let totalScore = 0;
  let totalMaps = 0;

  Object.entries(tierDistribution).forEach(([tier, count]) => {
    totalScore += weights[tier as TierType] * count;
    totalMaps += count;
  });

  if (totalMaps === 0) return "bronze";

  const averageScore = totalScore / totalMaps;

  // Determine tier based on average score
  if (averageScore >= 7.5) return "elite";
  if (averageScore >= 6.5) return "master";
  if (averageScore >= 5.5) return "diamond";
  if (averageScore >= 4.5) return "platinum";
  if (averageScore >= 3.5) return "gold";
  if (averageScore >= 2.5) return "silver";
  if (averageScore >= 1.5) return "light";
  return "bronze";
}

// Format time to MM:SS:mm
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}:${String(ms).padStart(2, "0")}`;
}

// Parse time string (MM:SS:mm) to seconds
export function parseTime(timeStr: string): number | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
  if (!match) return null;

  const [, mins, secs, ms] = match;
  const minutes = parseInt(mins, 10);
  const seconds = parseInt(secs, 10);
  const milliseconds = parseInt(ms, 10);

  if (seconds >= 60 || milliseconds >= 100) return null;

  return minutes * 60 + seconds + milliseconds / 100;
}

// Convert time string to comparable number (MM:SS:mm -> MMSSmmm)
// 잘못된 입력(undefined/빈 문자열 등)에는 NaN 반환하여 비교 시 항상 false가 되도록 함
export function timeToNumber(timeStr: string | undefined | null): number {
  if (typeof timeStr !== "string" || timeStr.length === 0) return NaN;
  const cleaned = timeStr.replace(/:/g, "").replace(/\s\+$/, "");
  const parsed = parseInt(cleaned, 10);
  return Number.isFinite(parsed) ? parsed : NaN;
}

// Find matching tier based on user's record
// 라이트 등급 도입 전에 저장된 시즌 데이터(예: tierRecords.light 부재)도 안전하게 처리
export function findMatchingTier(
  userRecord: string,
  tierRecords: Partial<Record<TierType, string>>,
): TierType | null {
  const userTime = timeToNumber(userRecord);
  if (!Number.isFinite(userTime)) return null;

  // Define tier order from best to worst
  const tierOrder: TierType[] = [
    "elite",
    "master",
    "diamond",
    "platinum",
    "gold",
    "silver",
    "light",
    "bronze",
  ];

  // Find the first tier where the standard is slower (larger number) than user's record
  for (const tier of tierOrder) {
    const standard = tierRecords[tier];
    if (!standard) continue; // 해당 tier 기준이 누락된 경우 건너뜀
    const tierTime = timeToNumber(standard);
    if (!Number.isFinite(tierTime)) continue;

    // If user's time is better than or equal to this tier's standard, they get this tier
    if (userTime <= tierTime) {
      return tier;
    }
  }

  // If user's record is slower than all tiers, return bronze
  return "bronze";
}

// Validate time format
export function isValidTimeFormat(timeStr: string): boolean {
  return /^\d{1,2}:\d{2}:\d{2}$/.test(timeStr);
}

// Format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec}초 전`;
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;

  return date.toLocaleDateString("ko-KR");
}

// Get tier color class
export function getTierColorClass(tier: TierType): string {
  return TIERS[tier].color;
}

// Get tier gradient
export function getTierGradient(tier: TierType): string {
  const gradients: Record<TierType, string> = {
    elite: "from-yellow-400 via-amber-500 to-yellow-400",
    master: "from-purple-500 via-violet-600 to-purple-500",
    diamond: "from-blue-400 via-cyan-500 to-blue-400",
    platinum: "from-cyan-300 via-teal-400 to-cyan-300",
    gold: "from-yellow-500 via-amber-600 to-yellow-500",
    silver: "from-gray-300 via-gray-400 to-gray-300",
    light: "from-emerald-400 via-green-500 to-emerald-400",
    bronze: "from-orange-700 via-amber-800 to-orange-700",
  };
  return gradients[tier];
}

// Calculate completion percentage
export function calculateCompletionPercentage(
  completed: number,
  total: number,
): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// Get next tier
export function getNextTier(currentTier: TierType): TierType | null {
  const tierOrder: TierType[] = [
    "bronze",
    "light",
    "silver",
    "gold",
    "platinum",
    "diamond",
    "master",
    "elite",
  ];
  const currentIndex = tierOrder.indexOf(currentTier);

  if (currentIndex === -1 || currentIndex === tierOrder.length - 1) return null;
  return tierOrder[currentIndex + 1];
}

// Get tier insights
export function getTierInsights(
  tier: TierType,
  tierDistribution: Record<TierType, number>,
): string {
  const nextTier = getNextTier(tier);
  const totalMaps = Object.values(tierDistribution).reduce(
    (sum, count) => sum + count,
    0,
  );
  const currentTierCount = tierDistribution[tier];

  if (tier === "elite") {
    return "최상위 군을 달성하셨습니다! 🏆";
  }

  if (nextTier) {
    const nextTierName = TIERS[nextTier].nameKo;
    return `조금만 더 노력하면 ${nextTierName}으로 올라갈 수 있어요! 💪`;
  }

  return "꾸준히 연습하여 군을 올려보세요! 🎯";
}

// Convert Korean tier name to English TierType
export function convertKoreanTierToEnglish(koreanTier: string): TierType {
  const tierMap: Record<string, TierType> = {
    강주력: "elite",
    주력: "master",
    "1군": "diamond",
    "2군": "platinum",
    "3군": "gold",
    "4군": "silver",
    라이트: "light",
    일반: "bronze",
  };

  return tierMap[koreanTier] || "bronze";
}

// Get tier ring color class (for avatar borders)
export function getTierRingClass(tier: TierType): string {
  const ringClasses: Record<TierType, string> = {
    elite: "ring-[var(--tier-elite)]",
    master: "ring-[var(--tier-master)]",
    diamond: "ring-[var(--tier-diamond)]",
    platinum: "ring-[var(--tier-platinum)]",
    gold: "ring-[var(--tier-gold)]",
    silver: "ring-[var(--tier-silver)]",
    light: "ring-[var(--tier-light)]",
    bronze: "ring-[var(--tier-bronze)]",
  };

  return ringClasses[tier];
}
