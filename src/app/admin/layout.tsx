import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자",
  description: "카러플 군 계산기 관리자 페이지",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
