"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MOCK_MAPS } from "@/lib/mock-data";
import { TIERS, TierType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Sparkles, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsContents,
} from "@/components/ui/shadcn-io/tabs";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import Image from "next/image";

export default function RecordsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<TierType | "all">("all");
  const [activeTab, setActiveTab] = useState("image");
  const recordTableRef = useRef<HTMLDivElement>(null);

  const filteredMaps = MOCK_MAPS.filter((map) =>
    map.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const tierOptions: Array<{ value: TierType | "all"; label: string }> = [
    { value: "all", label: "전체" },
    ...Object.keys(TIERS).map((tier) => ({
      value: tier as TierType,
      label: TIERS[tier as TierType].nameKo,
    })),
  ];

  const downloadRecordTable = async () => {
    if (!recordTableRef.current) return;

    try {
      const dataUrl = await toPng(recordTableRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `kartrush-records-table.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("기록표 이미지가 다운로드되었습니다!");
    } catch (err) {
      console.error("Record table download failed:", err);
      toast.error("기록표 다운로드에 실패했습니다.");
    }
  };

  return (
    <div className="from-primary/5 via-background to-background min-h-screen bg-gradient-to-b pb-24">
      <div className="px-4 py-6">
        <div className="mx-auto max-w-6xl space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="from-primary/10 via-primary/5 absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r to-transparent blur-3xl" />
            <Card className="border-primary/20 relative overflow-hidden border-2 p-6">
              <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl" />
              <div className="bg-primary/5 pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full blur-3xl" />
              <div className="relative flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="from-primary to-primary/60 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg"
                >
                  <Trophy className="text-primary-foreground h-8 w-8" />
                </motion.div>
                <div className="flex-1">
                  <motion.h1
                    className="mb-2 text-3xl font-bold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    S35 기록표
                  </motion.h1>
                  <motion.p
                    className="text-muted-foreground text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    모든 맵의 군별 기준 기록을 확인하세요
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

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="bg-muted rounded-lg p-[3px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="image">기록표 이미지</TabsTrigger>
                  <TabsTrigger value="search">기록 검색</TabsTrigger>
                </TabsList>
              </div>

              <TabsContents className="mt-4">
                {/* Image Tab */}
                <TabsContent value="image" className="space-y-4">
                  {/* Download Button */}
                  <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
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
                    <Card className="border-primary/20 border-2 p-6">
                      <div ref={recordTableRef} className="bg-white">
                        {/* Full Records Table */}
                        <div className="overflow-x-auto">
                          <Image
                            src="/S35_table.png"
                            alt="S35 기록표"
                            width={1000}
                            height={1000}
                            className="h-auto w-full"
                          />
                        </div>

                        {/* Footer */}
                        <div className="mt-6 text-center">
                          <p className="text-xs text-gray-600">
                            카러플 군 계산기 제공
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Search Tab */}
                <TabsContent value="search" className="space-y-4">
                  {/* Search and Filter */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="border-primary/20 relative overflow-hidden border-2 p-4">
                      <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full blur-3xl" />
                      <div className="relative flex flex-col gap-3">
                        <div className="relative w-full">
                          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                          <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="맵 이름 검색..."
                            className="border-primary/20 pl-9"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {tierOptions.map((option) => (
                            <Button
                              key={option.value}
                              variant={
                                selectedTier === option.value
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => setSelectedTier(option.value)}
                              className="whitespace-nowrap"
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>

                  {/* Maps Table */}
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
                              <th className="p-4 text-left font-medium">
                                맵 이름
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
                                    <span>
                                      {TIERS[tier as TierType].nameKo}
                                    </span>
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
                                  className={`${index === filteredMaps.length - 1 ? "" : "border-border border-b"} hover:bg-accent cursor-pointer transition-colors duration-200`}
                                >
                                  <td className="p-4">
                                    <div className="flex items-center gap-3">
                                      <motion.div
                                        className="from-primary/20 to-primary/10 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br shadow-sm"
                                        whileHover={{ rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                      >
                                        <Trophy className="text-primary h-5 w-5" />
                                      </motion.div>
                                      <span className="font-medium">
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
                        <p className="text-muted-foreground">
                          검색 결과가 없습니다
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              </TabsContents>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
