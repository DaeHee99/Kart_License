import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description: "카러플 군 계산기 로그인",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
