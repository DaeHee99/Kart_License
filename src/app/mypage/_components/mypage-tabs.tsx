"use client";

import { motion } from "motion/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsContents,
} from "@/components/ui/shadcn-io/tabs";
import { TierProgressTab } from "./tier-progress-tab";
import { MeasurementHistoryTab } from "./measurement-history-tab";
import { SeasonRecordsTab } from "./season-records-tab";
import { TrendingUp, Crown, FileChartColumnIncreasing } from "lucide-react";
import {
  TierHistoryItem,
  MeasurementHistoryItem,
  SeasonRecord,
} from "@/lib/mypage-constants";
import { useState } from "react";

export default function MypageTabs() {
  const [activeTab, setActiveTab] = useState("progress");

  // Mock tier history data
  const tierHistory: TierHistoryItem[] = [
    { date: "10/01", tier: "gold", value: 3 },
    { date: "10/08", tier: "gold", value: 3 },
    { date: "10/15", tier: "platinum", value: 4 },
    { date: "10/22", tier: "diamond", value: 5 },
    { date: "10/25", tier: "diamond", value: 5 },
  ];

  // Mock season records
  const seasonRecords: SeasonRecord[] = [
    { season: "S17", tier: "gold", value: 3 },
    { season: "S18", tier: "gold", value: 3 },
    { season: "S29", tier: "gold", value: 3 },
    { season: "S35", tier: "diamond", value: 5 },
  ];

  // Mock measurement history
  const measurements: MeasurementHistoryItem[] = [
    {
      id: "1",
      date: "2025-10-25 14:30",
      tier: "diamond",
      maps: 70,
      season: "S35",
    },
    {
      id: "2",
      date: "2025-10-22 16:45",
      tier: "diamond",
      maps: 70,
      season: "S35",
    },
    {
      id: "3",
      date: "2025-10-15 10:20",
      tier: "platinum",
      maps: 70,
      season: "S35",
    },
    {
      id: "4",
      date: "2024-11-26 03:13",
      tier: "gold",
      maps: 70,
      season: "S29",
    },
    {
      id: "5",
      date: "2023-03-12 21:47",
      tier: "gold",
      maps: 70,
      season: "S18",
    },
    {
      id: "6",
      date: "2023-02-19 04:18",
      tier: "gold",
      maps: 70,
      season: "S17",
    },
  ];

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
            <TierProgressTab tierHistory={tierHistory} />
          </TabsContent>

          {/* Season Best Records Tab */}
          <TabsContent value="seasons" className="mt-6">
            <SeasonRecordsTab seasonRecords={seasonRecords} />
          </TabsContent>

          {/* Measurement History Tab */}
          <TabsContent value="history" className="mt-6">
            <MeasurementHistoryTab measurements={measurements} />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </motion.div>
  );
}
