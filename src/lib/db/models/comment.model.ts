/**
 * Comment Model
 * 게시글 댓글
 */

import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface IComment extends Document {
  _id: Types.ObjectId;
  post: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentModel extends Model<IComment> {
  // Static methods can be defined here
}

const commentSchema = new Schema<IComment, ICommentModel>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
commentSchema.index({ post: 1, createdAt: -1 });

const Comment =
  (mongoose.models.Comment as ICommentModel) ||
  mongoose.model<IComment, ICommentModel>("Comment", commentSchema);

export default Comment;
