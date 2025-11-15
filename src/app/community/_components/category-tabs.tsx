"use client";

import { PostCategory } from "@/lib/types";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

interface CategoryTabsProps {
  selectedCategory: PostCategory | "all";
  onCategoryChange: (category: PostCategory | "all") => void;
}

const CATEGORIES: { value: PostCategory | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "notice", label: "공지" },
  { value: "general", label: "일반" },
  { value: "question", label: "질문" },
];

export function CategoryTabs({
  selectedCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex gap-2 overflow-x-auto p-2"
    >
      {CATEGORIES.map((category) => (
        <Badge
          key={category.value}
          variant={selectedCategory === category.value ? "default" : "outline"}
          className="cursor-pointer px-4 py-2 text-sm whitespace-nowrap transition-all hover:scale-105"
          onClick={() => onCategoryChange(category.value)}
        >
          {category.label}
        </Badge>
      ))}
    </motion.div>
  );
}
