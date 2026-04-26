import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongodb";
import { authenticateUser } from "@/lib/middleware/auth";
import User from "@/lib/db/models/user.model";
import { logService, LogActionType } from "@/lib/services/log.service";

/**
 * 관리자용 유저 비밀번호 초기화 API
 * POST /api/admin/users/[userId]/reset-password
 *
 * 관리자가 대상 유저의 비밀번호를 기본값("1234")으로 초기화한다.
 * 사용자가 마이페이지에서 비밀번호를 변경하는 흐름과 동일하게
 * User 모델의 pre('save') 훅에서 bcrypt 해싱이 자동 적용된다.
 */
const DEFAULT_PASSWORD = "1234";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    await connectDB();

    // 관리자 권한 확인
    const authResult = await authenticateUser();
    if (!authResult.isAuth || authResult.user?.role !== 1) {
      return NextResponse.json(
        { success: false, message: "권한이 없습니다." },
        { status: 403 },
      );
    }

    const { userId } = await params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "잘못된 유저 ID입니다." },
        { status: 400 },
      );
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 비밀번호 변경 - pre('save') 훅이 bcrypt 해싱을 처리한다.
    targetUser.password = DEFAULT_PASSWORD;
    targetUser.plainPassword = DEFAULT_PASSWORD;
    await targetUser.save();

    // 추적용 로그 (관리자에 의한 초기화임을 명시)
    await logService.createLog({
      userId: targetUser._id,
      actionType: LogActionType.ADMIN_PASSWORD_RESET,
      content: `관리자가 비밀번호를 초기화했습니다. (대상: ${targetUser.name} / ${targetUser.id})`,
      metadata: {
        adminId: authResult.user._id.toString(),
        adminNickname: authResult.user.name,
        targetLoginId: targetUser.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "비밀번호가 1234로 초기화되었습니다.",
    });
  } catch (error) {
    console.error("Admin reset password error:", error);
    return NextResponse.json(
      { success: false, message: "비밀번호 초기화에 실패했습니다." },
      { status: 500 },
    );
  }
}
