import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { authenticateUser } from "@/lib/middleware/auth";
import User from "@/lib/db/models/user.model";
import mongoose from "mongoose";

/**
 * 기존 유저의 lastAccess를 logs 컬렉션에서 backfill하는 마이그레이션 API
 * POST /api/admin/migrate-last-access
 * 한 번만 실행하면 됨
 */
export async function POST() {
  try {
    await connectDB();

    const authResult = await authenticateUser();
    if (!authResult.isAuth || authResult.user?.role !== 1) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json(
        { error: "DB 연결 실패" },
        { status: 500 },
      );
    }

    // lastAccess가 없는 유저들의 최근 로그를 조회하여 업데이트
    const usersWithoutAccess = await User.find({
      lastAccess: { $eq: null },
    }).select("_id");

    if (usersWithoutAccess.length === 0) {
      return NextResponse.json({
        message: "마이그레이션할 유저가 없습니다.",
        updated: 0,
      });
    }

    const userIds = usersWithoutAccess.map((u) => u._id);

    // logs 컬렉션에서 각 유저의 최신 로그 시간 조회
    const latestLogs = await db
      .collection("logs")
      .aggregate([
        { $match: { user: { $in: userIds } } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$user",
            lastAccess: { $first: "$createdAt" },
          },
        },
      ])
      .toArray();

    // bulk update
    if (latestLogs.length > 0) {
      const bulkOps = latestLogs.map((log) => ({
        updateOne: {
          filter: { _id: log._id },
          update: { $set: { lastAccess: log.lastAccess } },
        },
      }));

      await User.bulkWrite(bulkOps);
    }

    return NextResponse.json({
      message: "마이그레이션 완료",
      total: usersWithoutAccess.length,
      updated: latestLogs.length,
      noLogs: usersWithoutAccess.length - latestLogs.length,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "마이그레이션에 실패했습니다." },
      { status: 500 },
    );
  }
}
