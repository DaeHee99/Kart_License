import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { authenticateUser } from "@/lib/middleware/auth";
import Announcement from "@/lib/db/models/announcement.model";

/**
 * 관리자용 공지사항 전체 리스트 API
 * GET /api/admin/announcements
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

    // 공지사항 조회 (전체 - show 상관없이)
    const announcements = await Announcement.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Announcement.countDocuments();

    // 데이터 포맷팅
    const formattedAnnouncements = announcements.map((announcement: any) => ({
      _id: announcement._id.toString(),
      title: announcement.title,
      content: announcement.content,
      show: announcement.show,
      authorName: announcement.user?.name || "관리자",
      createdAt: announcement.createdAt,
      updatedAt: announcement.updatedAt,
    }));

    return NextResponse.json({
      announcements: formattedAnnouncements,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin announcements list error:", error);
    return NextResponse.json(
      { error: "공지사항 목록 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
