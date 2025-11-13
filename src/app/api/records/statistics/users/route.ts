import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { recordService } from "@/lib/services/record.service";

/**
 * 모든 유저 군 분포 통계 조회 API
 * GET /api/records/statistics/users
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const statistics = await recordService.getAllUserLicenseStatistics();

    return NextResponse.json(
      {
        success: true,
        data: statistics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("User license statistics fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "유저 군 분포 통계 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
