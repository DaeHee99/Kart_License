"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { UserMapRecord, TIERS } from "@/lib/types";
import { MOCK_MAPS } from "@/lib/mock-data";

interface DetailedRecordsTableProps {
  records: UserMapRecord[];
}

export function DetailedRecordsTable({ records }: DetailedRecordsTableProps) {
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
              {records.length}/{MOCK_MAPS.length}
            </Badge>
          </div>

          <div className="border-border/50 space-y-0 overflow-hidden rounded-lg border">
            {/* Header Row */}
            <div className="bg-muted/50 border-border/50 grid grid-cols-3 border-b">
              <div className="text-muted-foreground col-span-1 px-4 py-2 text-xs font-medium">
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
              const map = MOCK_MAPS.find((m) => m.id === record.mapId);
              const tier = record.tier;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.55 + index * 0.02,
                    duration: 0.1,
                  }}
                  className={`border-border/50 hover:bg-primary/5 relative grid grid-cols-3 border-b transition-colors last:border-b-0 ${
                    tier ? `bg-linear-to-r from-transparent to-${tier}/5` : ""
                  }`}
                >
                  {/* Colored left border */}
                  {tier && (
                    <div
                      className={`absolute top-0 bottom-0 left-0 w-1 ${TIERS[tier].color}`}
                    />
                  )}

                  <div className="truncate px-4 py-3 text-sm">
                    {map?.name || "알 수 없는 맵"}
                  </div>
                  <div className="flex justify-center px-4 py-3">
                    {tier && (
                      <Badge
                        variant="outline"
                        className={`gap-1.5 border-gray-300 text-xs`}
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${TIERS[tier].color}`}
                        />
                        {TIERS[tier].nameKo}
                      </Badge>
                    )}
                  </div>
                  <div className="px-4 py-3 text-right">
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
