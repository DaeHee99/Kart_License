"use client";

import { motion } from "motion/react";
import { Share2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ShareDialog } from "./share-dialog";
import { TierType } from "@/lib/types";
import Link from "next/link";

export function ActionButtons({ finalTier }: { finalTier: TierType }) {
  const [showShareDialog, setShowShareDialog] = useState(false);

  return (
    <>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.2 }}
        className="grid grid-cols-2 gap-3"
      >
        <Button
          onClick={() => setShowShareDialog(true)}
          size="lg"
          className="from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-0 bg-linear-to-r shadow-lg"
        >
          <Share2 className="mr-2 h-4 w-4" />
          공유하기
        </Button>
        <Link href="/statistics">
          <Button size="lg" variant="outline" className="w-full border-2">
            <BarChart3 className="mr-2 h-4 w-4" />
            통계 보기
          </Button>
        </Link>
      </motion.div>
      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        finalTier={finalTier}
      />
    </>
  );
}
