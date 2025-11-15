import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { feedbackService } from "@/lib/services/feedback.service";
import { logService, LogActionType } from "@/lib/services/log.service";

/**
 * 피드백 저장 API
 * POST /api/feedback
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, license, level, balance, review, season, recordId } = body;

    // 필수 필드 검증
    if (!userId || !license || !level || !balance || !season || !recordId) {
      return NextResponse.json(
        {
          success: false,
          message: "필수 필드가 누락되었습니다.",
        },
        { status: 400 }
      );
    }

    // 값 범위 검증
    if (level < 1 || level > 5 || balance < 1 || balance > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "잘못된 값입니다.",
        },
        { status: 400 }
      );
    }

    const result = await feedbackService.saveFeedback({
      userId,
      license,
      level,
      balance,
      review: review || "",
      season,
      recordId,
    });

    // 피드백 제출 로그 생성
    await logService.createLog({
      userId,
      actionType: LogActionType.FEEDBACK_SUBMIT,
      content: `피드백 제출 - 시즌 ${season} (난이도: ${level}, 밸런스: ${balance})`,
      metadata: {
        season,
        recordId,
        level,
        balance,
        ip:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "피드백이 저장되었습니다.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Feedback save error:", error);

    if (error.message === "이미 해당 시즌에 피드백을 작성하셨습니다.") {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "피드백 저장 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

/**
 * 유저의 특정 시즌 피드백 조회 API
 * GET /api/feedback?userId=[userId]&season=[season]
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const season = searchParams.get("season");

    if (!userId || !season) {
      return NextResponse.json(
        {
          success: false,
          message: "userId와 season 파라미터가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const feedback = await feedbackService.getUserFeedback(
      userId,
      parseInt(season)
    );

    return NextResponse.json(
      {
        success: true,
        data: feedback,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Feedback fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "피드백 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
