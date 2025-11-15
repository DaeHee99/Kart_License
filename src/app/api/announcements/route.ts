import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Announcement from "@/lib/db/models/announcement.model";
import { authenticateUser, checkRole } from "@/lib/middleware/auth";

/**
 * 공지사항 조회 API
 * GET /api/announcements
 *
 * 반환 데이터:
 * - show:true인 공지사항 목록 (최신순)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // show:true인 공지사항만 조회 (최신순)
    const announcements = await Announcement.find({ show: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: announcements,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Announcements fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "공지사항 조회 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}

/**
 * 공지사항 등록 API
 * POST /api/announcements
 *
 * Request Body:
 * - title: 공지사항 제목
 * - content: 공지사항 내용
 * - show: 표시 여부 (선택, 기본값: true)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // 관리자 인증 확인
    const authResult = await authenticateUser();

    if (!authResult.isAuth || !authResult.user) {
      return NextResponse.json(
        {
          success: false,
          error: "로그인이 필요합니다.",
        },
        { status: 401 },
      );
    }

    // 관리자 권한 확인 (role >= 2)
    // if (!checkRole(authResult.user, 2)) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: "관리자 권한이 필요합니다.",
    //     },
    //     { status: 403 },
    //   );
    // }

    const body = await request.json();
    const { title, content, show = true } = body;

    // 유효성 검사
    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: "제목과 내용은 필수입니다.",
        },
        { status: 400 },
      );
    }

    // 기존에 show:true인 공지사항을 모두 show:false로 변경
    // (여러 개를 지원하려면 이 부분을 조건부로 처리)
    await Announcement.updateMany({ show: true }, { show: false });

    // 새 공지사항 생성
    const announcement = new Announcement({
      user: authResult.user._id,
      title,
      content,
      show,
    });

    await announcement.save();

    return NextResponse.json(
      {
        success: true,
        data: announcement,
        message: "공지사항이 등록되었습니다.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Announcement create error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "공지사항 등록 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
