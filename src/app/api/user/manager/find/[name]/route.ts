import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/middleware/auth";
import { UserService } from "@/lib/services/user.service";
import connectDB from "@/lib/db/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
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

    const { name } = await params;

    if (!name) {
      return NextResponse.json(
        { success: false, message: "검색할 이름을 입력해주세요." },
        { status: 400 }
      );
    }

    // 유저 검색
    const result = await UserService.findUsersByName(name);

    return NextResponse.json(
      { success: true, count: result.count, userList: result.userList },
      { status: 200 }
    );
  } catch (error) {
    console.error("Manager find API error:", error);
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
