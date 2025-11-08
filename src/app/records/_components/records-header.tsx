"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Trophy, Sparkles } from "lucide-react";

export function RecordsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="from-primary/10 via-primary/5 absolute inset-0 -z-10 rounded-2xl bg-linear-to-r to-transparent blur-3xl" />
      <Card className="border-primary/20 relative overflow-hidden border-2 p-6">
        <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl" />
        <div className="bg-primary/5 pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full blur-3xl" />
        <div className="relative flex items-start gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="from-primary to-primary/60 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br shadow-lg"
          >
            <Trophy className="text-primary-foreground h-8 w-8" />
          </motion.div>
          <div className="flex-1">
            <motion.h1
              className="mb-2 text-3xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              S35 기록표
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              모든 맵의 군별 기준 기록을 확인하세요
            </motion.p>
          </div>
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <Sparkles className="text-primary h-6 w-6" />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
