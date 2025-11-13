import mongoose, { Model, Schema } from "mongoose";

/**
 * 맵 데이터 인터페이스
 */
export interface IMapRecord {
  name: string;
  difficulty: "루키" | "L3" | "L2" | "L1";
  imageUrl: string;
  tierRecords: {
    elite: string; // 강주력
    master: string; // 주력
    diamond: string; // 1군
    platinum: string; // 2군
    gold: string; // 3군
    silver: string; // 4군
    bronze: string; // 일반
  };
}

/**
 * 맵 데이터 컬렉션 인터페이스
 * 여러 시즌의 맵 데이터를 관리하기 위한 컬렉션
 */
export interface IMapData {
  season: number; // 시즌 정보 (35, 36, ...)
  maps: IMapRecord[]; // 맵 배열
  isActive: boolean; // 활성화 여부 (가장 최근 데이터만 true)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 맵 데이터 모델 인터페이스
 */
interface IMapDataModel extends Model<IMapData> {
  getLatestMapData(): Promise<IMapData | null>;
}

const mapRecordSchema = new Schema<IMapRecord>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["루키", "L3", "L2", "L1"],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    tierRecords: {
      elite: { type: String, required: true },
      master: { type: String, required: true },
      diamond: { type: String, required: true },
      platinum: { type: String, required: true },
      gold: { type: String, required: true },
      silver: { type: String, required: true },
      bronze: { type: String, required: true },
    },
  },
  { _id: false }
);

const mapDataSchema = new Schema<IMapData, IMapDataModel>(
  {
    season: {
      type: Number,
      required: true,
      index: true,
    },
    maps: {
      type: [mapRecordSchema],
      required: true,
      validate: {
        validator: function (maps: IMapRecord[]) {
          return maps.length > 0;
        },
        message: "맵 데이터는 최소 1개 이상이어야 합니다.",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// 인덱스 설정: 활성화된 최신 데이터 조회 최적화
mapDataSchema.index({ isActive: 1, createdAt: -1 });

// 새 맵 데이터 저장 시 기존 활성 데이터 비활성화
mapDataSchema.pre("save", async function (next) {
  if (this.isNew && this.isActive) {
    try {
      await mongoose.model<IMapData>("MapData").updateMany(
        { isActive: true },
        { $set: { isActive: false } }
      );
      next();
    } catch (err) {
      next(err as Error);
    }
  } else {
    next();
  }
});

// 가장 최근 활성화된 맵 데이터 조회
mapDataSchema.statics.getLatestMapData = async function () {
  return await this.findOne({ isActive: true }).sort({ createdAt: -1 });
};

// 모델이 이미 존재하는지 확인 (Next.js 개발 환경에서 핫 리로드 대응)
const MapData =
  (mongoose.models.MapData as IMapDataModel) ||
  mongoose.model<IMapData, IMapDataModel>("MapData", mapDataSchema);

export default MapData;
