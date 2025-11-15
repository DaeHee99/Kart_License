import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "통계",
  description: "카러플 군 계산기 전체 통계",
};

export default function StatisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
