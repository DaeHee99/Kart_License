import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { recordService } from "@/lib/services/record.service";
import Record from "@/lib/db/models/record.model";
import { authenticateUser } from "@/lib/middleware/auth";

/**
 * 최근 기록 조회 API
 * GET /api/records/recent
 *
 * page 파라미터가 있으면 페이지네이션 모드 (어드민 측정 정보 탭)
 * page 파라미터가 없으면 기존 동작 (제한된 최근 기록만 반환)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (page) {
      const authResult = await authenticateUser();

      if (!authResult.isAuth || authResult.user?.role !== 1) {
        return NextResponse.json(
          { success: false, error: "관리자 권한이 필요합니다." },
          { status: 403 },
        );
      }

      const pageNum = parseInt(page);
      const skip = (pageNum - 1) * limit;

      const [records, total] = await Promise.all([
        Record.find({ season: { $gt: 0 } })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate("user", "name image")
          .lean(),
        Record.countDocuments({ season: { $gt: 0 } }),
      ]);

      const formattedRecords = records.map((record: any) => ({
        _id: record._id.toString(),
        userId: record.user?._id?.toString() || "",
        user: record.user
          ? { name: record.user.name, image: record.user.image }
          : undefined,
        season: record.season,
        finalTier: record.finalTier,
        tierDistribution: record.tierDistribution,
        createdAt: record.createdAt,
      }));

      return NextResponse.json({
        success: true,
        data: formattedRecords,
        pagination: {
          page: pageNum,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    // 기존 동작: 제한된 최근 기록만 반환
    const records = await recordService.getRecentRecords(limit);

    return NextResponse.json(
      {
        success: true,
        data: records,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Recent records fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "최근 기록 조회 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
