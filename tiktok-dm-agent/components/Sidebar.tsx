"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/affiliators", label: "アフィリエイター", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-[#0a0a0f]/95 backdrop-blur border-r border-white/10 z-40 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#00f0ff] to-[#ff6bff] bg-clip-text text-transparent">
            TikTok DM Agent
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            アフィリエイター管理ツール
          </p>
        </div>
        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                pathname === item.href || pathname?.startsWith(item.href + "/")
                  ? "bg-white/10 text-white"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
