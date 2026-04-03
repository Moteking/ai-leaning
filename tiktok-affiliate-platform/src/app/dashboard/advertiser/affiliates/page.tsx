"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Star,
  Users,
  Eye,
  TrendingUp,
  ShoppingBag,
  Video,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  MessageSquare,
  Shield,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { mockAffiliates } from "@/lib/mock-data";

export default function AffiliateDetailPage() {
  // In a real app, this would come from route params
  const affiliate = mockAffiliates[0];

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="advertiser" />

      <main className="flex-1 p-8">
        <Link
          href="/dashboard/advertiser/search"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6"
        >
          <ArrowLeft size={16} /> 検索に戻る
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden mb-8">
          <div className="h-28 gradient-bg" />
          <div className="px-8 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-10">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg">
                {affiliate.tiktokHandle.charAt(1).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{affiliate.tiktokHandle}</h1>
                  {affiliate.verifiedAt && <Shield size={16} className="text-blue-500" />}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><MapPin size={14} />{affiliate.region}</span>
                  <span>認証: {affiliate.verifiedAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-surface">
                  <MessageSquare size={14} /> メッセージ
                </button>
                <button className="flex items-center gap-2 px-4 py-2 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90">
                  キャンペーンに招待
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">{affiliate.bio}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {affiliate.categories.map((cat) => (
                <span key={cat} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{cat}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "フォロワー", value: `${(affiliate.followers / 10000).toFixed(1)}万`, icon: <Users size={18} className="text-blue-500" /> },
            { label: "平均再生", value: `${(affiliate.avgViews / 10000).toFixed(1)}万`, icon: <Eye size={18} className="text-purple-500" /> },
            { label: "エンゲージメント", value: `${affiliate.engagementRate}%`, icon: <Heart size={18} className="text-pink-500" /> },
            { label: "月間GMV", value: `¥${(affiliate.monthlyGmv / 10000).toFixed(0)}万`, icon: <ShoppingBag size={18} className="text-green-500" /> },
            { label: "CVR", value: `${affiliate.stats.conversionRate}%`, icon: <TrendingUp size={18} className="text-orange-500" /> },
            { label: "スコア", value: `${affiliate.affiliateScore}`, icon: <Star size={18} className="text-yellow-500" /> },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-border p-4 text-center">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <div className="font-bold text-lg">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Score & Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold mb-4">アフィリエイタースコア</h2>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="url(#detailScoreGrad)" strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={`${(affiliate.affiliateScore / 100) * 314} 314`} />
                    <defs>
                      <linearGradient id="detailScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fe2c55" />
                        <stop offset="100%" stopColor="#25f4ee" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{affiliate.affiliateScore}</span>
                    <span className="text-xs text-gray-500">/ 100</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: "売上実績", value: 96 },
                  { label: "エンゲージメント", value: 92 },
                  { label: "コンテンツ品質", value: 94 },
                  { label: "レスポンス", value: 98 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-medium">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full gradient-bg rounded-full" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold mb-4">売上実績</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-gray-500">累計売上件数</span>
                  <span className="text-sm font-medium">{affiliate.stats.totalSales.toLocaleString()}件</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-gray-500">累計売上金額</span>
                  <span className="text-sm font-bold text-primary">¥{affiliate.stats.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-sm text-gray-500">平均注文単価</span>
                  <span className="text-sm font-medium">¥{affiliate.stats.avgOrderValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">月間成長率</span>
                  <span className="text-sm font-medium text-green-600">+{affiliate.stats.monthlyGrowth}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Videos */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold mb-4">最近の投稿動画</h2>
            <div className="space-y-4">
              {[
                { title: "【神コスメ】1000円以下で見つけた最強ファンデ", views: 450000, likes: 32000, comments: 1800, shares: 5600, date: "2026-03-28", sales: 52, revenue: 156000 },
                { title: "朝のスキンケアルーティン全公開", views: 280000, likes: 21000, comments: 950, shares: 3200, date: "2026-03-25", sales: 35, revenue: 98000 },
                { title: "プチプラリップ徹底比較TOP10", views: 380000, likes: 28000, comments: 1500, shares: 4200, date: "2026-03-22", sales: 48, revenue: 134000 },
                { title: "夜用スキンケア｜乾燥肌さん必見", views: 220000, likes: 16000, comments: 720, shares: 2100, date: "2026-03-20", sales: 28, revenue: 78000 },
                { title: "【衝撃】ドラコスで見つけた優秀アイシャドウ", views: 310000, likes: 24000, comments: 1100, shares: 3800, date: "2026-03-18", sales: 42, revenue: 118000 },
              ].map((video) => (
                <div key={video.title} className="flex gap-4 p-4 rounded-xl border border-border hover:bg-surface transition-colors">
                  <div className="w-24 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video size={20} className="text-primary/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1 truncate">{video.title}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-0.5"><Eye size={11} />{(video.views / 10000).toFixed(1)}万</span>
                      <span className="flex items-center gap-0.5"><Heart size={11} />{(video.likes / 1000).toFixed(1)}K</span>
                      <span className="flex items-center gap-0.5"><MessageCircle size={11} />{video.comments}</span>
                      <span className="flex items-center gap-0.5"><Share2 size={11} />{(video.shares / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{video.date}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-primary">¥{video.revenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{video.sales}件成約</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
