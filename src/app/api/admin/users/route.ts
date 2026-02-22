import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { authenticateUser } from "@/lib/middleware/auth";
import User from "@/lib/db/models/user.model";

/**
 * 관리자용 유저 리스트 API
 * GET /api/admin/users
 * 최근 접속 기준으로 정렬된 유저 목록 반환
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // 관리자 권한 확인
    const authResult = await authenticateUser();
    if (!authResult.isAuth || authResult.user?.role !== 1) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search")?.trim() || "";
    const skip = (page - 1) * limit;

    const matchStage = search
      ? { $match: { name: { $regex: search, $options: "i" } } }
      : null;

    const basePipeline = matchStage ? [matchStage] : [];

    const countPipeline = [...basePipeline, { $count: "total" }];
    const [countResult, users] = await Promise.all([
      User.aggregate(countPipeline),
      User.aggregate([
        ...basePipeline,
        {
          $addFields: {
            hasAccess: {
              $cond: [{ $gt: ["$lastAccess", null] }, 1, 0],
            },
          },
        },
        { $sort: { hasAccess: -1, lastAccess: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: { $toString: "$_id" },
            loginId: "$id",
            nickname: "$name",
            profileImage: {
              $ifNull: ["$image", "/profile/gyool_dizini.png"],
            },
            tier: "$license",
            lastAccess: 1,
            deletedAt: 1,
          },
        },
      ]),
    ]);

    const total = countResult[0]?.total ?? 0;

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin users list error:", error);
    return NextResponse.json(
      { error: "유저 목록 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
