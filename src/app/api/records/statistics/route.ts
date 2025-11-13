import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { recordService } from "@/lib/services/record.service";

/**
 * 모든 기록 통계 조회 API
 * GET /api/records/statistics
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const statistics = await recordService.getAllRecordsStatistics();

    return NextResponse.json(
      {
        success: true,
        data: statistics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Statistics fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "통계 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
