import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CastSG - Singapore's Influencer Campaign Management Platform",
  description:
    "Connect brands with top influencers across Instagram, TikTok, and YouTube in Singapore. Manage campaigns, track deliverables, and grow your brand.",
};

import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
