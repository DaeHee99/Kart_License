"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserX, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserNotFound() {
  const router = useRouter();

  return (
    <div className="from-primary/5 via-background to-background min-h-screen bg-linear-to-b pb-24">
      <div className="px-4 py-6">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-primary/20 relative overflow-hidden border-2 p-12">
              <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl" />
              <div className="bg-primary/5 pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full blur-3xl" />

              <div className="relative flex flex-col items-center text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: 0.2
                  }}
                  className="from-muted to-muted/60 mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br"
                >
                  <UserX className="text-muted-foreground h-12 w-12" />
                </motion.div>

                {/* Title */}
                <motion.h1
                  className="mb-3 text-3xl font-bold"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  유저를 찾을 수 없습니다
                </motion.h1>

                {/* Description */}
                <motion.p
                  className="text-muted-foreground mb-8 text-base"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  해당 ID의 유저가 존재하지 않거나 삭제되었습니다.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={() => router.push("/")}
                    className="gap-2"
                  >
                    <Home className="h-4 w-4" />
                    홈으로 이동
                  </Button>
                  <Button
                    onClick={() => router.back()}
                    variant="outline"
                  >
                    이전 페이지로
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
