import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/middleware/auth";
import { UserService } from "@/lib/services/user.service";
import connectDB from "@/lib/db/mongodb";
import { logService, LogActionType } from "@/lib/services/log.service";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await authenticateUser();

    if (!authResult.isAuth || !authResult.user) {
      return NextResponse.json(
        { success: false, message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    // 로그아웃 처리 (토큰 제거)
    await UserService.logout(authResult.user._id.toString());

    // 로그아웃 로그 생성
    await logService.createLog({
      userId: authResult.user._id,
      actionType: LogActionType.LOGOUT,
      content: "로그아웃",
      metadata: {
        ip:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    // 쿠키 삭제
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
