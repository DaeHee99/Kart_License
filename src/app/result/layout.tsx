import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "측정 결과",
  description: "군 측정 결과 확인",
};

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
