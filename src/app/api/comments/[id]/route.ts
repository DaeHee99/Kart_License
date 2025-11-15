import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { commentService } from "@/lib/services/comment.service";
import { authenticateUser } from "@/lib/middleware/auth";
import { logService, LogActionType } from "@/lib/services/log.service";

/**
 * 댓글 수정 API
 * PUT /api/comments/[id]
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: commentId } = await params;
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
    const userRole = authResult.user.role || 0;

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

    const updatedComment = await commentService.updateComment(
      commentId,
      userId,
      { content: body.content },
      userRole
    );

    if (!updatedComment) {
      return NextResponse.json(
        {
          success: false,
          error: "댓글을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    // 댓글 수정 로그 생성
    await logService.createLog({
      userId,
      actionType: LogActionType.COMMENT_EDIT,
      content: `댓글 수정 - ${commentId}`,
      metadata: {
        commentId,
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
          commentId: updatedComment._id.toString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Comment update error:", error);

    if (error.message.includes("권한이 없습니다")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "댓글 수정 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * 댓글 삭제 API
 * DELETE /api/comments/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: commentId } = await params;

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
    const userRole = authResult.user.role || 0;

    const success = await commentService.deleteComment(commentId, userId, userRole);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "댓글을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    // 댓글 삭제 로그 생성
    await logService.createLog({
      userId,
      actionType: LogActionType.COMMENT_DELETE,
      content: `댓글 삭제 - ${commentId}`,
      metadata: {
        commentId,
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
        message: "댓글이 삭제되었습니다.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Comment deletion error:", error);

    if (error.message.includes("권한이 없습니다")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "댓글 삭제 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
