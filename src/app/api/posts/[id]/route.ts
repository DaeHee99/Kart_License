import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { postService } from "@/lib/services/post.service";
import { authenticateUser } from "@/lib/middleware/auth";

/**
 * 게시글 상세 조회 API
 * GET /api/posts/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id: postId } = await params;

    const post = await postService.getPostById(postId);

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: "게시글을 찾을 수 없습니다.",
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

    const updatedPost = await postService.updatePost(postId, userId, body);

    if (!updatedPost) {
      return NextResponse.json(
        {
          success: false,
          error: "게시글을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

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
    const isAdmin = authResult.user.role === 1;

    const success = await postService.deletePost(postId, userId, isAdmin);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: "게시글을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

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
