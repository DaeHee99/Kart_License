"use client";

import { useState } from "react";
import { MOCK_MAPS } from "@/lib/mock-data";
import { TierType } from "@/lib/types";
import { SearchFilters } from "./search-filters";
import { MapsTable } from "./maps-table";

export function SearchTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<TierType | "all">("all");

  const filteredMaps = MOCK_MAPS.filter((map) =>
    map.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
