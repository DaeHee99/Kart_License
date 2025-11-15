import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";
import connectDB from "@/lib/db/mongodb";
import { logService, LogActionType } from "@/lib/services/log.service";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { id, password } = body;

    // 필수 필드 검증
    if (!id || !password) {
      return NextResponse.json(
        { success: false, message: "아이디와 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    // 로그인 처리
    const result = await UserService.login({ id, password });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 200 }
      );
    }

    // 로그인 성공 시 토큰을 HTTP-only 쿠키에 설정
    const response = NextResponse.json(
      {
        success: true,
        userId: result.user?._id,
        name: result.user?.name,
      },
      { status: 200 }
    );

    // 쿠키 설정 (30일)
    response.cookies.set("token", result.token!, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30일
      path: "/",
      sameSite: "lax",
    });

    // 로그인 로그 생성
    await logService.createLog({
      userId: result.user?._id,
      actionType: LogActionType.LOGIN,
      content: "로그인",
      metadata: {
        ip:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
