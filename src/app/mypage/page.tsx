"use client";

import { useState } from "react";
import { EditProfileView } from "./_components/edit-profile-view";
import { MypageHeader } from "./_components/mypage-header";
import { ProfileSummaryCard } from "./_components/profile-summary-card";
import MypageTabs from "./_components/mypage-tabs";

export default function MyPage() {
  const [showEditProfile, setShowEditProfile] = useState(false);

  if (showEditProfile) {
    return <EditProfileView onBack={() => setShowEditProfile(false)} />;
  }

  return (
    <div className="from-primary/5 via-background to-background min-h-screen bg-linear-to-b pb-24">
      <div className="px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <MypageHeader />
          <ProfileSummaryCard onEditProfile={() => setShowEditProfile(true)} />
          <MypageTabs />
        </div>
      </div>
    </div>
  );
}
