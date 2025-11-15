import mongoose, { Model, Schema, HydratedDocument } from "mongoose";

// Announcement 데이터 인터페이스
export interface IAnnouncement {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  show: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Announcement 모델 인터페이스
interface IAnnouncementModel extends Model<IAnnouncement> {}

// HydratedDocument 타입
export type AnnouncementDocument = HydratedDocument<IAnnouncement>;

const announcementSchema = new Schema<IAnnouncement, IAnnouncementModel>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    content: {
      type: String,
      required: true,
    },
    show: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 모델이 이미 존재하는지 확인 (Next.js 개발 환경에서 핫 리로드 대응)
const Announcement =
  (mongoose.models.Announcement as IAnnouncementModel) ||
  mongoose.model<IAnnouncement, IAnnouncementModel>(
    "Announcement",
    announcementSchema
  );

export default Announcement;
