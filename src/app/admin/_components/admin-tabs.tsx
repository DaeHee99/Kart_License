"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
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

function parseTab(value: string | null): TabValue {
  return VALID_TABS.includes(value as TabValue) ? (value as TabValue) : "users";
}

function parsePage(value: string | null): number {
  return Math.max(1, parseInt(value || "1", 10));
}

function getAdminUrl(tab: TabValue, page: number): string {
  const params = new URLSearchParams();
  if (tab !== "users") params.set("tab", tab);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return `/admin${qs ? `?${qs}` : ""}`;
}

function AdminTabsContent() {
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  const urlState = useMemo(
    () => {
      const params = new URLSearchParams(search);
      return {
        tab: parseTab(params.get("tab")),
        page: parsePage(params.get("page")),
      };
    },
    [search],
  );

  const [tab, setTab] = useState<TabValue>(urlState.tab);
  const [page, setPage] = useState(urlState.page);

  useEffect(() => {
    setTab(urlState.tab);
    setPage(urlState.page);
  }, [urlState]);

  useEffect(() => {
    const syncFromHistory = () => {
      const params = new URLSearchParams(window.location.search);
      setTab(parseTab(params.get("tab")));
      setPage(parsePage(params.get("page")));
    };

    window.addEventListener("popstate", syncFromHistory);
    return () => window.removeEventListener("popstate", syncFromHistory);
  }, []);

  const pushUrlState = useCallback((nextTab: TabValue, nextPage: number) => {
    const nextUrl = getAdminUrl(nextTab, nextPage);
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (currentUrl !== nextUrl) {
      window.history.pushState(null, "", nextUrl);
    }
  }, []);

  const handleTabChange = useCallback(
    (newTab: string) => {
      const nextTab = parseTab(newTab);
      setTab(nextTab);
      setPage(1);
      pushUrlState(nextTab, 1);
    },
    [pushUrlState],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const nextPage = Math.max(1, newPage);
      setPage(nextPage);
      pushUrlState(tab, nextPage);
    },
    [pushUrlState, tab],
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
