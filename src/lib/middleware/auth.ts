import { cookies } from "next/headers";
import connectDB from "@/lib/db/mongodb";
import User, { UserDocument } from "@/lib/db/models/user.model";

export interface AuthResult {
  isAuth: boolean;
  user?: UserDocument;
  message?: string;
}

/**
 * 쿠키에서 토큰을 가져와 사용자 인증을 수행하는 헬퍼 함수
 * Next.js App Router API Route에서 사용
 */
export async function authenticateUser(): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { isAuth: false, message: "no Token" };
    }

    // MongoDB 연결
    await connectDB();

    // 토큰으로 사용자 찾기
    const user = await User.findByToken(token);

    if (!user) {
      return { isAuth: false, message: "인증 실패" };
    }

    // authCount 증가
    await User.updateOne({ _id: user._id }, { $inc: { authCount: 1 } });

    return { isAuth: true, user };
  } catch (error) {
    console.error("Authentication error:", error);
    return { isAuth: false, message: "인증 실패" };
  }
}

/**
 * 역할 기반 권한 확인 헬퍼 함수
 * @param user - 인증된 사용자
 * @param requiredRole - 필요한 최소 역할 (0: 일반, 1: 운영진, 2: 관리자)
 */
export function checkRole(user: UserDocument, requiredRole: number): boolean {
  return user.role >= requiredRole;
}
