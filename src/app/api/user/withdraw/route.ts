import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/middleware/auth";
import { UserService } from "@/lib/services/user.service";
import connectDB from "@/lib/db/mongodb";
import { logService, LogActionType } from "@/lib/services/log.service";

/**
 * 회원 탈퇴 (soft delete)
 * POST /api/user/withdraw
 * 인증 필요. 성공 시 deletedAt 설정, 토큰 제거, 쿠키 삭제
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await authenticateUser();

    if (!authResult.isAuth || !authResult.user) {
      return NextResponse.json(
        { success: false, message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const userId = authResult.user._id.toString();
    const result = await UserService.withdraw(userId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 200 }
      );
    }

    // 탈퇴 로그 생성
    await logService.createLog({
      userId: authResult.user._id,
      actionType: LogActionType.WITHDRAW,
      content: "회원 탈퇴",
    });

    // 쿠키 삭제 (자동 로그아웃)
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Withdraw API error:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
