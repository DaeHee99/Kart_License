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

    const response = await fetch(`${baseUrl}/api/records/${id}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      const record = data.data;

      if (!record.user) {
        return {
          title: `S${record.season} 측정 결과 | 카러플 군 계산기`,
          description: `${record.finalTier} - ${record.records.length}개 맵 측정 완료`,
          openGraph: {
            title: `S${record.season} 측정 결과 | 카러플 군 계산기`,
            description: `${record.finalTier} - ${record.records.length}개 맵 측정 완료`,
          },
        };
      }

      return {
        title: `${record.user.name}님의 S${record.season} 측정 결과 | 카러플 군 계산기`,
        description: `${record.finalTier} - ${record.records.length}개 맵 측정 완료`,
        openGraph: {
          title: `${record.user.name}님의 S${record.season} 측정 결과 | 카러플 군 계산기`,
          description: `${record.finalTier} - ${record.records.length}개 맵 측정 완료`,
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch record metadata:", error);
  }

  return {
    title: "측정 결과",
    description: "카러플 군 계산기 측정 결과",
  };
}

export default function ResultDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
