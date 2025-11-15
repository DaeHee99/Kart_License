import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { authenticateUser } from "@/lib/middleware/auth";
import User from "@/lib/db/models/user.model";
import Log from "@/lib/db/models/log.model";

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

    // 모든 유저 조회
    const users = await User.find().select("_id name image license").lean();

    // 각 유저의 최근 로그 시간 조회
    const usersWithLastAccess = await Promise.all(
      users.map(async (user) => {
        const latestLog = (await Log.findOne({ user: user._id })
          .sort({ createdAt: -1 })
          .select("createdAt")
          .lean()) as { createdAt: Date } | null;

        return {
          _id: user._id.toString(),
          nickname: user.name,
          profileImage: user.image || "/profile/gyool_dizini.png",
          tier: user.license,
          lastAccess: latestLog?.createdAt || null,
        };
      }),
    );

    // 최근 접속 기준으로 정렬 (null은 맨 뒤로)
    usersWithLastAccess.sort((a, b) => {
      if (!a.lastAccess) return 1;
      if (!b.lastAccess) return -1;
      return (
        new Date(b.lastAccess).getTime() - new Date(a.lastAccess).getTime()
      );
    });

    // 페이지네이션 적용
    const paginatedUsers = usersWithLastAccess.slice(skip, skip + limit);
    const total = usersWithLastAccess.length;

    return NextResponse.json({
      users: paginatedUsers,
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
