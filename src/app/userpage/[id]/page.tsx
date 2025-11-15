"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserpageHeader } from "../_components/userpage-header";
import { UserProfileSummaryCard } from "../_components/user-profile-summary-card";
import UserTabs from "../_components/user-tabs";
import { UserNotFound } from "../_components/user-not-found";

export default function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // 유저 정보 조회
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "유저 정보를 불러올 수 없습니다.");
      }

      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  // 로딩 중
  if (isLoading) {
    return (
      <div className="from-primary/5 via-background to-background flex min-h-screen items-center justify-center bg-linear-to-b pb-24">
        <div className="text-muted-foreground">로딩 중...</div>
      </div>
    );
  }

  // 에러 또는 유저를 찾을 수 없는 경우
  if (error || !data) {
    return <UserNotFound />;
  }

  return (
    <div className="from-primary/5 via-background to-background min-h-screen bg-linear-to-b pb-24">
      <div className="px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <UserpageHeader userName={data.name} />
          <UserProfileSummaryCard user={data} />
          <UserTabs userId={id} />
        </div>
      </div>
    </div>
  );
}
