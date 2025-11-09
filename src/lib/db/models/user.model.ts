import mongoose, { Model, Schema, HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "";

if (!JWT_SECRET) {
  throw new Error(
    "Please define the JWT_SECRET environment variable inside .env.local",
  );
}

// User 데이터 인터페이스
export interface IUser {
  name: string;
  id: string;
  password: string;
  plainPassword: string;
  image?: string;
  license: string;
  role: number; // 0: 일반, 1: 운영진, 2: 관리자
  token?: string;
  tokenExp?: number;
  authCount: number;
  recentSurvey: number;
  createdAt: Date;
  updatedAt: Date;
}

// User 메서드 인터페이스
export interface IUserMethods {
  comparePassword(plainPassword: string): Promise<boolean>;
  generateToken(): Promise<this>;
  changePassword(newPassword: string): Promise<this>;
}

// User 모델 인터페이스
interface IUserModel extends Model<IUser, {}, IUserMethods> {
  findByToken(
    token: string,
  ): Promise<HydratedDocument<IUser, IUserMethods> | null>;
}

// HydratedDocument 타입 (Document + 메서드)
export type UserDocument = HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    name: {
      type: String,
      maxlength: 16,
      trim: true,
      unique: true,
      required: true,
    },
    id: {
      type: String,
      minlength: 2,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 4,
      required: true,
    },
    plainPassword: {
      type: String,
      minlength: 4,
    },
    image: {
      type: String,
      default: "",
    },
    license: {
      type: String,
      default: "",
    },
    role: {
      type: Number,
      default: 0,
    },
    token: String,
    tokenExp: Number,
    authCount: {
      type: Number,
      default: 0,
    },
    recentSurvey: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

// 비밀번호 암호화 미들웨어
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      next();
    } catch (err) {
      next(err as Error);
    }
  } else {
    next();
  }
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function (
  plainPassword: string,
): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, this.password);
  } catch (err) {
    throw err;
  }
};

// 토큰 생성 메서드
userSchema.methods.generateToken = async function () {
  const token = jwt.sign(this._id.toHexString(), JWT_SECRET);
  this.token = token;
  await this.save();
  return this;
};

// 토큰으로 사용자 찾기 - 정적 메서드
userSchema.statics.findByToken = async function (token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as string;
    const user = await this.findOne({ _id: decoded, token: token });
    return user;
  } catch (err) {
    throw err;
  }
};

// 비밀번호 변경 메서드
userSchema.methods.changePassword = async function (newPassword: string) {
  this.password = newPassword;
  this.plainPassword = newPassword;
  await this.save();
  return this;
};

// 모델이 이미 존재하는지 확인 (Next.js 개발 환경에서 핫 리로드 대응)
const User =
  (mongoose.models.User as IUserModel) ||
  mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
