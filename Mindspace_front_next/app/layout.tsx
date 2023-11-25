import "./globals.scss";
import styles from "./main.module.scss";
import type { Metadata } from "next";
import localFont from "next/font/local";
import LayoutProvider from "@/components/LayoutProvider";
import Recoil from "@/components/Recoil";
import ReactQuery from "@/components/ReactQuery";
import Image from "next/image";

const pretendardVariableFont = localFont({
  src: [{ path: "/assets/fonts/PretendardVariable.woff2" }],
});

export const metadata: Metadata = {
  title: "Mindspace",
  description:
    "Mindspace는 개발에 관련된 각 키워드를 노드와 노드 사이의 연결 관계로 표현하여 사용자에게 학습 방향을 제공하는 사이트입니다.",
  keywords: "개발, 프로그래밍, 학습, 연결 관계, 노드, 키워드",
  metadataBase: new URL("http://localhost:3000"), //FIXME : 향후 실제 도메인으로 수정
  openGraph: {
    title: "Mindspace",
    description:
      "Mindspace는 개발에 관련된 각 키워드를 노드와 노드 사이의 연결 관계로 표현하여 사용자에게 학습 방향을 제공하는 사이트입니다.",
    images: [
      {
        url: "/images/logo.png",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={pretendardVariableFont.className} lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={pretendardVariableFont.className}>
        <Image
          className={styles.background}
          src="/images/background.webp"
          alt="background"
          fill
        />
        <Recoil>
          <ReactQuery>
            <LayoutProvider>{children}</LayoutProvider>
          </ReactQuery>
        </Recoil>
      </body>
    </html>
  );
}
