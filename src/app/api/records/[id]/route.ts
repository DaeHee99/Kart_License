import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { recordService } from "@/lib/services/record.service";
import { authenticateUser } from "@/lib/middleware/auth";
import { logService } from "@/lib/services/log.service";
import { LogActionType } from "@/lib/services/log-action-types";

/**
 * 특정 기록 조회 API (결과 페이지용)
 * GET /api/records/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id: recordId } = await params;

    const record = await recordService.getRecordById(recordId);

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          message: "기록을 찾을 수 없습니다.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: record._id.toString(),
          user: record.user
            ? {
                _id: (record.user as any)._id?.toString(),
                name: (record.user as any).name,
                id: (record.user as any).id,
                image: (record.user as any).image,
                license: (record.user as any).license,
              }
            : null,
          season: record.season,
          records: record.records,
          tierDistribution: record.tierDistribution,
          finalTier: record.finalTier,
          createdAt: record.createdAt.toISOString(),
          updatedAt: record.updatedAt.toISOString(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Record fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "기록 조회 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}

/**
 * 측정 기록 삭제 API (마이페이지 측정 기록 탭 노출 제외용)
 * DELETE /api/records/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id: recordId } = await params;
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

    const userId = authResult.user._id.toString();
    const deletedRecord = await recordService.deleteUserRecordForMypage(
      recordId,
      userId,
    );

    if (!deletedRecord) {
      return NextResponse.json(
        {
          success: false,
          error: "기록을 찾을 수 없습니다.",
        },
        { status: 404 },
      );
    }

    await logService.createLog({
      userId,
      actionType: LogActionType.MEASUREMENT_DELETE,
      content: `측정 기록 삭제 - ${recordId}`,
      metadata: {
        recordId,
        season: deletedRecord.season,
        tier: deletedRecord.finalTier,
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
        message: "측정 기록이 삭제되었습니다.",
        data: {
          recordId: deletedRecord.recordId,
          deletedAt: deletedRecord.deletedAt,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Record deletion error:", error);

    if (error.message?.includes("권한이 없습니다")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "기록 삭제 중 오류가 발생했습니다.",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
