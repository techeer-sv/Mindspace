"use client";

import "./globals.scss";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/" && <Navbar />}
      {children}
    </>
  );
}
