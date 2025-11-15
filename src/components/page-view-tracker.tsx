"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageview } from "@/lib/gtag";

/**
 * 페이지뷰 추적 컴포넌트
 * pathname과 document.title 변경을 감지하여 GA에 페이지뷰 이벤트 전송
 */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 프로덕션 환경에서만 추적
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    // pathname이 변경될 때마다 페이지뷰 전송
    // document.title은 Next.js metadata에 의해 이미 업데이트됨
    const handlePageView = () => {
      const title = document.title;
      pageview(pathname, title);
    };

    // 짧은 딜레이 후 실행 (title 업데이트 보장)
    const timeoutId = setTimeout(handlePageView, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  // MutationObserver로 title 변경 감지
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    const titleObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const title = document.title;
          // title이 변경되었을 때 페이지뷰 전송
          pageview(pathname, title);
        }
      });
    });

    // <title> 태그 변경 감지
    const titleElement = document.querySelector("head > title");
    if (titleElement) {
      titleObserver.observe(titleElement, {
        childList: true,
      });
    }

    return () => {
      titleObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
