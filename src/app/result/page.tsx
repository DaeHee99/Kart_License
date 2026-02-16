"use client";

import { useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingScreen } from "./_components/loading-screen";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recordId = searchParams.get("id");

  useEffect(() => {
    if (!recordId) {
      router.replace("/measure");
    }
  }, [recordId, router]);

  const handleComplete = useCallback(() => {
    if (recordId) {
      router.replace(`/result/${recordId}`);
    }
  }, [recordId, router]);

  if (!recordId) return null;

  return <LoadingScreen duration={2500} onComplete={handleComplete} />;
}

export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ResultContent />
    </Suspense>
  );
}
