import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/middleware/auth";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateUser();

    if (!authResult.isAuth || !authResult.user) {
      return NextResponse.json(
        { isAuth: false, message: authResult.message },
        { status: 200 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // 쿠키 갱신 (30일)
    const response = NextResponse.json(
      {
        _id: authResult.user._id,
        isAuth: true,
        name: authResult.user.name,
        image: authResult.user.image,
        license: authResult.user.license,
        role: authResult.user.role,
        isAdmin: authResult.user.role === 1,
      },
      { status: 200 }
    );

    if (token) {
      response.cookies.set("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30일
        path: "/",
        sameSite: "lax",
      });
    }

    return response;
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json({ isAuth: false, message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
