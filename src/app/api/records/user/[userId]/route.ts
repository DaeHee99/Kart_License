import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { recordService } from "@/lib/services/record.service";
import { Types } from "mongoose";

/**
 * 특정 유저의 기록 목록 조회 API
 * GET /api/records/user/[userId]?season=35
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();

    const { userId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const season = searchParams.get("season");

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "유효하지 않은 유저 ID입니다.",
        },
        { status: 400 }
      );
    }

    const records = await recordService.getUserRecords(
      userId,
      season ? parseInt(season) : undefined
    );

    return NextResponse.json(
      {
        success: true,
        data: records,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("User records fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "유저 기록 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
