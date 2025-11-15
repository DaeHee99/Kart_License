import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/user.model";
import { Types } from "mongoose";

/**
 * 특정 유저 정보 조회 API
 * GET /api/users/[id]
 *
 * 반환 데이터:
 * - _id: 유저 ID
 * - name: 유저 닉네임
 * - image: 프로필 이미지
 * - license: 면허 등급
 * - role: 권한 등급 (0: 일반, 1: 관리자, 2: 운영진)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "유효하지 않은 유저 ID입니다.",
        },
        { status: 400 }
      );
    }

    // 유저 정보 조회 (비밀번호 제외)
    const user = await User.findById(id)
      .select("_id name image license role createdAt")
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "해당 유저를 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "유저 정보 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
