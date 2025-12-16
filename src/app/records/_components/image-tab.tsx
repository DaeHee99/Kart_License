"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import Image from "next/image";
import { createLog, LogActionType } from "@/lib/api/logs";

export function ImageTab() {
  const recordTableRef = useRef<HTMLDivElement>(null);

  const downloadRecordTable = async () => {
    if (!recordTableRef.current) return;

    try {
      const dataUrl = await toPng(recordTableRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff00",
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `카러플_S36_기록표.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("기록표 이미지가 다운로드되었습니다!");

      // 기록표 이미지 다운로드 로그 생성
      createLog({
        actionType: LogActionType.IMAGE_DOWNLOAD,
        content: "기록표 이미지 다운로드 - S36",
        metadata: {
          season: 36,
        },
      });
    } catch (err) {
      console.error("Record table download failed:", err);
      toast.error("기록표 다운로드에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Download Button */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={downloadRecordTable}
            size="lg"
            className="gap-2 shadow-lg"
          >
            <Download className="h-5 w-5" />
            기록표 이미지 다운로드
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-primary/20 border-2 p-3 pb-2 md:p-6">
          <div ref={recordTableRef}>
            {/* Full Records Table */}
            <div className="overflow-x-auto">
              <Image
                src="/S36_table.png"
                alt="S36 기록표"
                width={1000}
                height={1000}
                className="h-auto w-full"
              />
            </div>

            {/* Footer */}
            <div className="my-2 text-center md:my-4">
              <p className="text-xs text-gray-600">카러플 군 계산기 제공</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
