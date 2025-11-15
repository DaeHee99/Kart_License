"use client";

import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";

/**
 * Google Analytics 스크립트 컴포넌트
 * Next.js Script 컴포넌트를 사용하여 최적화된 로딩
 */
export function Analytics() {
  // 프로덕션 환경에서만 GA 로드
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      {/* Google Analytics 스크립트 */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
