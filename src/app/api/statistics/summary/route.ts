import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/user.model";
import Record from "@/lib/db/models/record.model";

/**
 * 통계 요약 정보 조회 API
 * GET /api/statistics/summary?season=[season]
 *
 * 반환 데이터:
 * - totalUsers: 총 로그인 유저 수
 * - totalRecords: 누적 측정 횟수
 * - seasonRecords: 이번 시즌 측정 횟수
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const season = searchParams.get("season");

    if (!season) {
      return NextResponse.json(
        {
          success: false,
          message: "season 파라미터가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const currentSeason = parseInt(season);

    // 병렬로 데이터 조회
    const [totalUsers, totalRecords, seasonRecords] = await Promise.all([
      // 총 로그인 유저 수
      User.countDocuments(),

      // 누적 측정 횟수 (season > 0)
      Record.countDocuments({ season: { $gt: 0 } }),

      // 이번 시즌 측정 횟수
      Record.countDocuments({ season: currentSeason }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          totalUsers,
          totalRecords,
          seasonRecords,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Statistics summary fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "통계 요약 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
