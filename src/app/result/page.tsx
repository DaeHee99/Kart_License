"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingScreen } from "./_components/loading-screen";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recordId = searchParams.get("id");

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // recordId가 없으면 측정 페이지로 리디렉션
    if (!recordId) {
      router.replace("/measure");
      return;
    }

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
  }, [recordId, router]);

  useEffect(() => {
    if (isComplete && recordId) {
      router.replace(`/result/${recordId}`);
    }
  }, [isComplete, recordId, router]);

  return <LoadingScreen loadingProgress={loadingProgress} />;
}

export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingScreen loadingProgress={0} />}>
      <ResultContent />
    </Suspense>
  );
}
