/**
 * Record Service Layer
 * 비즈니스 로직을 처리합니다.
 */

import Record from "@/lib/db/models/record.model";
import User from "@/lib/db/models/user.model";
import { Types } from "mongoose";
import type { IRecord, IUserMapRecord } from "@/lib/db/models/record.model";

export interface SaveRecordInput {
  userId?: string;
  season: number;
  records: IUserMapRecord[];
}

export interface SaveRecordResult {
  recordId: string;
  finalTier: string;
  tierDistribution: IRecord["tierDistribution"];
}

export interface RecordStatistics {
  recordData: number[]; // [강주력, 주력, 1군, 2군, 3군, 4군, 라이트, 일반]
  recordSum: number;
}

export interface UserLicenseStatistics {
  licenseData: number[]; // [강주력, 주력, 1군, 2군, 3군, 4군, 라이트, 일반]
}

export interface RecordListItem {
  _id: string;
  license: string;
  recordCount: number[];
  user?: {
    _id: string;
    name: string;
    image?: string;
  };
  createdAt: Date;
}

export interface PaginatedRecords {
  recordList: RecordListItem[];
  count: number;
}

export interface UserRecordItem {
  _id: string;
  season: number;
  recordCount: number[];
  license: string;
  createdAt: Date;
}

export interface DeleteUserRecordResult {
  recordId: string;
  season: number;
  finalTier: string;
  deletedAt: Date;
}

/**
 * 기록 서비스 클래스
 */
export class RecordService {
  /**
   * 기록 저장
   */
  async saveRecord(input: SaveRecordInput): Promise<SaveRecordResult> {
    const recordData: any = {
      season: input.season,
      records: input.records,
    };

    if (input.userId) {
      recordData.user = new Types.ObjectId(input.userId);
    }

    const record = new Record(recordData);
    await record.save();

    return {
      recordId: record._id.toString(),
      finalTier: record.finalTier,
      tierDistribution: record.tierDistribution,
    };
  }

  /**
   * ID로 기록 조회 (결과 페이지용)
   */
  async getRecordById(recordId: string): Promise<IRecord | null> {
    if (!Types.ObjectId.isValid(recordId)) {
      return null;
    }

    const record = await Record.findOne({
      _id: new Types.ObjectId(recordId),
      season: { $gt: 0 },
    }).populate("user", "name id image license");

    return record;
  }

