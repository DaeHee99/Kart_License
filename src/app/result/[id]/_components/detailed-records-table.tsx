"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { UserMapRecord, TIERS, TierType } from "@/lib/types";

interface RecordWithMapName {
  mapId?: string;
  mapName?: string;
  difficulty?: "루키" | "L3" | "L2" | "L1";
  record?: string;
  tier?: TierType;
}

interface DetailedRecordsTableProps {
  records: RecordWithMapName[];
  totalMaps?: number;
}

// Difficulty 뱃지 색상 매핑
const DIFFICULTY_COLORS = {
  루키: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  L3: "bg-green-500/10 text-green-600 border-green-500/30",
  L2: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  L1: "bg-red-500/10 text-red-600 border-red-500/30",
};

export function DetailedRecordsTable({
  records,
  totalMaps,
}: DetailedRecordsTableProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.2 }}
    >
      <Card className="border-border/50 relative overflow-hidden border-2 p-6">
        {/* Subtle shimmer */}
        <motion.div
          className="via-secondary/5 absolute inset-0 bg-linear-to-r from-transparent to-transparent"
          animate={{ x: ["-200%", "200%"] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
        />

        <div className="relative">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Trophy className="text-secondary h-5 w-5" />
              상세 기록
            </h3>
            <Badge variant="secondary" className="font-mono">
              {records.length}/{totalMaps || records.length}
            </Badge>
          </div>

          <div className="border-border/50 space-y-0 overflow-hidden rounded-lg border">
            {/* Header Row */}
            <div className="bg-muted/50 border-border/50 grid grid-cols-[minmax(0,1fr)_100px_80px] border-b">
              <div className="text-muted-foreground px-4 py-2 text-xs font-medium">
                맵 이름
              </div>
              <div className="text-muted-foreground px-4 py-2 text-center text-xs font-medium">
                군
              </div>
              <div className="text-muted-foreground px-4 py-2 text-right text-xs font-medium">
                기록
              </div>
            </div>

            {/* Data Rows */}
            {records.map((record, index) => {
              const tier = record.tier;
              const mapName = record.mapName || "알 수 없는 맵";
              const difficulty = record.difficulty;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.55 + index * 0.02,
                    duration: 0.1,
                  }}
                  className={`border-border/50 hover:bg-primary/5 relative grid grid-cols-[minmax(0,1fr)_100px_80px] border-b transition-colors last:border-b-0 ${
                    tier ? `bg-linear-to-r from-transparent to-${tier}/5` : ""
                  }`}
                >
                  {/* Colored left border */}
                  {tier && (
                    <div
                      className={`absolute top-0 bottom-0 left-0 w-1 ${TIERS[tier].color}`}
                    />
                  )}

                  <div className="flex min-w-0 items-center gap-2 px-4 py-3">
                    {difficulty && (
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-xs font-semibold ${DIFFICULTY_COLORS[difficulty]}`}
                      >
                        {difficulty}
                      </Badge>
                    )}
                    <span className="truncate text-sm">{mapName}</span>
                  </div>
                  <div className="flex items-center justify-center px-4 py-3">
                    {tier && (
                      <Badge
                        variant="outline"
                        className={`shrink-0 gap-1.5 border-gray-300 text-xs`}
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${TIERS[tier].color}`}
                        />
                        {TIERS[tier].nameKo}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-end py-3 pr-2">
                    <span className="text-muted-foreground font-mono text-sm">
                      {record.record || "-"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
