/**
 * Google Analytics gtag 타입 정의
 */

interface Window {
  gtag: (
    command: "config" | "event" | "js",
    targetId: string | Date,
    config?: Record<string, any>
  ) => void;
  dataLayer: any[];
}
