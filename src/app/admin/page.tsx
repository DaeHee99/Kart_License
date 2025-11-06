"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TIERS, TierType } from "@/lib/types";
import {
  MOCK_STATISTICS,
  MOCK_RECENT_MEASUREMENTS,
  getUserNickname,
} from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils-calc";
import { motion } from "motion/react";
import { Users, Activity, MessageSquare, FileText, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminPage() {
  const stats = MOCK_STATISTICS;

  // Mock user data
  const users = [
    {
      id: "user-1",
      nickname: "카트라이더Pro",
      tier: "diamond" as TierType,
      measurements: 15,
      createdAt: "2025-09-01",
    },
    {
      id: "user-2",
      nickname: "스피드킹",
      tier: "elite" as TierType,
      measurements: 28,
      createdAt: "2025-08-15",
    },
    {
      id: "user-3",
      nickname: "레이싱마스터",
      tier: "master" as TierType,
      measurements: 22,
      createdAt: "2025-09-10",
    },
    {
      id: "user-4",
      nickname: "드리프트왕",
      tier: "master" as TierType,
      measurements: 19,
      createdAt: "2025-09-05",
    },
  ];

  // Mock feedback data
  const feedbacks = [
    {
      id: "1",
      user: "카트라이더Pro",
      content: "측정 시스템이 매우 정확해요!",
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      user: "스피드킹",
      content: "군 선택 방식이 편리합니다",
      createdAt: new Date(Date.now() - 7200000),
    },
    {
      id: "3",
      user: "레이싱마스터",
      content: "모바일 UI가 깔끔하네요",
      createdAt: new Date(Date.now() - 10800000),
    },
  ];

  // Mock logs
  const logs = [
    {
      id: "1",
      type: "measurement",
      user: "부스터매니아",
      action: "군 측정 완료",
      tier: "master",
      timestamp: new Date(Date.now() - 60000),
    },
    {
      id: "2",
      type: "user",
      user: "트랙의신",
      action: "회원가입",
      timestamp: new Date(Date.now() - 180000),
    },
    {
      id: "3",
      type: "measurement",
      user: "레이서123",
      action: "군 측정 완료",
      tier: "platinum",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "4",
      type: "post",
      user: "프로게이머",
      action: "게시글 작성",
      timestamp: new Date(Date.now() - 600000),
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 py-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Shield className="text-primary h-8 w-8" />
            <div>
              <h2>관리자 페이지</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                시스템 전체를 모니터링하고 관리하세요
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
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

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-secondary/10 flex h-12 w-12 items-center justify-center rounded-full">
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

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                  <MessageSquare className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">피드백</p>
                  <p className="text-2xl font-bold">{feedbacks.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
                  <FileText className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">로그</p>
                  <p className="text-2xl font-bold">{logs.length}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">유저 정보</TabsTrigger>
              <TabsTrigger value="measurements">측정 정보</TabsTrigger>
              <TabsTrigger value="feedback">피드백</TabsTrigger>
              <TabsTrigger value="logs">로그</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-border border-b">
                      <tr className="text-sm">
                        <th className="p-4 text-left font-medium">사용자</th>
                        <th className="p-4 text-left font-medium">이메일</th>
                        <th className="p-4 text-center font-medium">군</th>
                        <th className="p-4 text-center font-medium">
                          측정 횟수
                        </th>
                        <th className="p-4 text-left font-medium">가입일</th>
                        <th className="p-4 text-center font-medium">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-border hover:bg-accent/50 border-b transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {user.nickname[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {user.nickname}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="outline" className="gap-1">
                              <div
                                className={`h-2 w-2 rounded-full ${TIERS[user.tier].color}`}
                              />
                              {TIERS[user.tier].nameKo}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            {user.measurements}
                          </td>
                          <td className="text-muted-foreground p-4 text-sm">
                            {user.createdAt}
                          </td>
                          <td className="p-4 text-center">
                            <Button variant="outline" size="sm">
                              상세
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="measurements" className="space-y-4">
              <Card className="p-6">
                <h3 className="mb-4">실시간 측정 정보</h3>
                <div className="space-y-3">
                  {MOCK_RECENT_MEASUREMENTS.map((measurement, index) => (
                    <motion.div
                      key={measurement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-border flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {getUserNickname(measurement.userId)[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <span className="font-medium">
                              {getUserNickname(measurement.userId)}
                            </span>
                            <Badge variant="outline" className="gap-1">
                              <div
                                className={`h-2 w-2 rounded-full ${TIERS[measurement.tier as keyof typeof TIERS].color}`}
                              />
                              {
                                TIERS[measurement.tier as keyof typeof TIERS]
                                  .nameKo
                              }
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {formatRelativeTime(measurement.timestamp)} •{" "}
                            {measurement.totalMaps}개 맵
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        상세
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <Card className="p-6">
                <h3 className="mb-4">사용자 피드백</h3>
                <div className="space-y-4">
                  {feedbacks.map((feedback, index) => (
                    <motion.div
                      key={feedback.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-border rounded-lg border p-4"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {feedback.user[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{feedback.user}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {formatRelativeTime(feedback.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{feedback.content}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <Card className="p-6">
                <h3 className="mb-4">시스템 로그</h3>
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-accent/50 flex items-center justify-between rounded-lg p-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            log.type === "measurement"
                              ? "default"
                              : log.type === "user"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {log.type}
                        </Badge>
                        <span className="text-sm">
                          <span className="font-medium">{log.user}</span>
                          <span className="text-muted-foreground">
                            {" "}
                            • {log.action}
                          </span>
                        </span>
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {formatRelativeTime(log.timestamp)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
