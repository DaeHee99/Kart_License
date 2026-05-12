import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/middleware/auth";
import { UserService } from "@/lib/services/user.service";
import connectDB from "@/lib/db/mongodb";

export async function GET() {
  try {
    await connectDB();

    const authResult = await authenticateUser();

    if (!authResult.isAuth || !authResult.user) {
      return NextResponse.json(
        { success: false, message: "인증이 필요합니다." },
        { status: 401 },
      );
    }

    if (authResult.user.role !== 1) {
      return NextResponse.json(
        { success: false, message: "관리자 권한이 필요합니다." },
        { status: 403 },
      );
    }

    // 모든 유저 조회
    const userList = await UserService.getAllUsers();

    return NextResponse.json({ success: true, userList }, { status: 200 });
  } catch (error) {
    console.error("Manager all API error:", error);
    return NextResponse.json(
      { success: false, error: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
