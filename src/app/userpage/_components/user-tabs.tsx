"use client";

import { motion } from "motion/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsContents,
} from "@/components/ui/shadcn-io/tabs";
import { TierProgressTab } from "@/app/mypage/_components/tier-progress-tab";
import { MeasurementHistoryTab } from "@/app/mypage/_components/measurement-history-tab";
import { SeasonRecordsTab } from "@/app/mypage/_components/season-records-tab";
import { TrendingUp, Crown, FileChartColumnIncreasing } from "lucide-react";
import { useState } from "react";
import { useMypageData } from "@/hooks/use-mypage";
import { TierType } from "@/lib/types";

interface UserTabsProps {
  userId: string;
}

export default function UserTabs({ userId }: UserTabsProps) {
  const [activeTab, setActiveTab] = useState("progress");
  const { tierHistory, seasonRecords, measurementHistory, isLoading } =
    useMypageData(userId);

  // 데이터 변환 함수
  const transformedTierHistory = tierHistory.map((item) => ({
    date: item.date,
    tier: item.tier,
    value: item.value,
  }));

  const transformedSeasonRecords = seasonRecords.map((item) => ({
    season: item.season,
    tier: item.tierEn as TierType,
    value: item.value,
    recordId: item.recordId,
  }));

  const transformedMeasurements = measurementHistory.map((item) => ({
    id: item.id,
    date: new Date(item.createdAt).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    tier: item.tierEn as TierType,
    maps: item.maps,
    season: item.season,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid h-12 w-full grid-cols-3">
          <TabsTrigger value="progress" className="gap-2">
            <TrendingUp className="h-4 w-4" />군 변화
          </TabsTrigger>
          <TabsTrigger value="seasons" className="gap-2">
            <Crown className="h-4 w-4" />
            시즌별 최고 기록
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <FileChartColumnIncreasing className="h-4 w-4" />
            측정 기록
          </TabsTrigger>
        </TabsList>
        <TabsContents>
          {/* Tier Progress Tab */}
          <TabsContent value="progress" className="mt-6">
            <TierProgressTab
              tierHistory={transformedTierHistory}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Season Best Records Tab */}
          <TabsContent value="seasons" className="mt-6">
            <SeasonRecordsTab
              seasonRecords={transformedSeasonRecords}
              isLoading={isLoading}
            />
          </TabsContent>

          {/* Measurement History Tab */}
          <TabsContent value="history" className="mt-6">
            <MeasurementHistoryTab
              measurements={transformedMeasurements}
              isLoading={isLoading}
            />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </motion.div>
  );
}
