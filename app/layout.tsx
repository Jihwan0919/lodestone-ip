import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "마인크래프트 서버 IP 찾기 | MC SERVER IP",
  description: "내 마인크래프트 멀티 서버 IP 주소와 포트(:25565)를 1초 만에 확인하고 복사하세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
