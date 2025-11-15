import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "군 측정",
  description: "카러플 군 측정하기",
};

export default function MeasureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
