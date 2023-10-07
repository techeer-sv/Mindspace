import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)"],
};

const unprotectedRoutes = ["/"]; // 검증이 필요 없는 경로 목록
const protectedRoutes = ["/map"]; // 로그인이 필요한 페이지 목록
const publicRoutes = ["/signin", "/signup"]; // 로그인이 되면 접근할 수 없는 페이지 목록

export function middleware(request: NextRequest) {
  const token = getTokenFromCookies(request);
  const currentPath = request.nextUrl.pathname;

  if (!token && protectedRoutes.includes(currentPath)) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin"; //
    return NextResponse.redirect(url);
  }

  if (token && publicRoutes.includes(currentPath)) {
    const url = request.nextUrl.clone();
    url.pathname = "/"; //
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

function getTokenFromCookies(request: NextRequest) {
  const cookiesHeader = request.headers.get("cookie");
  if (!cookiesHeader) return null;

  const cookiesArray: [string, string][] = cookiesHeader
    .split("; ")
    .map((cookie) => {
      const [key, value] = cookie.split("=");
      return [key, value];
    });

  const cookies = new Map(cookiesArray);
  return cookies.get("accessToken");
}
