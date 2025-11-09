import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 쿠키에서 토큰을 확인하여 로그인 상태 체크
const isAuthenticated = (request: NextRequest) => {
  const token = request.cookies.get("token");
  return !!token;
};

// 인증이 필요한 경로들
const protectedPaths = ["/mypage", "/admin"];
// 로그인된 상태에서는 접근 불가한 경로들 (auth 페이지)
const authOnlyPaths = ["/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = isAuthenticated(request);

  // 로그인된 상태에서 auth 페이지 접근 시 메인 페이지로 리다이렉트
  const isAuthPath = authOnlyPaths.some((path) => pathname.startsWith(path));
  if (isAuthPath && authenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 보호된 경로 확인
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (isProtectedPath && !authenticated) {
    // 원래 가려던 페이지를 redirect 쿼리 파라미터로 전달
    const redirectUrl = new URL("/auth", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
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
