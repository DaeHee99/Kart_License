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

    const response = await fetch(`${baseUrl}/api/posts/${id}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      const post = data.data;

      return {
        title: post.title + " 게시글 | 카러플 군 계산기",
        description: post.content.slice(0, 160),
        openGraph: {
          title: post.title + " 게시글 | 카러플 군 계산기",
          description: post.content.slice(0, 160),
          type: "article",
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch post metadata:", error);
  }

  return {
    title: "게시글",
    description: "카러플 군 계산기 커뮤니티 게시글",
  };
}

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
