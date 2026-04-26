import { NextRequest, NextResponse } from "next/server";
import { logService } from "@/lib/services/log.service";
import { authenticateUser } from "@/lib/middleware/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { actionType, content, metadata } = body;

    if (!actionType || !content) {
      return NextResponse.json(
        { error: "actionType과 content는 필수입니다." },
        { status: 400 },
      );
    }

    // Check if user is authenticated (optional)
    const authResult = await authenticateUser();
    const userId = authResult.isAuth ? authResult.user?._id : undefined;

    // Get IP and User Agent for metadata
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create log
    await logService.createLog({
      userId,
      actionType,
      content,
      metadata: {
        ...metadata,
        ip,
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("로그 생성 실패:", error);
    return NextResponse.json(
      { error: "로그 생성에 실패했습니다." },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Only allow admin to view logs
    const authResult = await authenticateUser();

    if (!authResult.isAuth || authResult.user?.role !== 1) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const actionTypeParam = searchParams.get("actionType");
    const userId = searchParams.get("userId");

    // actionType은 콤마 구분으로 다중 전달 가능
    // 예) actionType=LOGIN,LOGOUT,REGISTER
    const actionTypes = actionTypeParam
      ? actionTypeParam
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    let result;

    if (userId) {
      result = await logService.getLogsByUser(userId, page, limit);
    } else if (actionTypes.length === 1) {
      result = await logService.getLogsByActionType(
        actionTypes[0],
        page,
        limit,
      );
    } else if (actionTypes.length > 1) {
      result = await logService.getLogsByActionType(actionTypes, page, limit);
    } else {
      result = await logService.getAllLogs(page, limit);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("로그 조회 실패:", error);
    return NextResponse.json(
      { error: "로그 조회에 실패했습니다." },
      { status: 500 },
    );
  }
}
