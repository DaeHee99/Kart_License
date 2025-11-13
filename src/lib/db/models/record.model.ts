import mongoose, { Model, Schema, Types } from "mongoose";

/**
 * 유저 맵 기록 인터페이스
 */
export interface IUserMapRecord {
  mapName: string; // 맵 이름
  difficulty: "루키" | "L3" | "L2" | "L1"; // 맵 난이도
  record: string; // 유저 기록 (MM:SS:mm 형식, 이상 기록의 경우 'MM:SS:mm +' 형식)
  tier: "elite" | "master" | "diamond" | "platinum" | "gold" | "silver" | "bronze"; // 선택한 티어
}

/**
 * 유저 기록 인터페이스
 */
export interface IRecord {
  _id: Types.ObjectId;
  user: Types.ObjectId; // User 참조
  season: number; // 시즌 정보
  records: IUserMapRecord[]; // 유저 맵 기록 배열
  tierDistribution: {
    elite: number;
    master: number;
    diamond: number;
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
  }; // 티어별 분포
  finalTier: string; // 최종 군 (강주력, 주력, 1군, 2군, 3군, 4군, 일반)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 유저 기록 모델 인터페이스
 */
interface IRecordModel extends Model<IRecord> {
  getLatestRecordByUser(userId: string): Promise<IRecord | null>;
  getRecordsByUser(userId: string, season?: number): Promise<IRecord[]>;
}

const userMapRecordSchema = new Schema<IUserMapRecord>(
  {
    mapName: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["루키", "L3", "L2", "L1"],
      required: true,
    },
    record: {
      type: String,
      required: true,
      match: /^\d{2}:\d{2}:\d{2}( \+)?$/, // MM:SS:mm 형식 검증 (선택적으로 ' +' 허용)
    },
    tier: {
      type: String,
      enum: ["elite", "master", "diamond", "platinum", "gold", "silver", "bronze"],
      required: true,
    },
  },
  { _id: false }
);

const recordSchema = new Schema<IRecord, IRecordModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    season: {
      type: Number,
      required: true,
      index: true,
    },
    records: {
      type: [userMapRecordSchema],
      required: true,
      validate: {
        validator: function (records: IUserMapRecord[]) {
          return records.length > 0;
        },
        message: "기록은 최소 1개 이상이어야 합니다.",
      },
    },
    tierDistribution: {
      elite: { type: Number, default: 0, min: 0 },
      master: { type: Number, default: 0, min: 0 },
      diamond: { type: Number, default: 0, min: 0 },
      platinum: { type: Number, default: 0, min: 0 },
      gold: { type: Number, default: 0, min: 0 },
      silver: { type: Number, default: 0, min: 0 },
      bronze: { type: Number, default: 0, min: 0 },
    },
    finalTier: {
      type: String,
      required: false,
      enum: ["강주력", "주력", "1군", "2군", "3군", "4군", "일반"],
      default: "일반",
    },
  },
  { timestamps: true }
);

// 인덱스 설정: 유저별 최신 기록 조회 최적화
recordSchema.index({ user: 1, createdAt: -1 });
recordSchema.index({ user: 1, season: 1, createdAt: -1 });

// 저장 전 최종 티어 계산
recordSchema.pre("save", function (next) {
  const record = this;

  // 티어별 개수 계산
  const tierCounts = {
    elite: 0,
    master: 0,
    diamond: 0,
    platinum: 0,
    gold: 0,
    silver: 0,
    bronze: 0,
  };

  record.records.forEach((mapRecord) => {
    tierCounts[mapRecord.tier]++;
  });

  record.tierDistribution = tierCounts;

  // 최종 군 계산 (as-is 로직과 동일)
  // 누적 합계가 20개 이상이 되는 첫 번째 티어를 최종 군으로 결정
  const tierOrder = ["elite", "master", "diamond", "platinum", "gold", "silver"] as const;
  let cumulativeCount = 0;
  let finalTier = "일반";

  for (let i = 0; i < tierOrder.length; i++) {
    const tierKey = tierOrder[i];
    cumulativeCount += tierCounts[tierKey];

    if (cumulativeCount >= 20) {
      if (i === 0) finalTier = "강주력";
      else if (i === 1) finalTier = "주력";
      else if (i === 2) finalTier = "1군";
      else if (i === 3) finalTier = "2군";
      else if (i === 4) finalTier = "3군";
      else if (i === 5) finalTier = "4군";
      break;
    }
  }

  record.finalTier = finalTier;
  next();
});

// 저장 후 유저의 license 업데이트
recordSchema.post("save", async function (doc) {
  try {
    const User = mongoose.model("User");
    await User.findByIdAndUpdate(doc.user, { license: doc.finalTier });
  } catch (err) {
    console.error("Failed to update user license:", err);
  }
});

// 유저의 가장 최근 기록 조회
recordSchema.statics.getLatestRecordByUser = async function (userId: string) {
  return await this.findOne({
    user: new Types.ObjectId(userId),
    season: { $gt: 0 },
  })
    .sort({ createdAt: -1 })
    .limit(1);
};

// 유저의 기록 목록 조회 (시즌별 필터링 가능)
recordSchema.statics.getRecordsByUser = async function (
  userId: string,
  season?: number
) {
  const query: any = {
    user: new Types.ObjectId(userId),
    season: { $gt: 0 },
  };

  if (season) {
    query.season = season;
  }

  return await this.find(query).sort({ createdAt: -1 });
};

// 모델이 이미 존재하는지 확인 (Next.js 개발 환경에서 핫 리로드 대응)
const Record =
  (mongoose.models.Record as IRecordModel) ||
  mongoose.model<IRecord, IRecordModel>("Record", recordSchema);

export default Record;
