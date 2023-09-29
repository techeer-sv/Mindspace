import "./globals.scss";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LayoutProvider from "./LayoutProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mindspace",
  description:
    "Mindspace는 개발에 관련된 각 키워드를 노드와 노드 사이의 연결 관계로 표현하여 사용자에게 학습 방향을 제공하는 사이트입니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
