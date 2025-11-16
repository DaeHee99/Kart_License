/**
 * 비로그인 유저를 위한 로컬 스토리지 관리
 */

export const GUEST_MEASUREMENT_KEY = "kart_license_guest_measurement";

export interface GuestMeasurementData {
  season: number;
  records: Array<{
    mapName: string;
    difficulty: "루키" | "L3" | "L2" | "L1";
    record: string;
    tier: "elite" | "master" | "diamond" | "platinum" | "gold" | "silver" | "bronze";
  }>;
  savedAt: string; // ISO date string
}

/**
 * 비로그인 유저의 측정 결과를 로컬 스토리지에 저장
 */
export function saveGuestMeasurement(data: Omit<GuestMeasurementData, "savedAt">): void {
  if (typeof window === "undefined") return;

  const storageData: GuestMeasurementData = {
    ...data,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(GUEST_MEASUREMENT_KEY, JSON.stringify(storageData));
  } catch (error) {
    console.error("Failed to save guest measurement:", error);
  }
}

/**
 * 비로그인 유저의 이전 측정 결과를 로컬 스토리지에서 불러오기
 */
export function loadGuestMeasurement(): GuestMeasurementData | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(GUEST_MEASUREMENT_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored) as GuestMeasurementData;

    // 데이터 유효성 검사
    if (!data.season || !data.records || !Array.isArray(data.records)) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to load guest measurement:", error);
    return null;
  }
}

/**
 * 비로그인 유저의 측정 결과를 로컬 스토리지에서 삭제
 * 로그인 성공 시 호출
 */
export function clearGuestMeasurement(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(GUEST_MEASUREMENT_KEY);
  } catch (error) {
    console.error("Failed to clear guest measurement:", error);
  }
}

/**
 * 비로그인 유저의 측정 결과가 존재하는지 확인
 */
export function hasGuestMeasurement(): boolean {
  return loadGuestMeasurement() !== null;
}
