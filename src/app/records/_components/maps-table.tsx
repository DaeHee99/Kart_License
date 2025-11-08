"use client";

import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Search } from "lucide-react";
import { TIERS, TierType, MapRecord } from "@/lib/types";

interface MapsTableProps {
  filteredMaps: MapRecord[];
  selectedTier: TierType | "all";
}

export function MapsTable({ filteredMaps, selectedTier }: MapsTableProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-primary/20 overflow-hidden border-2 py-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-primary/20 bg-primary/5 border-b-2">
                <tr className="text-sm">
                  <th className="sticky left-0 z-10 bg-background p-4 text-left font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <div className="bg-primary pointer-events-none absolute inset-0 opacity-[0.05]" />
                    <span className="relative">맵 이름</span>
                  </th>
                  {(selectedTier === "all"
                    ? Object.keys(TIERS)
                    : [selectedTier]
                  ).map((tier, index) => (
                    <motion.th
                      key={tier}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="min-w-[100px] p-4 text-center font-medium"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <motion.div
                          className={`h-3 w-3 rounded-full ${TIERS[tier as TierType].color}`}
                          whileHover={{ scale: 1.5 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                          }}
                        />
                        <span>{TIERS[tier as TierType].nameKo}</span>
                      </div>
                    </motion.th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredMaps.map((map, index) => (
                    <motion.tr
                      key={map.id}
                      className={`${index === filteredMaps.length - 1 ? "" : "border-border border-b"} group hover:bg-accent cursor-pointer transition-colors duration-200`}
                    >
                      <td className="bg-background group-hover:bg-accent sticky left-0 z-10 p-4 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        <div className="flex items-center gap-3">
                          <div className="from-primary/20 to-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-br shadow-sm">
                            <Trophy className="text-primary h-5 w-5" />
                          </div>
                          <span className="min-w-[100px] font-medium">
                            {map.name}
                          </span>
                        </div>
                      </td>
                      {(selectedTier === "all"
                        ? Object.keys(TIERS)
                        : [selectedTier]
                      ).map((tier) => (
                        <td key={tier} className="p-4 text-center">
                          <Badge
                            variant="outline"
                            className="font-mono text-sm"
                          >
                            {map.tierRecords[tier as TierType]}
                          </Badge>
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      <AnimatePresence>
        {filteredMaps.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="py-12 text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <Search className="text-muted-foreground/50 mx-auto mb-4 h-16 w-16" />
            </motion.div>
            <p className="text-muted-foreground">검색 결과가 없습니다</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
