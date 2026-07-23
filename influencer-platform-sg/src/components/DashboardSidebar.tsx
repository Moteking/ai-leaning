"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Megaphone,
  MessageSquare,
  Settings,
  LogOut,
  Users,
  FileText,
  User,
} from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const brandItems: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard/brand", icon: <LayoutDashboard size={20} /> },
  { label: "Discover Creators", href: "/dashboard/brand/creators", icon: <Search size={20} /> },
  { label: "Campaigns", href: "/dashboard/brand/campaigns", icon: <Megaphone size={20} /> },
  { label: "Messages", href: "/dashboard/brand/messages", icon: <MessageSquare size={20} /> },
  { label: "Settings", href: "/dashboard/brand/settings", icon: <Settings size={20} /> },
];

const creatorItems: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard/creator", icon: <LayoutDashboard size={20} /> },
  { label: "Browse Campaigns", href: "/dashboard/creator/campaigns", icon: <Search size={20} /> },
  { label: "My Campaigns", href: "/dashboard/creator/my-campaigns", icon: <FileText size={20} /> },
  { label: "Messages", href: "/dashboard/creator/messages", icon: <MessageSquare size={20} /> },
  { label: "Profile", href: "/dashboard/creator/profile", icon: <User size={20} /> },
  { label: "Settings", href: "/dashboard/creator/settings", icon: <Settings size={20} /> },
];

export default function DashboardSidebar({ role }: { role: "brand" | "creator" }) {
  const pathname = usePathname();
  const items = role === "brand" ? brandItems : creatorItems;

  return (
    <aside className="w-64 bg-white border-r border-border min-h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-bold text-xl">
            Cast<span className="text-primary">SG</span>
          </span>
        </Link>
        <div className="mt-3 text-xs text-gray-500 bg-surface rounded-full px-3 py-1 inline-block">
          {role === "brand" ? "Brand account" : "Creator account"}
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
              {role === "brand" ? "Glow Skincare Co." : "@shermaine.sg"}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {role === "brand" ? "Growth plan" : "Verified creator"}
            </div>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-red-500">
          <LogOut size={18} />
          Sign out
        </Link>
      </div>
    </aside>
  );
}
