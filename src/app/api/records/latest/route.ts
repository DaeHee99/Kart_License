import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { recordService } from "@/lib/services/record.service";
import { Types } from "mongoose";

/**
 * 유저의 가장 최근 기록 조회 API
 * GET /api/records/latest?userId={userId}
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "유저 ID가 필요합니다.",
        },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "유효하지 않은 유저 ID입니다.",
        },
        { status: 400 }
      );
    }

    const record = await recordService.getLatestRecordByUser(userId);

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          message: "기록이 존재하지 않습니다.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: record._id.toString(),
          user: record.user.toString(),
          season: record.season,
          records: record.records,
          tierDistribution: record.tierDistribution,
          finalTier: record.finalTier,
          createdAt: record.createdAt.toISOString(),
          updatedAt: record.updatedAt.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Latest record fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "최근 기록 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
