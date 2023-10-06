"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import { useRecoilValue } from "recoil";
import { isLoggedInAtom } from "@/recoil/state/authAtom";

const protectedRoutes = ["/map"]; // 로그인이 필요한 페이지 목록
const publicRoutes = ["/signin", "/signup"]; // 로그인이 되면 접근할 수 없는 페이지 목록

function isProtectedRoute(pathname: string) {
  return protectedRoutes.includes(pathname);
}

function isPublicRoute(pathname: string) {
  return publicRoutes.includes(pathname);
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useRecoilValue(isLoggedInAtom);

  useEffect(() => {
    if (isLoggedIn && isPublicRoute(pathname)) {
      router.replace("/");
    } else if (!isLoggedIn && isProtectedRoute(pathname)) {
      router.replace("/signin");
    }
  }, [isLoggedIn, pathname]);

  return <>{children}</>;
}
