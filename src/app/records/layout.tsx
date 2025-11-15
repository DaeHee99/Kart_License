import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "기록표",
  description: "카러플 군 전체 기록표",
};

export default function RecordsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
