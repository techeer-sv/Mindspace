import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/constants/common";
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)"],
};

export function middleware(request: NextRequest) {
  const token = getTokenFromCookies(request);
  const currentPath = request.nextUrl.pathname;

  if (!token && ROUTES.AUTH_REQUIRED.includes(currentPath)) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  if (token && ROUTES.NON_AUTH_ACCESSIBLE.includes(currentPath)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
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
