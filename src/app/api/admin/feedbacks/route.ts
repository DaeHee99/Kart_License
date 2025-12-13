import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { authenticateUser } from "@/lib/middleware/auth";
import Feedback from "@/lib/db/models/feedback.model";

/**
 * 관리자용 피드백 전체 리스트 API
 * GET /api/admin/feedbacks
 * 최신순으로 정렬된 모든 피드백 반환
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // 관리자(1) 또는 운영진(2) 권한 확인
    const authResult = await authenticateUser();
    const userRole = authResult.user?.role ?? 0;
    if (!authResult.isAuth || userRole < 1) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // 피드백 조회 (유저 정보 populate)
    const feedbacks = await Feedback.find()
      .populate("user", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Feedback.countDocuments();

    // 데이터 포맷팅
    const formattedFeedbacks = feedbacks.map((feedback: any) => ({
      _id: feedback._id.toString(),
      userNickname: feedback.user?.name || "알 수 없음",
      userProfileImage: feedback.user?.image || "/profile/gyool_dizini.png",
      season: feedback.season,
      license: feedback.license,
      level: feedback.level,
      balance: feedback.balance,
      review: feedback.review || "",
      recordId: feedback.recordId || null,
      createdAt: feedback.createdAt,
    }));

    return NextResponse.json({
      feedbacks: formattedFeedbacks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin feedbacks list error:", error);
    return NextResponse.json(
      { error: "피드백 목록 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
