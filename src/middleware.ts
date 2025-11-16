import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 인증이 필요한 경로들
const protectedPaths = ["/mypage"];
const adminPaths = ["/admin"]; // 관리자만 접근 가능한 경로
// 로그인된 상태에서는 접근 불가한 경로들 (auth 페이지)
const authOnlyPaths = ["/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const authenticated = !!token;

  // 로그인된 상태에서 auth 페이지 접근 시 메인 페이지로 리다이렉트
  const isAuthPath = authOnlyPaths.some((path) => pathname.startsWith(path));
  if (isAuthPath && authenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 관리자 페이지 접근 확인
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));
  if (isAdminPath) {
    if (!authenticated) {
      // 로그인하지 않은 경우
      const redirectUrl = new URL("/auth", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    try {
      // /api/user/auth를 호출해서 사용자 role 확인
      // 프로덕션에서는 실제 도메인 사용, 개발환경에서는 request.url 사용
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.url;
      const authUrl = new URL("/api/user/auth", baseUrl);
      const authResponse = await fetch(authUrl.toString(), {
        headers: {
          cookie: `token=${token}`,
        },
      });

      if (!authResponse.ok) {
        // 인증 실패
        return NextResponse.redirect(new URL("/404", request.url));
      }

      const authData = await authResponse.json();

      if (!authData.isAuth || authData.role !== 1) {
        // role이 1(관리자)이 아니면 404로 리다이렉트
        return NextResponse.redirect(new URL("/404", request.url));
      }
    } catch (error) {
      console.error("Admin auth error:", error);
      return NextResponse.redirect(new URL("/404", request.url));
    }
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
