import mongoose, { Model, Schema, Types } from "mongoose";

/**
 * 피드백 인터페이스
 */
export interface IFeedback {
  _id: Types.ObjectId;
  user: Types.ObjectId; // User 참조
  license: string; // 본인의 군 (강주력, 주력, 1군, 2군, 3군, 4군, 일반)
  level: number; // 난이도 (1: 매우 쉬움, 2: 쉬움, 3: 보통, 4: 어려움, 5: 매우 어려움)
  balance: number; // 밸런스 (1: 매우 좋음, 2: 좋음, 3: 보통, 4: 나쁨, 5: 매우 나쁨)
  review: string; // 그 외 의견
  season: number; // 시즌
  recordId: string; // 기록 ID
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 피드백 모델 인터페이스
 */
interface IFeedbackModel extends Model<IFeedback> {
  getFeedbackBySeason(season: number): Promise<IFeedback[]>;
  getUserFeedbackBySeason(userId: string, season: number): Promise<IFeedback | null>;
}

const feedbackSchema = new Schema<IFeedback, IFeedbackModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    license: {
      type: String,
      enum: ["강주력", "주력", "1군", "2군", "3군", "4군", "일반"],
      required: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    balance: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      default: "",
    },
    season: {
      type: Number,
      required: true,
      index: true,
    },
    recordId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 복합 인덱스: 유저별 시즌별 피드백 조회 최적화
feedbackSchema.index({ user: 1, season: 1 });

// 시즌별 피드백 조회
feedbackSchema.statics.getFeedbackBySeason = async function (season: number) {
  return await this.find({ season })
    .sort({ createdAt: -1 })
    .populate("user", "name image");
};

// 유저의 특정 시즌 피드백 조회
feedbackSchema.statics.getUserFeedbackBySeason = async function (
  userId: string,
  season: number
) {
  return await this.findOne({
    user: new Types.ObjectId(userId),
    season,
  });
};

// 모델이 이미 존재하는지 확인 (Next.js 개발 환경에서 핫 리로드 대응)
const Feedback =
  (mongoose.models.Feedback as IFeedbackModel) ||
  mongoose.model<IFeedback, IFeedbackModel>("Feedback", feedbackSchema);

export default Feedback;
