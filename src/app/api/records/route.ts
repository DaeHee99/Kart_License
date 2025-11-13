import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { recordService } from "@/lib/services/record.service";
import { SaveRecordRequest } from "@/lib/api/types";
import { Types } from "mongoose";

/**
 * 유저 기록 저장 API
 * POST /api/records
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: SaveRecordRequest = await request.json();

    // 요청 데이터 검증
    if (!body.season || !body.records || body.records.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "필수 데이터가 누락되었습니다.",
        },
        { status: 400 }
      );
    }

    // userId 유효성 검증
    if (body.userId && !Types.ObjectId.isValid(body.userId)) {
      return NextResponse.json(
        {
          success: false,
          error: "유효하지 않은 사용자 ID입니다.",
        },
        { status: 400 }
      );
    }

    // 서비스 레이어에서 비즈니스 로직 처리
    const result = await recordService.saveRecord({
      userId: body.userId,
      season: body.season,
      records: body.records,
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Record save error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "기록 저장 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
