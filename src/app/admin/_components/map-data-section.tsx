"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { convertedMapData } from "@/lib/converted-map-data";

export function MapDataSection() {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateMapData = async () => {
    if (
      !confirm(
        "맵 데이터를 업데이트하시겠습니까? 이전 데이터는 비활성화됩니다.",
      )
    ) {
      return;
    }

    setIsUpdating(true);
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
        toast.success(
          `맵 데이터 업데이트 성공! (시즌 ${data.data.season}, ${data.data.mapsCount}개 맵)`,
        );
      } else {
        toast.error(data.error || "맵 데이터 업데이트 실패");
      }
    } catch (error) {
      console.error("Map initialization error:", error);
      toast.error("맵 데이터 업데이트 중 오류가 발생했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="border-yellow-500/20 bg-yellow-500/5 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
            <Database className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="mb-1 font-bold">맵 데이터 업데이트</h3>
            <p className="text-muted-foreground mb-3 text-sm">
              시즌 36 기준 실제 맵 데이터 (79개)를 데이터베이스에 저장합니다.
              <br />
              <span className="text-yellow-600">
                ⚠️ 이전 데이터는 비활성화되며, 새로운 데이터가 활성화됩니다.
              </span>
            </p>
            <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
              <Badge variant="outline">루키 8개</Badge>
              <Badge variant="outline">L3 28개</Badge>
              <Badge variant="outline">L2 30개</Badge>
              <Badge variant="outline">L1 13개</Badge>
            </div>
          </div>
        </div>
        <Button
          onClick={handleUpdateMapData}
          disabled={isUpdating}
          variant="default"
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              업데이트 중...
            </>
          ) : (
            "맵 데이터 업데이트"
          )}
        </Button>
      </div>
    </Card>
  );
}
