"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  ExternalLink,
  MapPin,
  Calendar,
  Star,
  Users,
  Eye,
  TrendingUp,
  ShoppingBag,
  Video,
  Heart,
  MessageCircle,
  Share2,
  Edit3,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { mockAffiliates } from "@/lib/mock-data";

export default function AffiliateProfilePage() {
  const affiliate = mockAffiliates[0]; // beauty_mika

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="affiliate" />

      <main className="flex-1 p-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden mb-8">
          {/* Banner */}
          <div className="h-32 gradient-bg relative">
            <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white/30">
              カバーを変更
            </button>
          </div>

          <div className="px-8 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-3xl border-4 border-white shadow-lg">
                  M
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0 pt-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{affiliate.tiktokHandle}</h1>
                  <Shield size={18} className="text-blue-500" />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><MapPin size={14} />{affiliate.region}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} />2025年6月登録</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/affiliate/settings"
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-surface"
                >
                  <Edit3 size={14} /> プロフィール編集
                </Link>
                <a
                  href={affiliate.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90"
                >
                  TikTokを開く <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4 max-w-2xl">{affiliate.bio}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              {affiliate.categories.map((cat) => (
                <span key={cat} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
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
          {/* Score Breakdown */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold mb-4">スコア内訳</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-36 h-36">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50" fill="none" stroke="url(#profileScoreGrad)" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${(affiliate.affiliateScore / 100) * 314} 314`}
                  />
                  <defs>
                    <linearGradient id="profileScoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
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
            <div className="space-y-3">
              {[
                { label: "売上実績", value: 96 },
                { label: "エンゲージメント", value: 92 },
                { label: "コンテンツ品質", value: 94 },
                { label: "レスポンス速度", value: 98 },
                { label: "継続性", value: 90 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
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

          {/* Recent Videos */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold mb-4">最近の投稿</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "【神コスメ】1000円以下で見つけた最強ファンデ", views: 450000, likes: 32000, comments: 1800, shares: 5600, date: "3/28" },
                { title: "朝のスキンケアルーティン全公開", views: 280000, likes: 21000, comments: 950, shares: 3200, date: "3/25" },
                { title: "プチプラリップ徹底比較TOP10", views: 380000, likes: 28000, comments: 1500, shares: 4200, date: "3/22" },
                { title: "夜用スキンケア｜乾燥肌さん必見", views: 220000, likes: 16000, comments: 720, shares: 2100, date: "3/20" },
              ].map((video) => (
                <div key={video.title} className="rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Video size={28} className="text-primary/30" />
                  </div>
                  <div className="p-3">
                    <div className="font-medium text-sm mb-2 line-clamp-1">{video.title}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-0.5"><Eye size={12} />{(video.views / 10000).toFixed(1)}万</span>
                      <span className="flex items-center gap-0.5"><Heart size={12} />{(video.likes / 1000).toFixed(1)}K</span>
                      <span className="flex items-center gap-0.5"><MessageCircle size={12} />{video.comments}</span>
                      <span className="flex items-center gap-0.5"><Share2 size={12} />{(video.shares / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{video.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-8 bg-white rounded-2xl border border-border p-6">
          <h2 className="font-bold mb-4">実績バッジ</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: "トップ5%", desc: "上位5%のアフィリエイター", color: "from-yellow-400 to-orange-500" },
              { label: "売上1000万+", desc: "累計売上1000万円突破", color: "from-green-400 to-emerald-600" },
              { label: "高CVR", desc: "CVR 4%以上", color: "from-blue-400 to-indigo-600" },
              { label: "認証済み", desc: "本人確認完了", color: "from-primary to-accent" },
              { label: "レスポンスA", desc: "平均応答1時間以内", color: "from-purple-400 to-pink-500" },
              { label: "リピーター", desc: "3社以上と継続取引", color: "from-cyan-400 to-teal-500" },
            ].map((badge) => (
              <div key={badge.label} className="text-center">
                <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center mb-2 shadow-lg`}>
                  <Star size={24} className="text-white" />
                </div>
                <div className="font-medium text-sm">{badge.label}</div>
                <div className="text-xs text-gray-500">{badge.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
