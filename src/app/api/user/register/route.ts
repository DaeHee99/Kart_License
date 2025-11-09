import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";
import connectDB from "@/lib/db/mongodb";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, id, password, plainPassword, image } = body;

    // 필수 필드 검증
    if (!name || !id || !password) {
      return NextResponse.json(
        { success: false, message: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 회원가입 처리
    const result = await UserService.register({
      name,
      id,
      password,
      plainPassword: plainPassword || password,
      image,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json({ success: false, error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
