import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { recordService } from "@/lib/services/record.service";

/**
 * 최근 기록 조회 API
 * GET /api/records/recent
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");

    const records = await recordService.getRecentRecords(limit);

    return NextResponse.json(
      {
        success: true,
        data: records,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Recent records fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "최근 기록 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
