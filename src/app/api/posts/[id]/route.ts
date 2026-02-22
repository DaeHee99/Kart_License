import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { postService } from "@/lib/services/post.service";
import Post from "@/lib/db/models/post.model";
import { authenticateUser } from "@/lib/middleware/auth";
import { logService, LogActionType } from "@/lib/services/log.service";

/**
 * 게시글 상세 조회 API
 * GET /api/posts/[id]
 * 404 시 reason: "not_found" | "deleted" 로 구분 (클라이언트 메시지용)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // 인증 확인 (선택사항 - 로그인하지 않아도 게시글은 볼 수 있음)
    const authResult = await authenticateUser();
    const currentUserId = authResult.isAuth && authResult.user
      ? authResult.user._id.toString()
      : undefined;
    const includeDeleted = authResult.isAuth && authResult.user?.role === 1;

    const { id: postId } = await params;

    // 없음 vs 삭제됨 구분: 먼저 존재 여부만 확인
    const postMeta = await Post.findById(postId).select("deletedAt").lean();
    if (!postMeta) {
      return NextResponse.json(
        {
          success: false,
          error: "게시글을 찾을 수 없습니다.",
          reason: "not_found",
        },
        { status: 404 }
      );
    }
    const isDeleted = (postMeta as any).deletedAt != null;
    if (isDeleted && !includeDeleted) {
      return NextResponse.json(
        {
          success: false,
          error: "삭제된 게시글입니다.",
          reason: "deleted",
        },
        { status: 404 }
      );
    }

    const post = await postService.getPostById(postId, currentUserId, includeDeleted);
    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: "게시글을 찾을 수 없습니다.",
          reason: "not_found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: post,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Post fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "게시글 조회 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * 게시글 수정 API
 * PUT /api/posts/[id]
 */
export async function PUT(
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
    const userRole = authResult.user.role || 0;

    const updatedPost = await postService.updatePost(postId, userId, body, userRole);

    if (!updatedPost) {
      return NextResponse.json(
        {
          success: false,
          error: "게시글을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    // 게시글 수정 로그 생성
    await logService.createLog({
      userId,
      actionType: LogActionType.POST_EDIT,
      content: `게시글 수정 - ${postId}`,
      metadata: {
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
          postId: updatedPost._id.toString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Post update error:", error);

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
        error: "게시글 수정 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * 게시글 삭제 API
 * DELETE /api/posts/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: postId } = await params;

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

    const success = await postService.deletePost(postId, userId, userRole);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "게시글을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    // 게시글 삭제 로그 생성
    await logService.createLog({
      userId,
      actionType: LogActionType.POST_DELETE,
      content: `게시글 삭제 - ${postId}`,
      metadata: {
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
        message: "게시글이 삭제되었습니다.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Post deletion error:", error);

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
        error: "게시글 삭제 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
