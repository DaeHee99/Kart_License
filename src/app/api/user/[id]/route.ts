import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";
import connectDB from "@/lib/db/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "유저 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 특정 유저 정보 조회
    const result = await UserService.getUserById(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "유저를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("User detail API error:", error);
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
