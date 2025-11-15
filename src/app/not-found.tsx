"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="from-primary/5 via-background to-background flex min-h-screen items-center justify-center bg-linear-to-b p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 bg-card/50 p-8 text-center shadow-lg backdrop-blur-sm">
          {/* 404 Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6 flex justify-center"
          >
            <div className="bg-primary/10 text-primary relative rounded-full p-6">
              <Search className="h-16 w-16" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-destructive/10 text-destructive absolute -top-2 -right-2 rounded-full px-3 py-1 text-sm font-bold"
              >
                404
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-2 text-2xl font-bold"
          >
            페이지를 찾을 수 없습니다
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground mb-8"
          >
            요청하신 페이지가 존재하지 않거나
            <br />
            이동되었을 수 있습니다.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-3"
          >
            <Button
              onClick={() => router.push("/")}
              className="w-full gap-2"
              size="lg"
            >
              <Home className="h-5 w-5" />
              홈으로 돌아가기
            </Button>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
              size="lg"
            >
              이전 페이지로
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
