"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UsersTab } from "./users-tab";
import { MeasurementsTab } from "./measurements-tab";
import { FeedbackTab } from "./feedback-tab";
import { LogsTab } from "./logs-tab";
import { AnnouncementTab } from "./announcement-tab";

export function AdminTabs() {
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="users">유저 정보</TabsTrigger>
        <TabsTrigger value="measurements">측정 정보</TabsTrigger>
        <TabsTrigger value="feedback">피드백</TabsTrigger>
        <TabsTrigger value="logs">로그</TabsTrigger>
        <TabsTrigger value="announcement">공지사항</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-4">
        <UsersTab />
      </TabsContent>

      <TabsContent value="measurements" className="space-y-4">
        <MeasurementsTab />
      </TabsContent>

      <TabsContent value="feedback" className="space-y-4">
        <FeedbackTab />
      </TabsContent>

      <TabsContent value="logs" className="space-y-4">
        <LogsTab />
      </TabsContent>

      <TabsContent value="announcement" className="space-y-4">
        <AnnouncementTab />
      </TabsContent>
    </Tabs>
  );
}
