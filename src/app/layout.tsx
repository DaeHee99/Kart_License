import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "카러플 군 계산기 | KartRider Rush+ License Calculator",
  description: "카트라이더 러쉬플러스 군 계산기",
  keywords: [
    "카러플 군 계산기",
    "카트라이더",
    "카트라이더 러쉬플러스",
    "카러플 군표",
  ],
  openGraph: {
    title: "카러플 군 계산기 | KartRider Rush+ License Calculator",
    description: "카트라이더 러쉬플러스 군 계산기",
    images: ["/og-logo.png"],
    url: "https://kartrush.mylicense.kro.kr",
    siteName: "카러플 군 계산기",
    locale: "ko-KR",
    type: "website",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="bg-background text-foreground min-h-screen">
            <Header />
            <main className="pt-14 pb-16">{children}</main>
            <BottomNavigation />
            <Toaster />
            <div id="portal" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
