"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Users, Activity, TrendingUp, Loader2 } from "lucide-react";
import { useStatisticsSummary } from "@/hooks/use-statistics";
import { useLatestMaps } from "@/hooks/use-records";

export function OverviewStats() {
  // 최신 맵 데이터에서 시즌 정보 가져오기
  const { season } = useLatestMaps();

  // 통계 요약 정보 조회
  const { totalUsers, totalRecords, seasonRecords, isLoading } =
    useStatisticsSummary(season);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="flex justify-center py-12"
      >
        <Loader2 className="h-8 w-8 animate-spin" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.05 }}
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
    >
      <Card className="border-primary/10 hover:border-primary/20 relative overflow-hidden border-2 p-6 transition-all">
        <motion.div
          className="bg-primary/5 absolute top-0 right-0 h-32 w-32 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="relative flex items-center gap-4">
          <div className="from-primary/20 to-primary/10 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br">
            <Users className="text-primary h-6 w-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">
              총 사용자 (로그인 유저)
            </p>
            <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <Card className="border-secondary/10 hover:border-secondary/20 relative overflow-hidden border-2 p-6 transition-all">
        <motion.div
          className="bg-secondary/5 absolute top-0 right-0 h-32 w-32 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
        <div className="relative flex items-center gap-4">
          <div className="from-secondary/20 to-secondary/10 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br">
            <Activity className="text-secondary h-6 w-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">누적 측정 횟수</p>
            <p className="text-2xl font-bold">
              {totalRecords.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Card className="border-primary/10 hover:border-primary/20 relative overflow-hidden border-2 p-6 transition-all">
        <motion.div
          className="bg-primary/5 absolute top-0 right-0 h-32 w-32 rounded-full blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        />
        <div className="relative flex items-center gap-4">
          <div className="from-primary/20 to-secondary/10 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br">
            <TrendingUp className="text-primary h-6 w-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">
              이번 시즌 측정 횟수
            </p>
            <p className="text-2xl font-bold">
              {seasonRecords.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
