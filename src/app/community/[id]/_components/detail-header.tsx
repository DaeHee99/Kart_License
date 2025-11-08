"use client";

import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import { FileText, Sparkles } from "lucide-react";

export function DetailHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="from-primary/10 via-primary/5 absolute inset-0 -z-10 hidden rounded-2xl bg-linear-to-r to-transparent blur-3xl md:block" />
      <Card className="border-primary/20 relative overflow-hidden border-2 p-6">
        <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 hidden h-40 w-40 rounded-full blur-3xl md:block" />
        <div className="bg-primary/5 pointer-events-none absolute bottom-0 left-0 hidden h-32 w-32 rounded-full blur-3xl md:block" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="from-primary to-primary/60 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br shadow-lg"
            >
              <FileText className="text-primary-foreground h-7 w-7" />
            </motion.div>
            <div>
              <motion.h1
                className="text-2xl font-bold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                게시글 상세
              </motion.h1>
              <motion.p
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                게시글의 상세 내용을 확인하세요
              </motion.p>
            </div>
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
