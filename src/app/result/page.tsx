"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "./_components/loading-screen";

export default function ResultPage() {
  const router = useRouter();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Animate loading progress from 0 to 100 over 2.5 seconds
    const duration = 2500; // 2.5 seconds
    const interval = 16; // ~60fps
    const increment = (100 / duration) * interval;

    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isComplete) {
      router.replace("/result/1");
    }
  }, [isComplete, router]);

  return <LoadingScreen loadingProgress={loadingProgress} />;
}
