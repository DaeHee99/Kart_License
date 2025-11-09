import mongoose, { Document, Schema } from "mongoose";

export interface ILog extends Document {
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const logSchema = new Schema<ILog>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Log = mongoose.models.Log || mongoose.model<ILog>("Log", logSchema);

export default Log;
