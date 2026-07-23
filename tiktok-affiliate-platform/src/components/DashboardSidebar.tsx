"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Megaphone,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Users,
  Wallet,
  FileText,
  TrendingUp,
} from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const advertiserItems: SidebarItem[] = [
  { label: "ダッシュボード", href: "/dashboard/advertiser", icon: <LayoutDashboard size={20} /> },
  { label: "アフィリエイター検索", href: "/dashboard/advertiser/search", icon: <Search size={20} /> },
  { label: "キャンペーン管理", href: "/dashboard/advertiser/campaigns", icon: <Megaphone size={20} /> },
  { label: "レポート", href: "/dashboard/advertiser/reports", icon: <BarChart3 size={20} /> },
  { label: "メッセージ", href: "/dashboard/advertiser/messages", icon: <MessageSquare size={20} /> },
  { label: "設定", href: "/dashboard/advertiser/settings", icon: <Settings size={20} /> },
];

const affiliateItems: SidebarItem[] = [
  { label: "ダッシュボード", href: "/dashboard/affiliate", icon: <LayoutDashboard size={20} /> },
  { label: "案件を探す", href: "/dashboard/affiliate/campaigns", icon: <Search size={20} /> },
  { label: "マイ案件", href: "/dashboard/affiliate/my-campaigns", icon: <FileText size={20} /> },
  { label: "パフォーマンス", href: "/dashboard/affiliate/performance", icon: <TrendingUp size={20} /> },
  { label: "報酬管理", href: "/dashboard/affiliate/earnings", icon: <Wallet size={20} /> },
  { label: "メッセージ", href: "/dashboard/affiliate/messages", icon: <MessageSquare size={20} /> },
  { label: "設定", href: "/dashboard/affiliate/settings", icon: <Settings size={20} /> },
];

export default function DashboardSidebar({ role }: { role: "advertiser" | "affiliate" }) {
  const pathname = usePathname();
  const items = role === "advertiser" ? advertiserItems : affiliateItems;

  return (
    <aside className="w-64 bg-white border-r border-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-xl">
            Tik<span className="text-primary">Afi</span>
          </span>
        </Link>
        <div className="mt-3 text-xs text-gray-500 bg-surface rounded-full px-3 py-1 inline-block">
          {role === "advertiser" ? "広告主" : "アフィリエイター"}
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-surface hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Users size={16} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {role === "advertiser" ? "株式会社サンプル" : "@beauty_mika"}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {role === "advertiser" ? "プロプラン" : "フォロワー 52万"}
            </div>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          <LogOut size={18} />
          ログアウト
        </Link>
      </div>
    </aside>
  );
}
