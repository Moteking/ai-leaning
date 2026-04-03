"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  TrendingUp,
  DollarSign,
  Eye,
  ArrowUpRight,
  ShoppingBag,
  Video,
  Target,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { mockCampaigns } from "@/lib/mock-data";

function StatCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">{icon}</div>
        <div className="flex items-center gap-1 text-sm font-medium text-green-500">
          <ArrowUpRight size={16} />
          {change}
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  );
}

export default function AffiliateDashboard() {
  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="affiliate" />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">ダッシュボード</h1>
            <p className="text-sm text-gray-500 mt-1">あなたのパフォーマンスと報酬状況</p>
          </div>
          <Link
            href="/dashboard/affiliate/campaigns"
            className="flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Target size={16} />
            案件を探す
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="今月の報酬"
            value="¥485,000"
            change="+22.3%"
            icon={<DollarSign size={24} className="text-primary" />}
          />
          <StatCard
            title="今月の売上件数"
            value="342件"
            change="+15.8%"
            icon={<ShoppingBag size={24} className="text-primary" />}
          />
          <StatCard
            title="動画総再生回数"
            value="1.8M"
            change="+28.5%"
            icon={<Eye size={24} className="text-primary" />}
          />
          <StatCard
            title="コンバージョン率"
            value="4.2%"
            change="+0.5%"
            icon={<TrendingUp size={24} className="text-primary" />}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Campaigns */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">参加中のキャンペーン</h2>
              <Link href="/dashboard/affiliate/my-campaigns" className="text-sm text-primary hover:underline">
                すべて見る
              </Link>
            </div>
            <div className="space-y-4">
              {mockCampaigns
                .filter((c) => c.status === "active")
                .map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-surface transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm mb-1">{campaign.title}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{campaign.productName}</span>
                        <span>
                          報酬:{" "}
                          {campaign.commissionType === "percentage"
                            ? `${campaign.commissionRate}%`
                            : `¥${campaign.commissionRate.toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">¥85,000</div>
                        <div className="text-xs text-gray-500">獲得報酬</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">28件</div>
                        <div className="text-xs text-gray-500">成約</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* My Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-4">アフィリエイタースコア</h2>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${(95 / 100) * 314} 314`}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fe2c55" />
                        <stop offset="100%" stopColor="#25f4ee" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">95</span>
                  </div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500">上位 5% のアフィリエイター</div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-4">おすすめ案件</h2>
              <div className="space-y-3">
                {mockCampaigns.slice(0, 2).map((campaign) => (
                  <div key={campaign.id} className="p-3 rounded-xl bg-surface">
                    <div className="font-medium text-sm mb-1">{campaign.title}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {campaign.commissionType === "percentage"
                          ? `${campaign.commissionRate}%`
                          : `¥${campaign.commissionRate.toLocaleString()}`}
                      </span>
                      <Link
                        href="/dashboard/affiliate/campaigns"
                        className="text-xs text-primary flex items-center gap-1 hover:underline"
                      >
                        詳細 <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Videos */}
        <div className="mt-8 bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">最近の投稿動画</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "【神コスメ】1000円以下で見つけた最強ファンデ", views: "45万回再生", sales: 52, revenue: "¥156,000" },
              { title: "朝のスキンケアルーティン全公開", views: "28万回再生", sales: 35, revenue: "¥98,000" },
              { title: "プチプラリップ徹底比較TOP10", views: "38万回再生", sales: 48, revenue: "¥134,000" },
              { title: "夜用スキンケア｜乾燥肌さん必見", views: "22万回再生", sales: 28, revenue: "¥78,000" },
            ].map((video) => (
              <div key={video.title} className="rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[9/16] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center max-h-48">
                  <Video size={32} className="text-primary/40" />
                </div>
                <div className="p-3">
                  <div className="font-medium text-xs mb-2 line-clamp-2">{video.title}</div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{video.views}</span>
                    <span className="text-green-600 font-medium">{video.revenue}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{video.sales}件成約</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
