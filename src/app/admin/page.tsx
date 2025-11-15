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
import { Users, Activity, MessageSquare, FileText, Shield, Database, Loader2, Megaphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { convertedMapData } from "@/lib/converted-map-data";
import { useState } from "react";
import { toast } from "sonner";
import { AnnouncementForm } from "./_components/announcement-form";

export default function AdminPage() {
  const stats = MOCK_STATISTICS;
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitializeMapData = async () => {
    if (!confirm("맵 데이터를 초기화하시겠습니까? 이전 데이터는 비활성화됩니다.")) {
      return;
    }

    setIsInitializing(true);
    try {
      const response = await fetch("/api/maps/init", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(convertedMapData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`맵 데이터 초기화 성공! (시즌 ${data.data.season}, ${data.data.mapsCount}개 맵)`);
      } else {
        toast.error(data.error || "맵 데이터 초기화 실패");
      }
    } catch (error) {
      console.error("Map initialization error:", error);
      toast.error("맵 데이터 초기화 중 오류가 발생했습니다.");
    } finally {
      setIsInitializing(false);
    }
  };

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

          {/* Database Management */}
          <Card className="border-yellow-500/20 bg-yellow-500/5 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
                  <Database className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="mb-1 font-bold">맵 데이터 초기화</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    시즌 35 기준 실제 맵 데이터 (78개)를 데이터베이스에 저장합니다.
                    <br />
                    <span className="text-yellow-600">
                      ⚠️ 이전 데이터는 비활성화되며, 새로운 데이터가 활성화됩니다.
                    </span>
                  </p>
                  <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline">루키 8개</Badge>
                    <Badge variant="outline">L3 27개</Badge>
                    <Badge variant="outline">L2 30개</Badge>
                    <Badge variant="outline">L1 13개</Badge>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleInitializeMapData}
                disabled={isInitializing}
                variant="default"
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    초기화 중...
                  </>
                ) : (
                  "맵 데이터 초기화"
                )}
              </Button>
            </div>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="users">유저 정보</TabsTrigger>
              <TabsTrigger value="measurements">측정 정보</TabsTrigger>
              <TabsTrigger value="feedback">피드백</TabsTrigger>
              <TabsTrigger value="logs">로그</TabsTrigger>
              <TabsTrigger value="announcement">
                <Megaphone className="mr-2 h-4 w-4" />
                공지사항
              </TabsTrigger>
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

            <TabsContent value="announcement" className="space-y-4">
              <AnnouncementForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
