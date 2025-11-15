import mongoose, { Document, Schema } from "mongoose";

export interface ILog extends Document {
  user?: mongoose.Types.ObjectId; // Optional for non-logged-in users
  nickname: string; // User nickname or '비로그인 유저'
  profilePicture: string; // User profile picture or default
  actionType: string; // Type of action (LOGIN, LOGOUT, POST_CREATE, etc.)
  content: string; // Detailed log message
  metadata?: {
    // Additional context data
    recordId?: string;
    postId?: string;
    commentId?: string;
    season?: number;
    tier?: string;
    ip?: string;
    userAgent?: string;
    [key: string]: unknown;
  };
  createdAt: Date;
  updatedAt: Date;
}

const logSchema = new Schema<ILog>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allow non-logged-in users
    },
    nickname: {
      type: String,
      required: true,
      default: "비로그인 유저",
    },
    profilePicture: {
      type: String,
      required: true,
      default: "/profile/gyool_dizini.png",
    },
    actionType: {
      type: String,
      required: true,
      index: true, // Index for filtering by action type
    },
    content: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true },
);

// Index for querying logs by user and date
logSchema.index({ user: 1, createdAt: -1 });
logSchema.index({ actionType: 1, createdAt: -1 });

const Log = mongoose.models.Log || mongoose.model<ILog>("Log", logSchema);

export default Log;
