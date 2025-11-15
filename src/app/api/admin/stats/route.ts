import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { authenticateUser } from "@/lib/middleware/auth";
import User from "@/lib/db/models/user.model";
import Record from "@/lib/db/models/record.model";
import Feedback from "@/lib/db/models/feedback.model";
import Log from "@/lib/db/models/log.model";

/**
 * 관리자용 통계 API
 * GET /api/admin/stats
 * 전체 유저 수, 측정 수, 피드백 수, 로그 수 반환
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // 관리자 권한 확인
    const authResult = await authenticateUser();
    if (!authResult.isAuth || authResult.user?.role !== 1) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    // 병렬로 통계 데이터 조회
    const [totalUsers, totalMeasurements, totalFeedbacks, totalLogs] =
      await Promise.all([
        User.countDocuments(),
        Record.countDocuments(),
        Feedback.countDocuments(),
        Log.countDocuments(),
      ]);

    return NextResponse.json({
      totalUsers,
      totalMeasurements,
      totalFeedbacks,
      totalLogs,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "통계 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
