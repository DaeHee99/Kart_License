import type { Metadata } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "카러플 군 계산기 | Kart Rush+ License Calculator",
  description: "카트라이더 러쉬플러스 라이센스 군 계산기",
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
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
