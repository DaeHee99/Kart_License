import connectDB from "@/lib/db/mongodb";
import Log from "@/lib/db/models/log.model";
import User from "@/lib/db/models/user.model";
import mongoose from "mongoose";
import { LogActionType } from "./log-action-types";

// 기존 사용처의 호환성을 위해 동일 경로에서 enum을 re-export
export { LogActionType };

interface CreateLogParams {
  userId?: string | mongoose.Types.ObjectId; // Optional for non-logged-in users
  actionType: LogActionType | string;
  content: string;
  metadata?: {
    recordId?: string;
    postId?: string;
    commentId?: string;
    season?: number;
    tier?: string;
    ip?: string;
    userAgent?: string;
    [key: string]: unknown;
  };
}

class LogService {
  /**
   * Create a log entry
   * Handles both logged-in and non-logged-in users
   */
  async createLog({
    userId,
    actionType,
    content,
    metadata = {},
  }: CreateLogParams): Promise<void> {
    try {
      await connectDB();

      let nickname = "비로그인 유저";
      let profilePicture = "/profile/gyool_dizini.png";
      let userObjectId: mongoose.Types.ObjectId | undefined;

      // If userId is provided, fetch user details
      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          nickname = user.name;
          profilePicture = user.image || "/profile/gyool_dizini.png";
          userObjectId =
            typeof userId === "string"
              ? new mongoose.Types.ObjectId(userId)
              : userId;
        }
      }

      // Create log entry
      const log = new Log({
        user: userObjectId,
        nickname,
        profilePicture,
        actionType,
        content,
        metadata,
      });

      await log.save();
    } catch (error) {
      console.error("로그 저장 실패:", error);
      // Don't throw error to prevent logging from breaking the main flow
    }
  }

  /**
   * Get all logs (for admin page)
   */
  async getAllLogs(page = 1, limit = 50) {
    try {
      await connectDB();

      const skip = (page - 1) * limit;

      const logs = await Log.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Log.countDocuments();

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("로그 조회 실패:", error);
      throw new Error("로그를 불러오는데 실패했습니다.");
    }
  }

  /**
   * Get logs by user ID
   */
  async getLogsByUser(userId: string, page = 1, limit = 50) {
    try {
      await connectDB();

      const skip = (page - 1) * limit;

      const logs = await Log.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Log.countDocuments({ user: userId });

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("사용자 로그 조회 실패:", error);
      throw new Error("사용자 로그를 불러오는데 실패했습니다.");
    }
  }

  /**
   * Get logs by action type
   *
   * @param actionType 단일 액션 타입(string) 또는 다중 액션 타입(string[])
   *                   배열로 전달하면 $in 매칭으로 여러 타입을 한 번에 필터링한다.
   */
  async getLogsByActionType(
    actionType: LogActionType | string | Array<LogActionType | string>,
    page = 1,
    limit = 50,
  ) {
    try {
      await connectDB();

      const skip = (page - 1) * limit;

      const filter: Record<string, unknown> = Array.isArray(actionType)
        ? { actionType: { $in: actionType } }
        : { actionType };

      const logs = await Log.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Log.countDocuments(filter);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("액션 타입별 로그 조회 실패:", error);
      throw new Error("로그를 불러오는데 실패했습니다.");
    }
  }

  /**
   * Get log statistics
   */
  async getLogStatistics() {
    try {
      await connectDB();

      const totalLogs = await Log.countDocuments();

      const actionTypeCounts = await Log.aggregate([
        {
          $group: {
            _id: "$actionType",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

      const recentLogs = await Log.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      return {
        totalLogs,
        actionTypeCounts,
        recentLogs,
      };
    } catch (error) {
      console.error("로그 통계 조회 실패:", error);
      throw new Error("로그 통계를 불러오는데 실패했습니다.");
    }
  }
}

export const logService = new LogService();
