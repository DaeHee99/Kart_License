"use client";

import { motion } from "motion/react";
import { Clock, BarChart3, MessageCircle } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsContents,
} from "@/components/ui/shadcn-io/tabs";
import { RealtimeTab } from "./realtime-tab";
import { StatisticsTab } from "./statistics-tab";
import { FeedbackTab } from "./feedback-tab";
import { useState } from "react";

export function StatisticsTabs() {
  const [activeTab, setActiveTab] = useState("realtime");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid h-12 w-full grid-cols-3">
          <TabsTrigger value="realtime" className="gap-2">
            <Clock className="h-4 w-4" />
            실시간 측정
          </TabsTrigger>
          <TabsTrigger value="statistics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            통계 정보
          </TabsTrigger>
          <TabsTrigger value="feedback" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            시즌 피드백
          </TabsTrigger>
        </TabsList>
        <TabsContents>
          {/* Realtime Tab */}
          <TabsContent value="realtime" className="mt-6">
            <RealtimeTab key={activeTab === "realtime" ? "realtime" : ""} />
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="mt-6">
            <StatisticsTab
              key={activeTab === "statistics" ? "statistics" : ""}
            />
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="mt-6">
            <FeedbackTab key={activeTab === "feedback" ? "feedback" : ""} />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </motion.div>
  );
}
