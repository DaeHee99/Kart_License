import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { feedbackService } from "@/lib/services/feedback.service";

/**
 * 특정 시즌 피드백 통계 조회 API
 * GET /api/feedback/statistics?season=[season]
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

    const statistics = await feedbackService.getFeedbackStatistics(
      parseInt(season)
    );

    return NextResponse.json(
      {
        success: true,
        data: statistics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Feedback statistics fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "피드백 통계 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
