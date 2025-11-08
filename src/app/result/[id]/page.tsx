"use client";

import { useState, useEffect } from "react";
import { UserMapRecord, TierType } from "@/lib/types";
import { calculateTier, getTierInsights } from "@/lib/utils-calc";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "./_components/animated-background";
import { TierRevealCard } from "./_components/tier-reveal-card";
import { TierDistributionTable } from "./_components/tier-distribution-table";
import { DetailedRecordsTable } from "./_components/detailed-records-table";
import { ActionButtons } from "./_components/action-buttons";
import { BottomActionButtons } from "./_components/bottom-action-buttons";

export default function ResultDetailPage() {
  const router = useRouter();
  const [records, setRecords] = useState<UserMapRecord[]>([]);

  useEffect(() => {
    // Get records from sessionStorage
    const storedRecords = sessionStorage.getItem("measurementRecords");
    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    } else {
      // Redirect to measure page if no records
      router.push("/measure");
      return;
    }
  }, [router]);

  if (records.length === 0) {
    return null; // Loading state while checking records
  }

  // Calculate tier distribution
  const tierDistribution: Record<TierType, number> = {
    elite: 0,
    master: 0,
    diamond: 0,
    platinum: 0,
    gold: 0,
    silver: 0,
    bronze: 0,
  };

  records.forEach((record) => {
    if (record.tier) {
      tierDistribution[record.tier]++;
    }
  });

  const finalTier = calculateTier(tierDistribution);
  const insights = getTierInsights(finalTier, tierDistribution);

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      <AnimatedBackground />

      <div className="relative z-10 px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <TierRevealCard finalTier={finalTier} insights={insights} />
          <ActionButtons finalTier={finalTier} />
          <TierDistributionTable
            tierDistribution={tierDistribution}
            finalTier={finalTier}
            totalMaps={records.length}
          />
          <DetailedRecordsTable records={records} />
          <BottomActionButtons />
        </div>
      </div>
    </div>
  );
}
