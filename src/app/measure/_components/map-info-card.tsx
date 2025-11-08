"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { MapRecord } from "@/lib/types";

interface MapInfoCardProps {
  map: MapRecord;
}

export function MapInfoCard({ map }: MapInfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.2 }}
      className="relative mb-0 space-y-4"
    >
      {/* Map Image and Name in one row */}
      <div className="flex items-center gap-4">
        {/* Map Image */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.2 }}
          className="group relative"
        >
          <div className="from-primary/30 to-secondary/30 absolute -inset-1 rounded-xl bg-linear-to-br opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
          <div className="from-muted to-muted/50 border-primary/10 relative flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-linear-to-br">
            <span className="text-muted-foreground text-xs">맵 이미지</span>
          </div>
        </motion.div>

        {/* Map Name and Difficulty */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="min-w-0 flex-1"
        >
          <h3 className="from-foreground to-foreground/70 mb-1 truncate bg-linear-to-r bg-clip-text text-xl font-bold">
            {map.name}
          </h3>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="from-primary/20 to-secondary/20 border-primary/20 bg-linear-to-r text-xs"
            >
              {map.difficulty}
            </Badge>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
