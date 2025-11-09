import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/middleware/auth";
import { UserService } from "@/lib/services/user.service";
import connectDB from "@/lib/db/mongodb";

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await authenticateUser();

    if (!authResult.isAuth || !authResult.user) {
      return NextResponse.json(
        { success: false, message: "인증이 필요합니다." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, password, image } = body;

    // 최소 하나의 필드는 있어야 함
    if (!name && !password && image === undefined) {
      return NextResponse.json(
        { success: false, message: "변경할 정보를 입력해주세요." },
        { status: 400 }
      );
    }

    // 유저 정보 수정
    const result = await UserService.updateProfile(authResult.user._id.toString(), {
      name,
      password,
      image,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Update profile API error:", error);
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
