import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { recordService } from "@/lib/services/record.service";

/**
 * 특정 기록 조회 API (결과 페이지용)
 * GET /api/records/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
        { status: 404 }
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
      { status: 200 }
    );
  } catch (error) {
    console.error("Record fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "기록 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