  /**
   * 유저의 최근 기록 조회
   */
  async getLatestRecordByUser(userId: string): Promise<IRecord | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }

    return await Record.getLatestRecordByUser(userId);
  }

  /**
   * 유저의 모든 기록 조회
   */
  async getUserRecords(
    userId: string,
    season?: number,
  ): Promise<UserRecordItem[]> {
    if (!Types.ObjectId.isValid(userId)) {
      return [];
    }

    const query: any = {
      user: new Types.ObjectId(userId),
      season: { $gt: 0 },
    };

    if (season) {
      query.season = season;
    }

    const records = await Record.find(query)
      .select("season tierDistribution finalTier createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // tierDistribution을 recordCount로 변환
    // [elite, master, diamond, platinum, gold, silver, light, bronze]
    return records.map((record: any) => ({
      _id: record._id.toString(),
      season: record.season,
      recordCount: [
        record.tierDistribution.elite ?? 0,
        record.tierDistribution.master ?? 0,
        record.tierDistribution.diamond ?? 0,
        record.tierDistribution.platinum ?? 0,
        record.tierDistribution.gold ?? 0,
        record.tierDistribution.silver ?? 0,
        record.tierDistribution.light ?? 0,
        record.tierDistribution.bronze ?? 0,
      ],
      license: record.finalTier,
      createdAt: record.createdAt,
    }));
  }

  /**
   * 마이페이지 측정 기록 탭에서 기록 숨김 처리
   *
   * 실제 기록 데이터는 유지하고 deletedAt만 설정한다. 이 플래그는
   * 마이페이지 측정 기록 목록 노출에만 사용하고, 군 변화/시즌 최고 기록
   * 그래프나 결과 페이지 조회에는 영향을 주지 않는다.
   */
  async deleteUserRecordForMypage(
    recordId: string,
    userId: string,
  ): Promise<DeleteUserRecordResult | null> {
    if (!Types.ObjectId.isValid(recordId) || !Types.ObjectId.isValid(userId)) {
      return null;
    }

    const record = await Record.findById(recordId).select(
      "user season finalTier deletedAt",
    );

    if (!record || record.deletedAt) {
      return null;
    }

    if (!record.user || record.user.toString() !== userId) {
      throw new Error("기록 삭제 권한이 없습니다.");
    }

    const deletedAt = new Date();
    const updatedRecord = await Record.findOneAndUpdate(
      {
        _id: new Types.ObjectId(recordId),
        user: new Types.ObjectId(userId),
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
      },
      { $set: { deletedAt } },
      {
        new: true,
        strict: false,
        runValidators: false,
      },
    ).select("deletedAt");

    if (!updatedRecord?.deletedAt) {
      return null;
    }

    return {
      recordId,
      season: record.season,
      finalTier: record.finalTier,
      deletedAt,
    };
  }

  /**
   * 모든 기록 통계 조회 (통계 페이지용)
   */
  async getAllRecordsStatistics(): Promise<RecordStatistics> {
    const recordList = await Record.find().select("finalTier").lean();

    const recordData = recordList.reduce(
      (acc, { finalTier }) => {
        if (finalTier === "강주력") acc[0]++;
        else if (finalTier === "주력") acc[1]++;
        else if (finalTier === "1군") acc[2]++;
        else if (finalTier === "2군") acc[3]++;
        else if (finalTier === "3군") acc[4]++;
        else if (finalTier === "4군") acc[5]++;
        else if (finalTier === "라이트") acc[6]++;
        else acc[7]++;
        return acc;
      },
      [0, 0, 0, 0, 0, 0, 0, 0],
    );

    const recordSum = recordData.reduce((acc, val) => acc + val, 0);

    return { recordData, recordSum };
  }

  /**
   * 모든 유저 군 분포 통계 조회 (통계 페이지용)
   */
  async getAllUserLicenseStatistics(): Promise<UserLicenseStatistics> {
    const licenseList = await User.find().select("license").lean();

    const licenseData = licenseList.reduce(
      (acc, { license }) => {
        if (license === "강주력") acc[0]++;
        else if (license === "주력") acc[1]++;
        else if (license === "1군") acc[2]++;
        else if (license === "2군") acc[3]++;
        else if (license === "3군") acc[4]++;
        else if (license === "4군") acc[5]++;
        else if (license === "라이트") acc[6]++;
        else acc[7]++;
        return acc;
      },
      [0, 0, 0, 0, 0, 0, 0, 0],
    );

    return { licenseData };
  }

  /**
   * 모든 기록 조회 (관리자용)
   */
  async getAllRecordsForAdmin(): Promise<RecordListItem[]> {
    const records = await Record.find()
      .sort({ createdAt: -1 })
      .select("finalTier tierDistribution createdAt")
      .populate("user", "name image")
      .lean();

    return records.map((record: any) => ({
      _id: record._id.toString(),
      license: record.finalTier,
      recordCount: [
        record.tierDistribution.elite ?? 0,
        record.tierDistribution.master ?? 0,
        record.tierDistribution.diamond ?? 0,
        record.tierDistribution.platinum ?? 0,
        record.tierDistribution.gold ?? 0,
        record.tierDistribution.silver ?? 0,
        record.tierDistribution.light ?? 0,
        record.tierDistribution.bronze ?? 0,
      ],
      user: record.user
        ? {
            _id: record.user._id.toString(),
            name: record.user.name,
            image: record.user.image,
          }
        : undefined,
      createdAt: record.createdAt,
    }));
  }

  /**
   * 페이지네이션된 기록 조회 (관리자용)
   */
  async getRecordsWithPagination(page: number): Promise<PaginatedRecords> {
    const limit = 20;
    const skip = limit * (page - 1);

    const [records, count] = await Promise.all([
      Record.find()
        .sort({ createdAt: -1 })
        .select("finalTier tierDistribution createdAt")
        .populate("user", "name image")
        .limit(limit)
        .skip(skip)
        .lean(),
      Record.countDocuments(),
    ]);

    const recordList = records.map((record: any) => ({
      _id: record._id.toString(),
      license: record.finalTier,
      recordCount: [
        record.tierDistribution.elite ?? 0,
        record.tierDistribution.master ?? 0,
        record.tierDistribution.diamond ?? 0,
        record.tierDistribution.platinum ?? 0,
        record.tierDistribution.gold ?? 0,
        record.tierDistribution.silver ?? 0,
        record.tierDistribution.light ?? 0,
        record.tierDistribution.bronze ?? 0,
      ],
      user: record.user
        ? {
            _id: record.user._id.toString(),
            name: record.user.name,
            image: record.user.image,
          }
        : undefined,
      createdAt: record.createdAt,
    }));

    return { recordList, count };
  }

  /**
   * 최근 기록 10개 조회 (홈페이지용)
   */
  async getRecentRecords(limit: number = 10): Promise<IRecord[]> {
    return await Record.find({ season: { $gt: 0 } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user", "name id image license")
      .lean();
  }
}

// Singleton 인스턴스 export
export const recordService = new RecordService();
