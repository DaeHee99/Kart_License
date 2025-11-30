"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSearch?: () => void;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  onSearch,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="relative flex-1">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="제목으로 검색..."
        className="border-primary/20 focus:border-primary/40 border-2 pl-10 transition-colors"
      />
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 transform"
          onClick={() => {
            onChange("");
            onClear?.();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
