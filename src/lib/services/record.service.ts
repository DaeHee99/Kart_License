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
  recordData: number[]; // [강주력, 주력, 1군, 2군, 3군, 4군, 일반]
  recordSum: number;
}

export interface UserLicenseStatistics {
  licenseData: number[]; // [강주력, 주력, 1군, 2군, 3군, 4군, 일반]
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
    season?: number
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
    return records.map((record: any) => ({
      _id: record._id.toString(),
      season: record.season,
      recordCount: [
        record.tierDistribution.elite,
        record.tierDistribution.master,
        record.tierDistribution.diamond,
        record.tierDistribution.platinum,
        record.tierDistribution.gold,
        record.tierDistribution.silver,
        record.tierDistribution.bronze,
      ],
      license: record.finalTier,
      createdAt: record.createdAt,
    }));
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
        else acc[6]++;
        return acc;
      },
      [0, 0, 0, 0, 0, 0, 0]
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
        else acc[6]++;
        return acc;
      },
      [0, 0, 0, 0, 0, 0, 0]
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
        record.tierDistribution.elite,
        record.tierDistribution.master,
        record.tierDistribution.diamond,
        record.tierDistribution.platinum,
        record.tierDistribution.gold,
        record.tierDistribution.silver,
        record.tierDistribution.bronze,
      ],
      user: record.user ? {
        _id: record.user._id.toString(),
        name: record.user.name,
        image: record.user.image,
      } : undefined,
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
        record.tierDistribution.elite,
        record.tierDistribution.master,
        record.tierDistribution.diamond,
        record.tierDistribution.platinum,
        record.tierDistribution.gold,
        record.tierDistribution.silver,
        record.tierDistribution.bronze,
      ],
      user: record.user ? {
        _id: record.user._id.toString(),
        name: record.user.name,
        image: record.user.image,
      } : undefined,
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
