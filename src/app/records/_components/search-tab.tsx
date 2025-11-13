"use client";

import { useState } from "react";
import { TierType } from "@/lib/types";
import { SearchFilters } from "./search-filters";
import { MapsTable } from "./maps-table";
import { useLatestMaps } from "@/hooks/use-records";
import { Loader2 } from "lucide-react";

export function SearchTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<TierType | "all">("all");

  // 실제 데이터 요청
  const { maps, isLoading, error } = useLatestMaps();

  const filteredMaps = maps.filter((map) =>
    map.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">데이터를 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <SearchFilters
        searchQuery={searchQuery}
        selectedTier={selectedTier}
        onSearchChange={setSearchQuery}
        onTierChange={setSelectedTier}
      />

      {/* Maps Table */}
      <MapsTable filteredMaps={filteredMaps} selectedTier={selectedTier} />
    </div>
  );
}
