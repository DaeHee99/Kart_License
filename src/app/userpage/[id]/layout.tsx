import type { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/users/${id}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      const user = data.data;

      return {
        title: user.name + " 프로필 | 카러플 군 계산기",
        description: `${user.name}님의 프로필`,
        openGraph: {
          title: user.name + " 프로필 | 카러플 군 계산기",
          description: `${user.name}님의 프로필`,
          images: user.image ? [user.image] : undefined,
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch user metadata:", error);
  }

  return {
    title: "유저 페이지",
    description: "카러플 군 계산기 유저 페이지",
  };
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
