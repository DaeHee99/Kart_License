"use client";

import { Card } from "@/components/ui/card";
import {
  MOCK_STATISTICS,
  MOCK_RECENT_MEASUREMENTS,
  getUserNickname,
} from "@/lib/mock-data";
import { TIERS, TierType } from "@/lib/types";
import { TierBadge } from "@/components/tier-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils-calc";
import { motion } from "motion/react";
import {
  Users,
  Activity,
  TrendingUp,
  Sparkles,
  BarChart3,
  Clock,
  MessageCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function StatisticsPage() {
  const stats = MOCK_STATISTICS;
  const [activeTab, setActiveTab] = useState("realtime");

  // Helper function to get tier color hex
  const getTierColorHex = (tier: TierType): string => {
    const colorMap: Record<TierType, string> = {
      elite: "#ef4444", // 루비/레드 색상
      master: "#a855f7",
      diamond: "#3b82f6",
      platinum: "#06b6d4",
      gold: "#eab308",
      silver: "#94a3b8",
      bronze: "#d97706",
    };
    return colorMap[tier];
  };

  // Mock data for full statistics
  const cumulativeStats = {
    elite: 4047,
    master: 15955,
    diamond: 24740,
    platinum: 27030,
    gold: 22866,
    silver: 12070,
    bronze: 12989,
  };

  const userDistributionStats = {
    elite: 178,
    master: 384,
    diamond: 733,
    platinum: 931,
    gold: 1002,
    silver: 768,
    bronze: 3447,
  };

  // Feedback data
  const difficultyFeedback = [
    { label: "매우 쉬움", value: 13, color: "#a855f7" },
    { label: "쉬움", value: 9, color: "#3b82f6" },
    { label: "보", value: 107, color: "#94a3b8" },
    { label: "어려움", value: 56, color: "#f59e0b" },
    { label: "매우 어려움", value: 28, color: "#ef4444" },
  ];

  const balanceFeedback = [
    { label: "매우 좋음", value: 10, color: "#a855f7" },
    { label: "좋음", value: 26, color: "#3b82f6" },
    { label: "보통", value: 126, color: "#94a3b8" },
    { label: "나쁨", value: 23, color: "#f59e0b" },
    { label: "매우 나쁨", value: 28, color: "#ef4444" },
  ];

  const totalMeasured = Object.values(cumulativeStats).reduce(
    (a, b) => a + b,
    0,
  );
  const totalUserDistribution = Object.values(userDistributionStats).reduce(
    (a, b) => a + b,
    0,
  );
  const totalDifficultyFeedback = difficultyFeedback.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      {/* Animated Background */}
      <div className="from-primary/5 via-background to-secondary/5 absolute inset-0 bg-linear-to-br">
        <motion.div
          className="from-primary/10 to-secondary/10 absolute top-20 right-10 h-96 w-96 rounded-full bg-linear-to-br blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="from-secondary/10 to-primary/10 absolute bottom-20 left-10 h-80 w-80 rounded-full bg-linear-to-br blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.3, 0.4],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 px-4 py-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <div className="from-primary/10 via-primary/5 absolute inset-0 -z-10 rounded-2xl bg-linear-to-r to-transparent blur-3xl" />
            <Card className="border-primary/20 relative overflow-hidden border-2 p-6">
              <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl" />
              <div className="bg-primary/5 pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full blur-3xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex flex-1 items-start gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="from-primary to-primary/60 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br shadow-lg"
                  >
                    <BarChart3 className="text-primary-foreground h-8 w-8" />
                  </motion.div>
                  <div className="flex-1">
                    <motion.h1
                      className="mb-2 text-3xl font-bold"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      통계
                    </motion.h1>
                    <motion.p
                      className="text-muted-foreground text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      실시간 측정 현황 및 통계 정보를 확인하세요
                    </motion.p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Overview Stats */}
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
                  <p className="text-muted-foreground text-sm">총 사용자</p>
                  <p className="text-2xl font-bold">
                    {stats.totalUsers.toLocaleString()}
                  </p>
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
                  <p className="text-muted-foreground text-sm">총 측정</p>
                  <p className="text-2xl font-bold">
                    {stats.totalMeasurements.toLocaleString()}
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
                  <p className="text-muted-foreground text-sm">평균 측정</p>
                  <p className="text-2xl font-bold">
                    {(stats.totalMeasurements / stats.totalUsers).toFixed(1)}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
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
                  이번 시즌 피드백
                </TabsTrigger>
              </TabsList>

              {/* Realtime Tab */}
              <TabsContent value="realtime" className="mt-6">
                <Card className="border-border/50 relative overflow-hidden border-2 p-6">
                  <motion.div
                    className="via-primary/5 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />

                  <div className="relative">
                    <div className="mb-4 flex items-center gap-2">
                      <Sparkles className="text-primary h-5 w-5" />
                      <h3 className="text-xl font-bold">최근 측정 기록</h3>
                    </div>

                    <div className="space-y-3">
                      {MOCK_RECENT_MEASUREMENTS.map((measurement, index) => {
                        const tierColor =
                          TIERS[measurement.tier as keyof typeof TIERS].color;
                        return (
                          <motion.div
                            key={measurement.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15, delay: index * 0.03 }}
                            className="hover:bg-primary/5 hover:border-primary/10 group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-lg border border-transparent p-4 transition-all"
                          >
                            <motion.div
                              className={`absolute top-0 bottom-0 left-0 w-1 ${tierColor}`}
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.03 + 0.1,
                              }}
                            />

                            <Avatar className="ring-background group-hover:ring-primary/20 h-12 w-12 ring-2 transition-all">
                              <AvatarFallback
                                style={{
                                  backgroundColor: `${tierColor}20`,
                                  color: `var(--foreground)`,
                                }}
                              >
                                {getUserNickname(measurement.userId)[0]}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <span className="truncate font-medium">
                                  {getUserNickname(measurement.userId)}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`gap-1`}
                                  style={{
                                    backgroundColor: `${tierColor}15`,
                                    borderColor: `${tierColor}40`,
                                    color: "var(--foreground)",
                                  }}
                                >
                                  <div
                                    className={`h-2 w-2 rounded-full ${tierColor}`}
                                  />
                                  {
                                    TIERS[
                                      measurement.tier as keyof typeof TIERS
                                    ].nameKo
                                  }
                                </Badge>
                              </div>
                              <p className="text-muted-foreground text-sm">
                                {formatRelativeTime(measurement.timestamp)} •{" "}
                                {measurement.totalMaps}개 맵 측정
                              </p>
                            </div>

                            <TierBadge
                              tier={measurement.tier as TierType}
                              size="md"
                              showLabel={false}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Statistics Tab */}
              <TabsContent value="statistics" className="mt-6">
                <Card className="border-border/50 relative overflow-hidden border-2 p-6">
                  <motion.div
                    className="via-secondary/5 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />

                  <div className="relative space-y-6">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <TrendingUp className="text-secondary h-5 w-5" />
                        <h3 className="text-xl font-bold">
                          전체 유저 기록 통계
                        </h3>
                      </div>
                    </div>

                    {/* Tables */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* 누적 측정 결과 */}
                      <div className="space-y-4">
                        <h4 className="text-muted-foreground text-sm font-medium">
                          누적 측정 결과
                        </h4>

                        <div className="border-border/50 space-y-0 overflow-hidden rounded-lg border">
                          <div className="bg-muted/50 border-border/50 grid grid-cols-2 border-b">
                            <div className="text-muted-foreground px-4 py-2 text-xs font-medium">
                              군
                            </div>
                            <div className="text-muted-foreground px-4 py-2 text-right text-xs font-medium">
                              인원
                            </div>
                          </div>

                          {(Object.keys(TIERS) as TierType[]).map(
                            (tierId, index) => {
                              const tier = TIERS[tierId];
                              const count = cumulativeStats[tierId];
                              const percentage = Math.round(
                                (count / totalMeasured) * 100,
                              );
                              const tierColorHex = getTierColorHex(tierId);

                              return (
                                <motion.div
                                  key={tierId}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.15,
                                    delay: index * 0.03,
                                  }}
                                  className="border-border/50 hover:bg-primary/5 relative grid grid-cols-2 border-b transition-colors last:border-b-0"
                                  style={{
                                    backgroundColor: `${tierColorHex}10`,
                                  }}
                                >
                                  <motion.div
                                    className="absolute top-0 bottom-0 left-0 opacity-20"
                                    style={{ backgroundColor: tierColorHex }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{
                                      duration: 0.3,
                                      delay: index * 0.03 + 0.1,
                                    }}
                                  />

                                  <div className="relative z-10 flex items-center gap-2 px-4 py-3">
                                    <div
                                      className="h-3 w-3 rounded-full"
                                      style={{ backgroundColor: tierColorHex }}
                                    />
                                    <span className="text-sm font-medium">
                                      {tier.nameKo}
                                    </span>
                                  </div>
                                  <div className="relative z-10 px-4 py-3 text-right">
                                    <span
                                      className="font-mono text-sm font-bold"
                                      style={{ color: "var(--foreground)" }}
                                    >
                                      {count.toLocaleString()}
                                    </span>
                                  </div>
                                </motion.div>
                              );
                            },
                          )}
                        </div>
                      </div>

                      {/* 유저 군 분포 결과 */}
                      <div className="space-y-4">
                        <h4 className="text-muted-foreground text-sm font-medium">
                          유저 군 분포 결과 (로그인 유저 최신 기록 기준)
                        </h4>

                        <div className="border-border/50 space-y-0 overflow-hidden rounded-lg border">
                          <div className="bg-muted/50 border-border/50 grid grid-cols-2 border-b">
                            <div className="text-muted-foreground px-4 py-2 text-xs font-medium">
                              군
                            </div>
                            <div className="text-muted-foreground px-4 py-2 text-right text-xs font-medium">
                              인원
                            </div>
                          </div>

                          {(Object.keys(TIERS) as TierType[]).map(
                            (tierId, index) => {
                              const tier = TIERS[tierId];
                              const count = userDistributionStats[tierId];
                              const percentage = Math.round(
                                (count / totalUserDistribution) * 100,
                              );
                              const tierColorHex = getTierColorHex(tierId);

                              return (
                                <motion.div
                                  key={tierId}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.15,
                                    delay: index * 0.03,
                                  }}
                                  className="border-border/50 hover:bg-primary/5 relative grid grid-cols-2 border-b transition-colors last:border-b-0"
                                  style={{
                                    backgroundColor: `${tierColorHex}10`,
                                  }}
                                >
                                  <motion.div
                                    className="absolute top-0 bottom-0 left-0 opacity-20"
                                    style={{ backgroundColor: tierColorHex }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{
                                      duration: 0.3,
                                      delay: index * 0.03 + 0.1,
                                    }}
                                  />

                                  <div className="relative z-10 flex items-center gap-2 px-4 py-3">
                                    <div
                                      className="h-3 w-3 rounded-full"
                                      style={{ backgroundColor: tierColorHex }}
                                    />
                                    <span className="text-sm font-medium">
                                      {tier.nameKo}
                                    </span>
                                  </div>
                                  <div className="relative z-10 px-4 py-3 text-right">
                                    <span
                                      className="font-mono text-sm font-bold"
                                      style={{ color: "var(--foreground)" }}
                                    >
                                      {count.toLocaleString()}
                                    </span>
                                  </div>
                                </motion.div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Feedback Tab */}
              <TabsContent value="feedback" className="mt-6">
                <Card className="border-border/50 relative overflow-hidden border-2 p-6">
                  <motion.div
                    className="via-secondary/5 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                  />

                  <div className="relative space-y-6">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <MessageCircle className="text-secondary h-5 w-5" />
                        <h3 className="text-xl font-bold">S35 군표 피드백</h3>
                      </div>
                      <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
                        <Badge variant="secondary" className="font-normal">
                          2025/10/26 07:34:17 기준
                        </Badge>
                        <Badge variant="secondary" className="font-normal">
                          총 {totalDifficultyFeedback.toLocaleString()}개의
                          피드백
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-2 text-sm">
                        이번 시즌에 유저분들이 작성해주신 결과입니다.
                      </p>
                    </div>

                    {/* Tables */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* 난이도 피드백 */}
                      <div className="space-y-4">
                        <h4 className="text-muted-foreground text-sm font-medium">
                          이번 시즌 군표 난이도는 어떠셨나요?
                        </h4>

                        <div className="border-border/50 space-y-0 overflow-hidden rounded-lg border">
                          <div className="bg-muted/50 border-border/50 grid grid-cols-2 border-b">
                            <div className="text-muted-foreground px-4 py-2 text-xs font-medium">
                              난이도
                            </div>
                            <div className="text-muted-foreground px-4 py-2 text-right text-xs font-medium">
                              인원
                            </div>
                          </div>

                          {difficultyFeedback.map((feedback, index) => {
                            const percentage = Math.round(
                              (feedback.value / totalDifficultyFeedback) * 100,
                            );

                            return (
                              <motion.div
                                key={feedback.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.15,
                                  delay: index * 0.03,
                                }}
                                className="border-border/50 hover:bg-primary/5 relative grid grid-cols-2 border-b transition-colors last:border-b-0"
                                style={{
                                  backgroundColor: `${feedback.color}10`,
                                }}
                              >
                                <motion.div
                                  className="absolute top-0 bottom-0 left-0 opacity-20"
                                  style={{ backgroundColor: feedback.color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{
                                    duration: 0.3,
                                    delay: index * 0.03 + 0.1,
                                  }}
                                />

                                <div className="relative z-10 flex items-center gap-2 px-4 py-3">
                                  <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: feedback.color }}
                                  />
                                  <span className="text-sm font-medium">
                                    {feedback.label}
                                  </span>
                                </div>
                                <div className="relative z-10 px-4 py-3 text-right">
                                  <span className="font-mono text-sm font-medium">
                                    {feedback.value.toLocaleString()}
                                  </span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 밸런스 피드백 */}
                      <div className="space-y-4">
                        <h4 className="text-muted-foreground text-sm font-medium">
                          이번 시즌 맵 밸런스 군표 밸런스는 어떠셨나요?
                        </h4>

                        <div className="border-border/50 space-y-0 overflow-hidden rounded-lg border">
                          <div className="bg-muted/50 border-border/50 grid grid-cols-2 border-b">
                            <div className="text-muted-foreground px-4 py-2 text-xs font-medium">
                              밸런스
                            </div>
                            <div className="text-muted-foreground px-4 py-2 text-right text-xs font-medium">
                              인원
                            </div>
                          </div>

                          {balanceFeedback.map((feedback, index) => {
                            const totalBalance = balanceFeedback.reduce(
                              (sum, item) => sum + item.value,
                              0,
                            );
                            const percentage = Math.round(
                              (feedback.value / totalBalance) * 100,
                            );

                            return (
                              <motion.div
                                key={feedback.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.15,
                                  delay: index * 0.03,
                                }}
                                className="border-border/50 hover:bg-primary/5 relative grid grid-cols-2 border-b transition-colors last:border-b-0"
                                style={{
                                  backgroundColor: `${feedback.color}10`,
                                }}
                              >
                                <motion.div
                                  className="absolute top-0 bottom-0 left-0 opacity-20"
                                  style={{ backgroundColor: feedback.color }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{
                                    duration: 0.3,
                                    delay: index * 0.03 + 0.1,
                                  }}
                                />

                                <div className="relative z-10 flex items-center gap-2 px-4 py-3">
                                  <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: feedback.color }}
                                  />
                                  <span className="text-sm font-medium">
                                    {feedback.label}
                                  </span>
                                </div>
                                <div className="relative z-10 px-4 py-3 text-right">
                                  <span className="font-mono text-sm font-medium">
                                    {feedback.value.toLocaleString()}
                                  </span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
