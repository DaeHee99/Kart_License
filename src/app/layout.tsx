import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@/components/analytics";
import { PageViewTracker } from "@/components/page-view-tracker";

export const metadata: Metadata = {
  title: {
    default: "카러플 군 계산기",
    template: "%s | 카러플 군 계산기",
  },
  description: "카트라이더 러쉬플러스 군 계산기 - 군 기록 측정 및 커뮤니티",
  keywords: [
    "카러플 군 계산기",
    "카트라이더",
    "카트라이더 러쉬플러스",
    "카러플 군표",
    "카러플",
    "군 측정",
    "타임어택",
  ],
  authors: [{ name: "앵두새" }],
  creator: "앵두새",
  publisher: "앵두새",
  metadataBase: new URL("https://kartrush.mylicense.kro.kr"),
  openGraph: {
    title: "카러플 군 계산기",
    description: "카트라이더 러쉬플러스 군 계산기 - 군 기록 측정 및 커뮤니티",
    images: [
      {
        url: "/og-logo.png",
        width: 1200,
        height: 630,
        alt: "카러플 군 계산기",
      },
    ],
    url: "https://kartrush.mylicense.kro.kr",
    siteName: "카러플 군 계산기",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "카러플 군 계산기",
    description: "카트라이더 러쉬플러스 군 계산기 - 군 기록 측정 및 커뮤니티",
    images: ["/og-logo.png"],
    creator: "@kartrush",
    site: "@kartrush",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased">
        <Analytics />
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <PageViewTracker />
            <div className="bg-background text-foreground min-h-screen">
              <Header />
              <main className="pt-14 pb-16">{children}</main>
              <BottomNavigation />
              <Toaster />
              <div id="portal" />
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
