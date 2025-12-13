import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 인증이 필요한 경로들
const protectedPaths = ["/mypage"];
const adminPaths = ["/admin"]; // 관리자만 접근 가능한 경로 (role === 1)
const staffPaths = ["/feedback"]; // 운영진 이상 접근 가능한 경로 (role >= 1)
// 로그인된 상태에서는 접근 불가한 경로들 (auth 페이지)
const authOnlyPaths = ["/auth"];

// 헬퍼 함수: 토큰 검증 API 호출
async function verifyTokenWithAPI(
  request: NextRequest,
  token: string,
): Promise<{ isAuth: boolean; role?: number } | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.url;
    const authUrl = new URL("/api/user/auth", baseUrl);
    const authResponse = await fetch(authUrl.toString(), {
      headers: {
        cookie: `token=${token}`,
      },
    });

    if (!authResponse.ok) {
      return null;
    }

    const authData = await authResponse.json();
    return authData.isAuth ? authData : null;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// 헬퍼 함수: 쿠키 삭제 및 리다이렉트 생성
function createRedirectWithDeletedCookie(
  url: string,
  requestUrl: string,
): NextResponse {
  const response = NextResponse.redirect(new URL(url, requestUrl));
  response.cookies.delete("token");
  return response;
}

// 헬퍼 함수: 로그인 페이지로 리다이렉트 (원래 경로 저장)
function redirectToAuth(pathname: string, requestUrl: string): NextResponse {
  const redirectUrl = new URL("/auth", requestUrl);
  redirectUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(redirectUrl);
}

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
      return redirectToAuth(pathname, request.url);
    }

    const authData = await verifyTokenWithAPI(request, token);

    if (!authData) {
      // 인증 실패 시 쿠키 삭제하고 404로 리다이렉트
      return createRedirectWithDeletedCookie("/404", request.url);
    }

    if (authData.role !== 1) {
      // role이 1(관리자)이 아니면 404로 리다이렉트 (쿠키는 유지)
      return NextResponse.redirect(new URL("/404", request.url));
    }
  }

  // 운영진 이상 페이지 접근 확인 (role >= 1: 관리자(1) 또는 운영진(2))
  const isStaffPath = staffPaths.some((path) => pathname.startsWith(path));
  if (isStaffPath) {
    if (!authenticated) {
      return redirectToAuth(pathname, request.url);
    }

    const authData = await verifyTokenWithAPI(request, token);

    if (!authData) {
      // 인증 실패 시 쿠키 삭제하고 404로 리다이렉트
      return createRedirectWithDeletedCookie("/404", request.url);
    }

    if (authData.role === undefined || authData.role < 1) {
      // role이 1 미만이면 404로 리다이렉트 (쿠키는 유지)
      return NextResponse.redirect(new URL("/404", request.url));
    }
  }

  // 보호된 경로 확인
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (isProtectedPath) {
    if (!authenticated) {
      return redirectToAuth(pathname, request.url);
    }

    const authData = await verifyTokenWithAPI(request, token);

    if (!authData) {
      // 인증 실패 시 쿠키 삭제하고 로그인 페이지로 리다이렉트
      const redirectUrl = new URL("/auth", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete("token");
      return response;
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
