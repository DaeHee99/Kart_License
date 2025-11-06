"use client";

import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import { Search } from "lucide-react";

interface SearchResultsInfoProps {
  searchQuery: string;
  resultsCount: number;
}

export function SearchResultsInfo({
  searchQuery,
  resultsCount,
}: SearchResultsInfoProps) {
  if (!searchQuery) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {resultsCount > 0 ? (
        <Card className="border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <Search className="text-primary h-4 w-4" />
            <span className="font-medium">
              검색 결과: {resultsCount}개의 게시글
            </span>
          </div>
        </Card>
      ) : (
        <Card className="border-primary/20 from-background to-primary/5 bg-gradient-to-br p-12">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Search className="text-muted-foreground mx-auto mb-4 h-12 w-12 opacity-50" />
            </motion.div>
            <p className="mb-2 text-lg">검색 결과가 없습니다</p>
            <p className="text-sm">다른 검색어를 시도해보세요</p>
          </div>
        </Card>
      )}
    </motion.div>
  );
}
