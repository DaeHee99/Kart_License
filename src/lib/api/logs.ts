/**
 * Frontend logging utility
 * 프론트엔드에서 사용자 행동 로그를 기록하기 위한 헬퍼 함수들
 */

export interface LogParams {
  actionType: string;
  content: string;
  metadata?: Record<string, unknown>;
}

/**
 * 로그 생성 API 호출
 * 프론트엔드에서 사용자 행동을 로깅할 때 사용
 */
export async function createLog(params: LogParams): Promise<void> {
  try {
    await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    // 로그 실패는 사용자 경험에 영향을 주지 않도록 에러를 무시
  } catch (error) {
    console.error("로그 생성 실패:", error);
    // 에러를 던지지 않음 - 로깅 실패가 메인 기능에 영향을 주지 않도록
  }
}

// 로그 액션 타입 상수
export const LogActionType = {
  // Share & Download (Frontend only)
  KAKAO_SHARE_RESULT: "KAKAO_SHARE_RESULT",
  KAKAO_SHARE_POST: "KAKAO_SHARE_POST",
  QR_DOWNLOAD_RESULT: "QR_DOWNLOAD_RESULT",
  QR_DOWNLOAD_POST: "QR_DOWNLOAD_POST",
  LINK_COPY_RESULT: "LINK_COPY_RESULT",
  LINK_COPY_POST: "LINK_COPY_POST",
  IMAGE_DOWNLOAD: "IMAGE_DOWNLOAD",
} as const;

export type LogActionTypeKeys = keyof typeof LogActionType;
