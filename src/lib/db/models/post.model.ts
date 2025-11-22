/**
 * Post Model
 * 커뮤니티 게시글
 */

import mongoose, { Schema, Document, Types, Model } from "mongoose";

export type PostCategory = "notice" | "general" | "question";

export interface IPost extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  category: PostCategory;
  title: string;
  content: string;
  images: string[]; // 이미지 URL 배열
  views: number;
  likes: Types.ObjectId[]; // 좋아요를 누른 유저 ID 배열
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostModel extends Model<IPost> {
  // Static methods can be defined here
}

const postSchema = new Schema<IPost, IPostModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["notice", "general", "question"],
      default: "general",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (images: string[]) {
          return images.length <= 10;
        },
        message: "최대 10개의 이미지만 업로드할 수 있습니다.",
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for comments
postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

// Indexes
postSchema.index({ createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ title: "text", content: "text" }); // 텍스트 검색용

const Post =
  (mongoose.models.Post as IPostModel) ||
  mongoose.model<IPost, IPostModel>("Post", postSchema);

export default Post;
