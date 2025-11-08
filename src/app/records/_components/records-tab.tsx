"use client";

import { motion } from "motion/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TabsContents,
} from "@/components/ui/shadcn-io/tabs";
import { ImageTab } from "./image-tab";
import { SearchTab } from "./search-tab";
import { FileText, SearchCheck } from "lucide-react";
import { useState } from "react";

export function RecordsTab() {
  const [activeTab, setActiveTab] = useState("image");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid h-12 w-full grid-cols-2">
          <TabsTrigger value="image" className="gap-2">
            <FileText className="h-4 w-4" />
            기록표 이미지
          </TabsTrigger>
          <TabsTrigger value="search" className="gap-2">
            <SearchCheck className="h-4 w-4" />
            기록 검색
          </TabsTrigger>
        </TabsList>
        <TabsContents>
          {/* Image Tab */}
          <TabsContent value="image" className="mt-6">
            <ImageTab />
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="mt-6">
            <SearchTab />
          </TabsContent>
        </TabsContents>
      </Tabs>
    </motion.div>
  );
}
