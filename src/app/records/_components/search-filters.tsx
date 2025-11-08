"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { TIERS, TierType } from "@/lib/types";

interface SearchFiltersProps {
  searchQuery: string;
  selectedTier: TierType | "all";
  onSearchChange: (query: string) => void;
  onTierChange: (tier: TierType | "all") => void;
}

export function SearchFilters({
  searchQuery,
  selectedTier,
  onSearchChange,
  onTierChange,
}: SearchFiltersProps) {
  const tierOptions: Array<{ value: TierType | "all"; label: string }> = [
    { value: "all", label: "전체" },
    ...Object.keys(TIERS).map((tier) => ({
      value: tier as TierType,
      label: TIERS[tier as TierType].nameKo,
    })),
  ];

  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="맵 이름 검색..."
              className="border-primary/20 pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {tierOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedTier === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => onTierChange(option.value)}
                className="whitespace-nowrap"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
