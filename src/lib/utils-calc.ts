import { TierType, TIERS, UserMapRecord } from "./types";

// Calculate tier based on tier distribution
export function calculateTier(
  tierDistribution: Record<TierType, number>,
): TierType {
  // Weighted scoring system
  const weights: Record<TierType, number> = {
    elite: 7,
    master: 6,
    diamond: 5,
    platinum: 4,
    gold: 3,
    silver: 2,
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
  if (averageScore >= 6.5) return "elite";
  if (averageScore >= 5.5) return "master";
  if (averageScore >= 4.5) return "diamond";
  if (averageScore >= 3.5) return "platinum";
  if (averageScore >= 2.5) return "gold";
  if (averageScore >= 1.5) return "silver";
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
export function timeToNumber(timeStr: string): number {
  const cleaned = timeStr.replace(/:/g, "");
  return parseInt(cleaned, 10);
}

// Find matching tier based on user's record
export function findMatchingTier(
  userRecord: string,
  tierRecords: Record<TierType, string>,
): TierType | null {
  const userTime = timeToNumber(userRecord);

  // Define tier order from best to worst
  const tierOrder: TierType[] = [
    "elite",
    "master",
    "diamond",
    "platinum",
    "gold",
    "silver",
    "bronze",
  ];

  // Find the first tier where the standard is slower (larger number) than user's record
  for (const tier of tierOrder) {
    const tierTime = timeToNumber(tierRecords[tier]);

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
