"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, Suspense } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UsersTab } from "./users-tab";
import { MeasurementsTab } from "./measurements-tab";
import { FeedbackTab } from "./feedback-tab";
import { LogsTab } from "./logs-tab";
import { AnnouncementTab } from "./announcement-tab";

const VALID_TABS = [
  "users",
  "measurements",
  "feedback",
  "logs",
  "announcement",
] as const;
type TabValue = (typeof VALID_TABS)[number];

function AdminTabsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawTab = searchParams.get("tab");
  const tab: TabValue = VALID_TABS.includes(rawTab as TabValue)
    ? (rawTab as TabValue)
    : "users";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));

  const handleTabChange = useCallback(
    (newTab: string) => {
      const params = new URLSearchParams();
      if (newTab !== "users") params.set("tab", newTab);
      const qs = params.toString();
      router.push(`/admin${qs ? `?${qs}` : ""}`);
    },
    [router],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams();
      if (tab !== "users") params.set("tab", tab);
      if (newPage > 1) params.set("page", String(newPage));
      const qs = params.toString();
      router.push(`/admin${qs ? `?${qs}` : ""}`);
    },
    [router, tab],
  );

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="users">유저 정보</TabsTrigger>
        <TabsTrigger value="measurements">측정 정보</TabsTrigger>
        <TabsTrigger value="feedback">피드백</TabsTrigger>
        <TabsTrigger value="logs">로그</TabsTrigger>
        <TabsTrigger value="announcement">공지사항</TabsTrigger>
      </TabsList>

      <TabsContent value="users" className="space-y-4">
        <UsersTab page={page} onPageChange={handlePageChange} />
      </TabsContent>

      <TabsContent value="measurements" className="space-y-4">
        <MeasurementsTab page={page} onPageChange={handlePageChange} />
      </TabsContent>

      <TabsContent value="feedback" className="space-y-4">
        <FeedbackTab page={page} onPageChange={handlePageChange} />
      </TabsContent>

      <TabsContent value="logs" className="space-y-4">
        <LogsTab page={page} onPageChange={handlePageChange} />
      </TabsContent>

      <TabsContent value="announcement" className="space-y-4">
        <AnnouncementTab page={page} onPageChange={handlePageChange} />
      </TabsContent>
    </Tabs>
  );
}

export function AdminTabs() {
  return (
    <Suspense fallback={null}>
      <AdminTabsContent />
    </Suspense>
  );
}
