import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "おやつ（OyaTsu）— 親孝行の、すべてがここに。",
  description:
    "ギフト、旅行、リフォーム、見守り、終活まで。親のためにできることの全てが、ここで選べる親孝行専門サイト。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased bg-white text-gray-800 font-sans">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
