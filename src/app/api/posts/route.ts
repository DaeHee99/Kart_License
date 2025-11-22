import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { postService } from "@/lib/services/post.service";
import { PostCategory } from "@/lib/db/models/post.model";
import { authenticateUser } from "@/lib/middleware/auth";
import { logService, LogActionType } from "@/lib/services/log.service";

/**
 * 게시글 목록 조회 API
 * GET /api/posts?page=1&limit=20&category=all&search=keyword
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // 인증 확인 (선택사항 - 로그인하지 않아도 게시글 목록은 볼 수 있음)
    const authResult = await authenticateUser();
    const currentUserId = authResult.isAuth && authResult.user
      ? authResult.user._id.toString()
      : undefined;

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category") as PostCategory | "all" | null;
    const searchQuery = searchParams.get("search") || undefined;

    const result = await postService.getPosts(
      page,
      limit,
      category === "all" ? undefined : (category || undefined),
      searchQuery,
      currentUserId
    );

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Posts fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "게시글 목록 조회 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * 게시글 생성 API
 * POST /api/posts
 */
export async function POST(request: NextRequest) {
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
    const body = await request.json();

    // 입력 검증
    if (!body.title || !body.content) {
      return NextResponse.json(
        {
          success: false,
          error: "제목과 내용은 필수입니다.",
        },
        { status: 400 }
      );
    }

    // 카테고리 검증
    const validCategories: PostCategory[] = ["notice", "general", "question"];
    if (body.category && !validCategories.includes(body.category)) {
      return NextResponse.json(
        {
          success: false,
          error: "유효하지 않은 카테고리입니다.",
        },
        { status: 400 }
      );
    }

    // 공지사항은 관리자만 작성 가능
    if (body.category === "notice" && authResult.user.role !== 1) {
      return NextResponse.json(
        {
          success: false,
          error: "공지사항은 관리자만 작성할 수 있습니다.",
        },
        { status: 403 }
      );
    }

    const post = await postService.createPost({
      userId,
      category: body.category || "general",
      title: body.title,
      content: body.content,
      images: body.images || [],
    });

    // 게시글 작성 로그 생성
    await logService.createLog({
      userId,
      actionType: LogActionType.POST_CREATE,
      content: `게시글 작성 - ${body.title} (카테고리: ${body.category || "general"})`,
      metadata: {
        postId: post._id.toString(),
        category: body.category || "general",
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
          _id: post._id.toString(),
          postId: post._id.toString(), // 하위 호환성
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Post creation error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "게시글 작성 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
