import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { authenticateUser } from "@/lib/middleware/auth";
import Announcement from "@/lib/db/models/announcement.model";

/**
 * 관리자용 공지사항 비활성화 API
 * PATCH /api/admin/announcements/[id]
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    // 관리자 권한 확인
    const authResult = await authenticateUser();
    if (!authResult.isAuth || authResult.user?.role !== 1) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { show } = body;

    if (typeof show !== "boolean") {
      return NextResponse.json(
        { error: "show 값은 boolean이어야 합니다." },
        { status: 400 },
      );
    }

    // 공지사항 업데이트
    const announcement = await Announcement.findByIdAndUpdate(
      id,
      { show },
      { new: true },
    );

    if (!announcement) {
      return NextResponse.json(
        { error: "공지사항을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      announcement: {
        _id: announcement._id.toString(),
        show: announcement.show,
      },
    });
  } catch (error) {
    console.error("Announcement update error:", error);
    return NextResponse.json(
      { error: "공지사항 업데이트에 실패했습니다." },
      { status: 500 },
    );
  }
}
