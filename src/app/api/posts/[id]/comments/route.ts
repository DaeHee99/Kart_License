import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { commentService } from "@/lib/services/comment.service";
import { authenticateUser } from "@/lib/middleware/auth";
import { logService, LogActionType } from "@/lib/services/log.service";

/**
 * 게시글의 댓글 목록 조회 API
 * GET /api/posts/[id]/comments
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: postId } = await params;

    const comments = await commentService.getCommentsByPostId(postId);

    return NextResponse.json(
      {
        success: true,
        data: comments,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Comments fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "댓글 목록 조회 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * 댓글 생성 API
 * POST /api/posts/[id]/comments
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: postId } = await params;
    const body = await request.json();

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

    // 입력 검증
    if (!body.content || !body.content.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "댓글 내용을 입력해주세요.",
        },
        { status: 400 }
      );
    }

    const comment = await commentService.createComment({
      postId,
      userId,
      content: body.content,
    });

    // 댓글 작성 로그 생성
    await logService.createLog({
      userId,
      actionType: LogActionType.COMMENT_CREATE,
      content: `댓글 작성 - 게시글 ${postId}`,
      metadata: {
        commentId: comment._id.toString(),
        postId,
        ip:
          request.headers.get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          commentId: comment._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Comment creation error:", error);

    if (error.message.includes("게시글을 찾을 수 없습니다")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "댓글 작성 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
