import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { postService } from "@/lib/services/post.service";
import { authenticateUser } from "@/lib/middleware/auth";

/**
 * 댓글 좋아요 토글 API
 * POST /api/comments/[id]/like
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // 인증 확인
    const authResult = await authenticateUser();

    if (!authResult.isAuth || !authResult.user) {
      return NextResponse.json(
        {
          success: false,
          error: "로그인이 필요합니다.",
        },
        { status: 401 }
      );
    }

    const userId = authResult.user._id.toString();
    const { id: commentId } = await params;

    const result = await postService.toggleCommentLike(commentId, userId);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Comment like toggle error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "좋아요 처리 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
