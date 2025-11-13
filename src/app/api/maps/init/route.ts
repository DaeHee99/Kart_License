import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import MapData from "@/lib/db/models/map-data.model";
import { authenticateUser } from "@/lib/middleware/auth";

/**
 * 맵 데이터 초기화 API (관리자 전용)
 * POST /api/maps/init
 *
 * Body: {
 *   season: number,
 *   maps: Array<{
 *     name: string,
 *     difficulty: "루키" | "L3" | "L2" | "L1",
 *     imageUrl: string,
 *     tierRecords: {
 *       elite: string,
 *       master: string,
 *       diamond: string,
 *       platinum: string,
 *       gold: string,
 *       silver: string,
 *       bronze: string
 *     }
 *   }>
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: 임시로 관리자 체크 비활성화 (테스트용)
    // const authResult = await authenticateUser();

    // if (!authResult.isAuth || !authResult.user) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "인증이 필요합니다.",
    //     },
    //     { status: 401 }
    //   );
    // }

    // // 관리자 권한 확인 (role === 1)
    // if (authResult.user.role !== 1) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "관리자 권한이 필요합니다.",
    //     },
    //     { status: 403 }
    //   );
    // }

    await connectDB();

    const body = await request.json();

    // 요청 데이터 검증
    if (!body.season || !body.maps || !Array.isArray(body.maps)) {
      return NextResponse.json(
        {
          success: false,
          error: "필수 데이터가 누락되었습니다.",
        },
        { status: 400 }
      );
    }

    // 맵 데이터 생성
    const mapData = new MapData({
      season: body.season,
      maps: body.maps,
      isActive: true,
    });

    await mapData.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          season: mapData.season,
          mapsCount: mapData.maps.length,
        },
        message: "맵 데이터가 성공적으로 저장되었습니다.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Map data initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "맵 데이터 초기화 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
