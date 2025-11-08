"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";

interface InputHeaderProps {
  currentMapNumber: number;
  totalMaps: number;
  progress: number;
  onCancel: () => void;
}

export function InputHeader({
  currentMapNumber,
  totalMaps,
  progress,
  onCancel,
}: InputHeaderProps) {
  return (
    <div className="bg-background/95 border-border sticky top-0 z-40 border-b px-4 py-3 shadow-sm backdrop-blur-md">
      {/* Subtle glow effect */}
      <div className="from-primary/5 to-secondary/5 absolute inset-0 bg-linear-to-r via-transparent opacity-50" />

      <div className="relative mx-auto max-w-2xl space-y-3">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              취소
            </Button>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="from-primary to-secondary bg-linear-to-r bg-clip-text text-sm font-medium text-transparent"
          >
            {currentMapNumber} / {totalMaps}
          </motion.span>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="origin-left"
        >
          <Progress value={progress} className="h-2" />
        </motion.div>
      </div>
    </div>
  );
}
