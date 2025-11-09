/**
 * API 클라이언트
 * fetch wrapper with error handling
 */

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = "APIError";
  }
}

export async function apiClient<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      credentials: "include", // 쿠키 포함
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.message || data.error || "요청 처리 중 오류가 발생했습니다.",
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
    );
  }
}
