"use client";

import { Card } from "@/components/ui/card";
import {
  Users,
  Activity,
  MessageSquare,
  FileText,
  Loader2,
} from "lucide-react";
import { useAdminStats } from "@/hooks/use-admin";
import { animate } from "motion/react";
import { useEffect, useState } from "react";

// 숫자 카운트업 애니메이션 컴포넌트
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(Math.floor(latest));
      },
    });

    return () => controls.stop();
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}

export function QuickStats() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
            <Users className="text-primary h-6 w-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">총 사용자</p>
            <p className="text-2xl font-bold">
              <AnimatedNumber value={stats?.totalUsers || 0} />
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
              <AnimatedNumber value={stats?.totalMeasurements || 0} />
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
            <p className="text-2xl font-bold">
              <AnimatedNumber value={stats?.totalFeedbacks || 0} />
            </p>
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
            <p className="text-2xl font-bold">
              <AnimatedNumber value={stats?.totalLogs || 0} />
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
