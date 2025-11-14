/**
 * Feedback Service Layer
 * 비즈니스 로직을 처리합니다.
 */

import Feedback from "@/lib/db/models/feedback.model";
import User from "@/lib/db/models/user.model";
import { Types } from "mongoose";
import type { IFeedback } from "@/lib/db/models/feedback.model";

export interface SaveFeedbackInput {
  userId: string;
  license: string;
  level: number;
  balance: number;
  review: string;
  season: number;
  recordId: string;
}

export interface FeedbackStatistics {
  levelStats: {
    1: number; // 매우 쉬움
    2: number; // 쉬움
    3: number; // 보통
    4: number; // 어려움
    5: number; // 매우 어려움
  };
  balanceStats: {
    1: number; // 매우 좋음
    2: number; // 좋음
    3: number; // 보통
    4: number; // 나쁨
    5: number; // 매우 나쁨
  };
  totalCount: number;
  latestUpdate: Date | null;
}

/**
 * 피드백 서비스 클래스
 */
export class FeedbackService {
  /**
   * 피드백 저장
   */
  async saveFeedback(input: SaveFeedbackInput): Promise<{ success: boolean }> {
    if (!Types.ObjectId.isValid(input.userId)) {
      throw new Error("유효하지 않은 유저 ID입니다.");
    }

    // 이미 해당 시즌에 피드백을 작성했는지 확인
    const existingFeedback = await Feedback.getUserFeedbackBySeason(
      input.userId,
      input.season
    );

    if (existingFeedback) {
      throw new Error("이미 해당 시즌에 피드백을 작성하셨습니다.");
    }

    const feedback = new Feedback({
      user: new Types.ObjectId(input.userId),
      license: input.license,
      level: input.level,
      balance: input.balance,
      review: input.review || "",
      season: input.season,
      recordId: input.recordId,
    });

    await feedback.save();

    // 유저의 recentSurvey 업데이트
    await User.findByIdAndUpdate(input.userId, {
      recentSurvey: input.season,
    });

    return { success: true };
  }

  /**
   * 특정 시즌의 피드백 통계 조회
   */
  async getFeedbackStatistics(
    season: number
  ): Promise<FeedbackStatistics> {
    const feedbacks = await Feedback.find({ season }).lean();

    const levelStats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const balanceStats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let latestUpdate: Date | null = null;

    feedbacks.forEach((feedback: any) => {
      levelStats[feedback.level as keyof typeof levelStats]++;
      balanceStats[feedback.balance as keyof typeof balanceStats]++;

      if (!latestUpdate || feedback.createdAt > latestUpdate) {
        latestUpdate = feedback.createdAt;
      }
    });

    return {
      levelStats,
      balanceStats,
      totalCount: feedbacks.length,
      latestUpdate,
    };
  }

  /**
   * 유저의 특정 시즌 피드백 조회
   */
  async getUserFeedback(
    userId: string,
    season: number
  ): Promise<IFeedback | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }

    return await Feedback.getUserFeedbackBySeason(userId, season);
  }

  /**
   * 모든 피드백 조회 (관리자용)
   */
  async getAllFeedbacks(): Promise<IFeedback[]> {
    return await Feedback.find()
      .sort({ createdAt: -1 })
      .populate("user", "name image")
      .lean();
  }

  /**
   * 페이지네이션된 피드백 조회 (관리자용)
   */
  async getFeedbacksWithPagination(
    page: number
  ): Promise<{ feedbacks: IFeedback[]; count: number }> {
    const limit = 20;
    const skip = limit * (page - 1);

    const [feedbacks, count] = await Promise.all([
      Feedback.find()
        .sort({ createdAt: -1 })
        .populate("user", "name image")
        .limit(limit)
        .skip(skip)
        .lean(),
      Feedback.countDocuments(),
    ]);

    return { feedbacks: feedbacks as IFeedback[], count };
  }
}

// Singleton 인스턴스 export
export const feedbackService = new FeedbackService();
