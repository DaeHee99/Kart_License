import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const getSession = async () => {
  return false; // 임시 데이터 반환!
};

// 인증이 필요한 경로들
const protectedPaths = ["/dashboard", "/myaccount", "/settings"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 보호된 경로 확인
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (isProtectedPath) {
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (SEO files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
