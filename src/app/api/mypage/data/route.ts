import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Record from "@/lib/db/models/record.model";
import { Types } from "mongoose";

/**
 * 마이페이지 데이터 조회 API
 * GET /api/mypage/data?userId=[userId]
 *
 * 반환 데이터:
 * - latestRecord: 최근 기록 정보 (시즌, 티어, 날짜/시간)
 * - tierHistory: 군 변화 그래프 데이터
 * - seasonRecords: 시즌별 최고 기록
 * - measurementHistory: 측정 기록 목록
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "유효하지 않은 유저 ID입니다.",
        },
        { status: 400 }
      );
    }

    // 유저의 모든 기록 조회 (최신순)
    const records = await Record.find({
      user: new Types.ObjectId(userId),
      season: { $gt: 0 },
    })
      .sort({ createdAt: -1 })
      .lean();

    // 기록이 없는 경우
    if (!records || records.length === 0) {
      return NextResponse.json(
        {
          success: true,
          data: {
            latestRecord: null,
            tierHistory: [],
            seasonRecords: [],
            measurementHistory: [],
          },
        },
        { status: 200 }
      );
    }

    // 티어 순서 (숫자로 변환)
    const tierToValue = (tier: string): number => {
      const tierMap: Record<string, number> = {
        강주력: 7,
        주력: 6,
        "1군": 5,
        "2군": 4,
        "3군": 3,
        "4군": 2,
        일반: 1,
      };
      return tierMap[tier] || 0;
    };

    // 티어 한글명을 영문 TierType으로 변환
    const tierKoToEn = (tierKo: string): string => {
      const tierMap: Record<string, string> = {
        강주력: "elite",
        주력: "master",
        "1군": "diamond",
        "2군": "platinum",
        "3군": "gold",
        "4군": "silver",
        일반: "bronze",
      };
      return tierMap[tierKo] || "bronze";
    };

    // 1. 최근 기록 정보
    const latestRecord = {
      season: records[0].season,
      tier: records[0].finalTier,
      tierEn: tierKoToEn(records[0].finalTier),
      createdAt: records[0].createdAt,
    };

    // 2. 군 변화 그래프 데이터 (모든 측정 기록)
    const tierHistory = records
      .slice()
      .reverse()
      .map((record) => {
        const date = new Date(record.createdAt);
        const formattedDate = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;

        return {
          date: formattedDate,
          tier: record.finalTier,
          value: tierToValue(record.finalTier),
        };
      });

    // 3. 시즌별 최고 기록
    // 시즌별로 그룹화하여 가장 높은 티어를 찾음
    const seasonMap = new Map<number, { tier: string; value: number; recordId: string; createdAt: Date }>();

    records.forEach((record) => {
      const currentValue = tierToValue(record.finalTier);
      const existing = seasonMap.get(record.season);

      if (!existing || currentValue > existing.value) {
        seasonMap.set(record.season, {
          tier: record.finalTier,
          value: currentValue,
          recordId: record._id.toString(),
          createdAt: record.createdAt,
        });
      }
    });

    // 시즌 번호 내림차순으로 정렬
    const seasonRecords = Array.from(seasonMap.entries())
      .map(([season, data]) => ({
        season: `S${season}`,
        tier: data.tier,
        tierEn: tierKoToEn(data.tier),
        value: data.value,
        recordId: data.recordId,
        createdAt: data.createdAt,
      }))
      .sort((a, b) => {
        const seasonA = parseInt(a.season.replace("S", ""));
        const seasonB = parseInt(b.season.replace("S", ""));
        return seasonB - seasonA;
      });

    // 4. 측정 기록 목록 (최신순)
    const measurementHistory = records.map((record) => ({
      id: record._id.toString(),
      season: `S${record.season}`,
      tier: record.finalTier,
      tierEn: tierKoToEn(record.finalTier),
      maps: record.records.length,
      createdAt: record.createdAt,
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          latestRecord,
          tierHistory,
          seasonRecords,
          measurementHistory,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Mypage data fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "마이페이지 데이터 조회 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
