import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "카러플 군 계산기 커뮤니티",
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
