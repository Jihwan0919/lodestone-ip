import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "마인크래프트 서버 IP 찾기",
  description: "마인크래프트 서버 IP 및 접속 정보 실시간 확인기",
  icons: {
    icon: "/diamond.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
