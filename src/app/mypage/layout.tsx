import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "내 프로필 및 기록 관리",
};

export default function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
