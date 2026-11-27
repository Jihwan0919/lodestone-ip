import type { Metadata } from "next";
import "./globals.css";

// 추천 1: 다이아몬드 아이콘 (잔디 블록을 원하시면 아래 주석 처리된 줄과 바꾸세요)
const iconUrl = "data:image/svg+xml," + encodeURIComponent(
  `<svg xmlns="http://w3.org" viewBox="0 0 16 16"><path d="M5,2h6v2h2v2h2v4h-2v2h-2v2H5v-2H3v-2H1V6h2V4h2V2z" fill="#083344"/><path d="M5,3h6v2h2v4h-2v2H5V9H3V5h2V3z" fill="#22d3ee"/><path d="M5,4h4v2h2v2H9V6H5V4z" fill="#a5f3fc"/></svg>`
);

export const metadata: Metadata = {
  title: "마인크래프트 서버 IP 찾기",
  description: "마인크래프트 서버 IP 및 접속 정보 실시간 확인기",
  icons: { icon: iconUrl },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
