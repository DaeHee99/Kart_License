import User, { UserDocument } from "@/lib/db/models/user.model";
import { logService, LogActionType } from "./log.service";

export interface RegisterData {
  name: string;
  id: string;
  password: string;
  plainPassword: string;
  image?: string;
}

export interface LoginData {
  id: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  password?: string;
  image?: string;
}

export class UserService {
  /**
   * 회원가입
   */
  static async register(data: RegisterData): Promise<{ success: boolean; message?: string }> {
    // 닉네임 중복 확인
    const existingName = await User.findOne({ name: data.name });
    if (existingName) {
      return { success: false, message: "이미 존재하는 닉네임입니다." };
    }

    // 아이디 중복 확인
    const existingId = await User.findOne({ id: data.id });
    if (existingId) {
      return { success: false, message: "이미 존재하는 아이디입니다." };
    }

    try {
      // 새 유저 생성
      const user = new User(data);
      const savedUser = await user.save();

      // 로그 생성
      await logService.createLog({
        userId: savedUser._id,
        actionType: LogActionType.REGISTER,
        content: "회원가입 완료",
      });

      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  }

  /**
   * 로그인
   */
  static async login(data: LoginData): Promise<{
    success: boolean;
    message?: string;
    user?: UserDocument;
    token?: string;
  }> {
    // 사용자 찾기
    const user = await User.findOne({ id: data.id });
    if (!user) {
      return { success: false, message: "존재하지 않는 아이디 입니다." };
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      return { success: false, message: "비밀번호가 틀렸습니다." };
    }

    // 토큰 생성
    try {
      const userWithToken = await user.generateToken();
      return {
        success: true,
        user: userWithToken,
        token: userWithToken.token,
      };
    } catch (error) {
      console.error("Token generation error:", error);
      throw error;
    }
  }

  /**
   * 로그아웃
   */
  static async logout(userId: string): Promise<{ success: boolean }> {
    try {
      await User.findOneAndUpdate({ _id: userId }, { token: "" });
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  /**
   * 유저 정보 수정 (통합)
   * 닉네임, 비밀번호, 프로필 사진을 선택적으로 변경
   */
  static async updateProfile(
    userId: string,
    data: UpdateProfileData
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return { success: false, message: "사용자를 찾을 수 없습니다." };
      }

      const updates: string[] = []; // 변경 내용 기록용

      // 닉네임 변경
      if (data.name && data.name !== user.name) {
        // 닉네임 중복 확인
        const existingName = await User.findOne({ name: data.name });
        if (existingName) {
          return { success: false, message: "이미 존재하는 닉네임입니다." };
        }

        const oldName = user.name;
        user.name = data.name;
        updates.push(`닉네임 변경 (${oldName} -> ${data.name})`);
      }

      // 비밀번호 변경
      if (data.password) {
        user.password = data.password;
        user.plainPassword = data.password;
        updates.push("비밀번호 변경");
      }

      // 프로필 사진 변경
      if (data.image !== undefined && data.image !== user.image) {
        user.image = data.image;
        updates.push("프로필 사진 변경");
      }

      // 변경사항이 없으면 리턴
      if (updates.length === 0) {
        return { success: true, message: "변경 사항이 없습니다." };
      }

      // 변경사항 저장
      await user.save();

      // 로그 생성 - 변경 유형에 따라 적절한 actionType 설정
      let actionType = LogActionType.NICKNAME_UPDATE;
      if (data.password) {
        actionType = LogActionType.PASSWORD_UPDATE;
      }
      if (data.image !== undefined) {
        actionType = LogActionType.PROFILE_PICTURE_UPDATE;
      }
      // 여러 변경이 있는 경우, 가장 마지막 변경 타입을 사용하거나 모두 로깅
      // 각각 따로 로깅하는 것이 더 나을 수 있음
      if (data.name && data.name !== user.name) {
        await logService.createLog({
          userId,
          actionType: LogActionType.NICKNAME_UPDATE,
          content: `닉네임 변경 (${updates.find(u => u.includes('닉네임'))})`,
        });
      }
      if (data.password) {
        await logService.createLog({
          userId,
          actionType: LogActionType.PASSWORD_UPDATE,
          content: "비밀번호 변경",
        });
      }
      if (data.image !== undefined && data.image !== user.image) {
        await logService.createLog({
          userId,
          actionType: LogActionType.PROFILE_PICTURE_UPDATE,
          content: "프로필 사진 변경",
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }

  /**
   * 모든 유저 조회 - 관리자 페이지
   */
  static async getAllUsers(): Promise<UserDocument[]> {
    try {
      const userList = await User.find()
        .sort({ updatedAt: -1 })
        .select("name image license updatedAt")
        .exec();
      return userList;
    } catch (error) {
      console.error("Get all users error:", error);
      throw error;
    }
  }

  /**
   * 유저 조회 - 페이지네이션
   */
  static async getUsersByPage(page: number): Promise<{ count: number; userList: UserDocument[] }> {
    try {
      const userList = await User.find()
        .sort({ updatedAt: -1 })
        .select("name image license updatedAt")
        .limit(20)
        .skip(20 * (page - 1))
        .exec();

      const count = await User.countDocuments();

      return { count, userList };
    } catch (error) {
      console.error("Get users by page error:", error);
      throw error;
    }
  }

  /**
   * 유저 검색 - 이름으로
   */
  static async findUsersByName(name: string): Promise<{ count: number; userList: UserDocument[] }> {
    try {
      const userList = await User.find({ name: { $regex: name } })
        .sort({ updatedAt: -1 })
        .select("name image license updatedAt")
        .exec();

      return { count: userList.length, userList };
    } catch (error) {
      console.error("Find users by name error:", error);
      throw error;
    }
  }

  /**
   * 특정 유저 정보 조회
   */
  static async getUserById(userId: string): Promise<{
    success: boolean;
    user?: {
      _id: string;
      name: string;
      image: string;
      license: string;
      isAdmin: boolean;
      role: number;
    };
  }> {
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return { success: false };
      }

      return {
        success: true,
        user: {
          _id: user._id.toString(),
          name: user.name,
          image: user.image || "",
          license: user.license,
          isAdmin: user.role === 1,
          role: user.role,
        },
      };
    } catch (error) {
      console.error("Get user by id error:", error);
      throw error;
    }
  }
}
