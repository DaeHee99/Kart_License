import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { authenticateUser } from "@/lib/middleware/auth";
import User from "@/lib/db/models/user.model";

/**
 * 관리자용 유저 리스트 API
 * GET /api/admin/users
 * 최근 접속(로그) 기준으로 정렬된 유저 목록 반환
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
    const skip = (page - 1) * limit;

    const [total, users] = await Promise.all([
      User.countDocuments(),
      User.aggregate([
        {
          $project: {
            _id: 1,
            name: 1,
            image: 1,
            license: 1,
          },
        },
        {
          $lookup: {
            from: "logs",
            let: { userId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$user", "$$userId"] } } },
              { $sort: { createdAt: -1 } },
              { $limit: 1 },
              { $project: { createdAt: 1 } },
            ],
            as: "latestLog",
          },
        },
        {
          $addFields: {
            lastAccess: {
              $ifNull: [
                { $arrayElemAt: ["$latestLog.createdAt", 0] },
                null,
              ],
            },
            hasAccess: {
              $cond: [
                {
                  $gt: [
                    { $arrayElemAt: ["$latestLog.createdAt", 0] },
                    null,
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
        { $unset: "latestLog" },
        { $sort: { hasAccess: -1, lastAccess: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: { $toString: "$_id" },
            nickname: "$name",
            profileImage: {
              $ifNull: ["$image", "/profile/gyool_dizini.png"],
            },
            tier: "$license",
            lastAccess: 1,
            hasAccess: 1,
          },
        },
      ]),
    ]);

    // hasAccess 필드 제거 (정렬용으로만 사용)
    const cleanedUsers = users.map(
      ({ hasAccess, ...user }: { hasAccess: number; [key: string]: unknown }) =>
        user,
    );

    return NextResponse.json({
      users: cleanedUsers,
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
