"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "@/components/tier-badge";
import { MOCK_CURRENT_USER } from "@/lib/mock-data";
import { TIERS, TierType } from "@/lib/types";
import { motion } from "motion/react";
import {
  User,
  Lock,
  Camera,
  Save,
  TrendingUp,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsContents,
} from "@/components/ui/shadcn-io/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TierHistoryItem {
  date: string;
  tier: string;
  value: number;
}

interface MeasurementHistoryItem {
  id: string;
  date: string;
  tier: TierType;
  maps: number;
  season: string;
}

interface SeasonRecord {
  season: string;
  tier: TierType;
  value: number;
}

// 시즌별 색상 정의
const SEASON_COLORS: { [key: string]: { bg: string; border: string } } = {
  S35: { bg: "bg-blue-500/10", border: "border-blue-500" },
  S29: { bg: "bg-purple-500/10", border: "border-purple-500" },
  S18: { bg: "bg-gray-500/10", border: "border-gray-500" },
  S17: { bg: "bg-green-500/10", border: "border-green-500" },
};

// 아바타 옵션
const AVATAR_OPTIONS = [
  { id: "1", emoji: "🐻", color: "bg-red-100" },
  { id: "2", emoji: "😡", color: "bg-pink-100" },
  { id: "3", emoji: "😎", color: "bg-yellow-100" },
  { id: "4", emoji: "🥷", color: "bg-gray-100" },
  { id: "5", emoji: "😤", color: "bg-orange-100" },
  { id: "6", emoji: "🐵", color: "bg-red-200" },
  { id: "7", emoji: "😍", color: "bg-pink-200" },
  { id: "8", emoji: "🤓", color: "bg-blue-100" },
  { id: "9", emoji: "🤢", color: "bg-green-100" },
  { id: "10", emoji: "👽", color: "bg-green-200" },
  { id: "11", emoji: "😏", color: "bg-blue-200" },
  { id: "12", emoji: "🥳", color: "bg-purple-100" },
  { id: "13", emoji: "😺", color: "bg-purple-200" },
  { id: "14", emoji: "👾", color: "bg-indigo-100" },
  { id: "15", emoji: "🐶", color: "bg-orange-200" },
  { id: "16", emoji: "🦊", color: "bg-red-300" },
];

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("progress");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [nickname, setNickname] = useState(MOCK_CURRENT_USER.nickname);
  const [selectedAvatar, setSelectedAvatar] = useState("1");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 최근 측정 정보
  const latestMeasurement = {
    season: "S35",
    date: "2025-10-25",
    time: "14:30",
  };

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

  const handleSave = () => {
    // Save logic here
    setShowEditProfile(false);
  };

  if (showEditProfile) {
    return (
      <div className="from-primary/5 via-background to-background min-h-screen bg-linear-to-b pb-24">
        <div className="px-4 py-6">
          <div className="mx-auto max-w-2xl space-y-6">
            {/* Header */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEditProfile(false)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">정보 수정</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  프로필 정보를 수정하세요
                </p>
              </div>
            </motion.div>

            {/* Profile Picture Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-primary/20 relative overflow-hidden border-2 p-6">
                <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl" />
                <h3 className="mb-4 font-bold">프로필 사진 변경</h3>
                <div className="from-primary/10 to-primary/5 border-primary/20 mb-4 rounded-lg border bg-linear-to-r p-4 text-center text-sm">
                  원하는 프로필 사진을 하나 선택하세요.
                </div>
                <RadioGroup
                  value={selectedAvatar}
                  onValueChange={setSelectedAvatar}
                >
                  <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-8">
                    {AVATAR_OPTIONS.map((avatar, index) => (
                      <motion.div
                        key={avatar.id}
                        className="flex flex-col items-center gap-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <RadioGroupItem
                          value={avatar.id}
                          id={`avatar-${avatar.id}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`avatar-${avatar.id}`}
                          className={`h-14 w-14 rounded-full ${avatar.color} flex cursor-pointer items-center justify-center text-2xl transition-all ${
                            selectedAvatar === avatar.id
                              ? "ring-primary scale-110 shadow-lg ring-4"
                              : "hover:scale-105 hover:shadow-md"
                          }`}
                        >
                          {avatar.emoji}
                        </Label>
                      </motion.div>
                    ))}
                  </div>
                </RadioGroup>
              </Card>
            </motion.div>

            {/* Nickname Change */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-primary/20 border-2 p-6">
                <h3 className="mb-4 font-bold">닉네임 변경</h3>
                <div>
                  <Label
                    htmlFor="nickname"
                    className="mb-2 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    닉네임
                  </Label>
                  <Input
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력하세요"
                    className="border-primary/20"
                  />
                </div>
              </Card>
            </motion.div>

            {/* Password Change */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-primary/20 border-2 p-6">
                <h3 className="mb-4 font-bold">비밀번호 변경</h3>
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="current-password"
                      className="mb-2 flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      현재 비밀번호
                    </Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="현재 비밀번호를 입력하세요"
                      className="border-primary/20"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="new-password"
                      className="mb-2 flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />새 비밀번호
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="새 비밀번호를 입력하세요"
                      className="border-primary/20"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="confirm-password"
                      className="mb-2 flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      비밀번호 확인
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="비밀번호를 다시 입력하세요"
                      className="border-primary/20"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={handleSave}
                className="w-full shadow-lg"
                size="lg"
              >
                <Save className="mr-2 h-4 w-4" />
                변경사항 저장
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="from-primary/5 via-background to-background min-h-screen bg-linear-to-b pb-24">
      <div className="px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="from-primary/10 via-primary/5 absolute inset-0 -z-10 rounded-2xl bg-linear-to-r to-transparent blur-3xl" />
            <Card className="border-primary/20 relative overflow-hidden border-2 p-6">
              <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl" />
              <div className="bg-primary/5 pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full blur-3xl" />
              <div className="relative flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="from-primary to-primary/60 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br shadow-lg"
                >
                  <User className="text-primary-foreground h-8 w-8" />
                </motion.div>
                <div className="flex-1">
                  <motion.h1
                    className="mb-2 text-3xl font-bold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    마이페이지
                  </motion.h1>
                  <motion.p
                    className="text-muted-foreground text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    나의 군 변화와 측정 기록을 확인하세요
                  </motion.p>
                </div>
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  <Sparkles className="text-primary h-6 w-6" />
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Profile Summary Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-primary/20 relative overflow-hidden border-2">
              {/* Background Pattern */}
              <div className="from-primary/5 to-primary/10 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent" />
              <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl" />

              <div className="relative p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <motion.div
                    className="relative shrink-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Avatar className="border-background h-20 w-20 border-4 shadow-lg">
                      <AvatarFallback
                        className={`text-3xl ${AVATAR_OPTIONS[0].color}`}
                      >
                        {AVATAR_OPTIONS[0].emoji}
                      </AvatarFallback>
                    </Avatar>
                    <div className="border-background absolute -right-1 -bottom-1 h-6 w-6 rounded-full border-4 bg-green-500" />
                  </motion.div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h2 className="mb-3 truncate text-2xl font-bold">
                      {MOCK_CURRENT_USER.nickname}
                    </h2>

                    <div className="mb-2 flex items-start gap-3">
                      {MOCK_CURRENT_USER.currentTier && (
                        <TierBadge
                          tier={MOCK_CURRENT_USER.currentTier}
                          size="md"
                          showLabel={false}
                        />
                      )}
                      <div className="flex flex-col gap-1.5">
                        <Badge variant="outline" className="w-fit">
                          {MOCK_CURRENT_USER.currentTier &&
                            TIERS[MOCK_CURRENT_USER.currentTier].nameKo}
                        </Badge>
                        <Badge variant="secondary" className="w-fit font-mono">
                          {latestMeasurement.season}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm">
                      최근 측정: {latestMeasurement.date}{" "}
                      {latestMeasurement.time}
                    </p>
                  </div>

                  {/* Edit Button */}
                  <Button
                    variant="outline"
                    onClick={() => setShowEditProfile(true)}
                    className="hidden shrink-0 sm:flex"
                  >
                    프로필 수정
                  </Button>
                </div>

                {/* Mobile Edit Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowEditProfile(true)}
                  className="mt-4 w-full sm:hidden"
                >
                  프로필 수정
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="bg-muted rounded-lg p-[3px]">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="progress">군 변화</TabsTrigger>
                  <TabsTrigger value="seasons">시즌별 최고 기록</TabsTrigger>
                  <TabsTrigger value="history">측정 기록</TabsTrigger>
                </TabsList>
              </div>

              <TabsContents className="mt-4">
                {/* Tier Progress Tab */}
                <TabsContent value="progress" className="space-y-4">
                  <Card className="border-primary/20 p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <TrendingUp className="text-primary h-5 w-5" />
                      <h3 className="font-bold">군 변화 그래프</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={tierHistory}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                        />
                        <XAxis
                          dataKey="date"
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                          domain={[0, 7]}
                          ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
                          tickFormatter={(value) => {
                            const tiers = [
                              "",
                              "bronze",
                              "silver",
                              "gold",
                              "platinum",
                              "diamond",
                              "master",
                              "elite",
                            ];
                            return (
                              TIERS[tiers[value] as TierType]?.nameKo || ""
                            );
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "var(--foreground)" }}
                          formatter={(value: unknown) => {
                            if (typeof value === "number") {
                              const tiers = [
                                "",
                                "bronze",
                                "silver",
                                "gold",
                                "platinum",
                                "diamond",
                                "master",
                                "elite",
                              ];
                              return [
                                TIERS[tiers[value] as TierType]?.nameKo || "",
                                "군",
                              ];
                            }
                            return ["", ""];
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="var(--primary)"
                          strokeWidth={3}
                          dot={{
                            fill: "var(--primary)",
                            r: 5,
                            strokeWidth: 2,
                            stroke: "var(--background)",
                          }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    <div className="from-primary/10 to-primary/5 border-primary/20 mt-6 rounded-lg border bg-linear-to-r p-4">
                      <p className="text-center text-sm">
                        최근 1개월 동안{" "}
                        <span className="text-primary font-bold">2단계</span>{" "}
                        상승했습니다! 🎉
                      </p>
                    </div>
                  </Card>
                </TabsContent>

                {/* Measurement History Tab */}
                <TabsContent value="history" className="space-y-4">
                  <Card className="border-primary/20 p-6">
                    <h3 className="mb-4 font-bold">나의 측정 기록</h3>
                    <div className="space-y-3">
                      {measurements.map((measurement, index) => {
                        const seasonColor =
                          SEASON_COLORS[measurement.season] ||
                          SEASON_COLORS["S35"];
                        return (
                          <motion.div
                            key={measurement.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{
                              scale: 1.02,
                              translateX: 4,
                              transition: { duration: 0.2 },
                            }}
                            className={`flex items-center justify-between rounded-lg border-2 p-4 ${seasonColor.border} ${seasonColor.bg} cursor-pointer transition-shadow duration-200 hover:shadow-lg`}
                          >
                            <div className="flex items-center gap-4">
                              <TierBadge
                                tier={measurement.tier as TierType}
                                size="sm"
                                showLabel={false}
                              />
                              <div>
                                <div className="mb-1 flex items-center gap-2">
                                  <Badge variant="outline" className="gap-1">
                                    <div
                                      className={`h-2 w-2 rounded-full ${TIERS[measurement.tier as keyof typeof TIERS].color}`}
                                    />
                                    {
                                      TIERS[
                                        measurement.tier as keyof typeof TIERS
                                      ].nameKo
                                    }
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className="font-mono"
                                  >
                                    {measurement.season}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                  {measurement.date}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {measurement.maps}개 맵
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </Card>
                </TabsContent>

                {/* Season Best Records Tab */}
                <TabsContent value="seasons" className="space-y-4">
                  <Card className="border-primary/20 p-6">
                    <h3 className="mb-4 font-bold">시즌별 최고 기록 그래프</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={seasonRecords}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border)"
                        />
                        <XAxis
                          dataKey="season"
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                          domain={[0, 7]}
                          ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
                          tickFormatter={(value) => {
                            const tiers = [
                              "",
                              "bronze",
                              "silver",
                              "gold",
                              "platinum",
                              "diamond",
                              "master",
                              "elite",
                            ];
                            return (
                              TIERS[tiers[value] as TierType]?.nameKo || ""
                            );
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "var(--foreground)" }}
                          formatter={(value: unknown) => {
                            if (typeof value === "number") {
                              const tiers = [
                                "",
                                "bronze",
                                "silver",
                                "gold",
                                "platinum",
                                "diamond",
                                "master",
                                "elite",
                              ];
                              return [
                                TIERS[tiers[value] as TierType]?.nameKo || "",
                                "군",
                              ];
                            }
                            return ["", ""];
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{
                            fill: "#10b981",
                            r: 5,
                            strokeWidth: 2,
                            stroke: "var(--background)",
                          }}
                          activeDot={{ r: 7 }}
                          connectNulls={true}
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    {/* Season Records List */}
                    <div className="mt-6 space-y-3">
                      {seasonRecords.map((record, index) => {
                        const seasonColor =
                          SEASON_COLORS[record.season] || SEASON_COLORS["S35"];
                        return (
                          <motion.div
                            key={record.season}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{
                              scale: 1.02,
                              translateX: 4,
                              transition: { duration: 0.2 },
                            }}
                            className={`flex items-center justify-between rounded-lg border-2 p-4 ${seasonColor.border} ${seasonColor.bg} cursor-pointer transition-shadow duration-200 hover:shadow-lg`}
                          >
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="secondary"
                                className="px-3 py-1 font-mono text-base"
                              >
                                {record.season}
                              </Badge>
                              <TierBadge tier={record.tier} size="sm" />
                              <span className="text-muted-foreground text-sm">
                                2025-10-25 14:30
                              </span>
                            </div>
                            <div
                              className={`h-2 w-2 rounded-full ${TIERS[record.tier].color}`}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  </Card>
                </TabsContent>
              </TabsContents>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
