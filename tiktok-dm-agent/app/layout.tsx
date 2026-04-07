import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TikTok DM Agent",
  description: "TikTokアフィリエイター向けDM自動生成ツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
