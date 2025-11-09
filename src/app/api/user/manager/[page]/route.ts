import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/middleware/auth";
import { UserService } from "@/lib/services/user.service";
import connectDB from "@/lib/db/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  try {
    await connectDB();

    const authResult = await authenticateUser();

    if (!authResult.isAuth || !authResult.user) {
      return NextResponse.json(
        { success: false, message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const { page } = await params;
    const pageNumber = parseInt(page, 10);

    if (isNaN(pageNumber) || pageNumber < 1) {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 페이지 번호입니다." },
        { status: 400 }
      );
    }

    // 페이지네이션 유저 조회
    const result = await UserService.getUsersByPage(pageNumber);

    return NextResponse.json(
      { success: true, count: result.count, userList: result.userList },
      { status: 200 }
    );
  } catch (error) {
    console.error("Manager page API error:", error);
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
