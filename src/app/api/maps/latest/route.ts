import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import MapData from "@/lib/db/models/map-data.model";

/**
 * 가장 최근 활성화된 맵 데이터 조회 API
 * GET /api/maps/latest
 */
export async function GET() {
  try {
    await connectDB();

    const mapData = await MapData.getLatestMapData();

    if (!mapData) {
      return NextResponse.json(
        {
          success: false,
          message: "맵 데이터가 존재하지 않습니다.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          season: mapData.season,
          maps: mapData.maps,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Map data fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "맵 데이터 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
