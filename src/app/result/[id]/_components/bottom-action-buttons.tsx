"use client";

import { Button } from "@/components/ui/button";
import { Home, RotateCcw } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function BottomActionButtons() {
  const router = useRouter();

  const onRestart = () => {
    sessionStorage.removeItem("measurementRecords");
    router.push("/measure");
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.2 }}
      className="grid grid-cols-2 gap-3 pt-4"
    >
      <Button
        onClick={onRestart}
        variant="outline"
        size="lg"
        className="border-2"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        다시 측정
      </Button>
      <Link href="/">
        <Button variant="outline" size="lg" className="w-full border-2">
          <Home className="mr-2 h-4 w-4" />
          홈으로
        </Button>
      </Link>
    </motion.div>
  );
}
