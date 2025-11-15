import connectDB from "@/lib/db/mongodb";
import Log from "@/lib/db/models/log.model";
import User from "@/lib/db/models/user.model";
import mongoose from "mongoose";

export enum LogActionType {
  // Authentication
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  REGISTER = "REGISTER",

  // Measurement
  MEASUREMENT_COMPLETE = "MEASUREMENT_COMPLETE",

  // Community Posts
  POST_CREATE = "POST_CREATE",
  POST_EDIT = "POST_EDIT",
  POST_DELETE = "POST_DELETE",

  // Community Comments
  COMMENT_CREATE = "COMMENT_CREATE",
  COMMENT_EDIT = "COMMENT_EDIT",
  COMMENT_DELETE = "COMMENT_DELETE",

  // Share & Download
  KAKAO_SHARE_RESULT = "KAKAO_SHARE_RESULT",
  KAKAO_SHARE_POST = "KAKAO_SHARE_POST",
  QR_DOWNLOAD_RESULT = "QR_DOWNLOAD_RESULT",
  QR_DOWNLOAD_POST = "QR_DOWNLOAD_POST",
  LINK_COPY_RESULT = "LINK_COPY_RESULT",
  LINK_COPY_POST = "LINK_COPY_POST",
  IMAGE_DOWNLOAD = "IMAGE_DOWNLOAD",

  // User Profile
  NICKNAME_UPDATE = "NICKNAME_UPDATE",
  PASSWORD_UPDATE = "PASSWORD_UPDATE",
  PROFILE_PICTURE_UPDATE = "PROFILE_PICTURE_UPDATE",

  // Feedback
  FEEDBACK_SUBMIT = "FEEDBACK_SUBMIT",
}

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
   */
  async getLogsByActionType(
    actionType: LogActionType | string,
    page = 1,
    limit = 50,
  ) {
    try {
      await connectDB();

      const skip = (page - 1) * limit;

      const logs = await Log.find({ actionType })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Log.countDocuments({ actionType });

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
