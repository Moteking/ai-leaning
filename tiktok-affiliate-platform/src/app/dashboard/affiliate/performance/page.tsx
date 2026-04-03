"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Video,
  ShoppingBag,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";

const weeklyData = [
  { day: "月", views: 42000, sales: 12, revenue: 36000 },
  { day: "火", views: 38000, sales: 8, revenue: 24000 },
  { day: "水", views: 55000, sales: 18, revenue: 54000 },
  { day: "木", views: 48000, sales: 15, revenue: 45000 },
  { day: "金", views: 62000, sales: 22, revenue: 66000 },
  { day: "土", views: 85000, sales: 35, revenue: 105000 },
  { day: "日", views: 78000, sales: 30, revenue: 90000 },
];

const videoPerformance = [
  {
    title: "【神コスメ】1000円以下で見つけた最強ファンデ",
    postedAt: "2026-03-28",
    views: 450000,
    likes: 32000,
    comments: 1800,
    shares: 5600,
    sales: 52,
    revenue: 156000,
    conversionRate: 4.8,
    trend: "up" as const,
  },
  {
    title: "朝のスキンケアルーティン全公開",
    postedAt: "2026-03-25",
    views: 280000,
    likes: 21000,
    comments: 950,
    shares: 3200,
    sales: 35,
    revenue: 98000,
    conversionRate: 3.9,
    trend: "up" as const,
  },
  {
    title: "プチプラリップ徹底比較TOP10",
    postedAt: "2026-03-22",
    views: 380000,
    likes: 28000,
    comments: 1500,
    shares: 4200,
    sales: 48,
    revenue: 134000,
    conversionRate: 4.2,
    trend: "up" as const,
  },
  {
    title: "夜用スキンケア｜乾燥肌さん必見",
    postedAt: "2026-03-20",
    views: 220000,
    likes: 16000,
    comments: 720,
    shares: 2100,
    sales: 28,
    revenue: 78000,
    conversionRate: 3.5,
    trend: "down" as const,
  },
  {
    title: "【衝撃】ドラコスで見つけた優秀アイシャドウ",
    postedAt: "2026-03-18",
    views: 310000,
    likes: 24000,
    comments: 1100,
    shares: 3800,
    sales: 42,
    revenue: 118000,
    conversionRate: 4.1,
    trend: "up" as const,
  },
];

const monthlyStats = [
  { month: "10月", revenue: 280000, sales: 120 },
  { month: "11月", revenue: 350000, sales: 155 },
  { month: "12月", revenue: 420000, sales: 190 },
  { month: "1月", revenue: 380000, sales: 170 },
  { month: "2月", revenue: 450000, sales: 210 },
  { month: "3月", revenue: 520000, sales: 245 },
];

export default function PerformancePage() {
  const maxMonthlyRevenue = Math.max(...monthlyStats.map((m) => m.revenue));
  const maxWeeklyViews = Math.max(...weeklyData.map((d) => d.views));

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="affiliate" />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">パフォーマンス</h1>
            <p className="text-sm text-gray-500 mt-1">動画・売上の詳細パフォーマンスを分析</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl border border-border px-4 py-2">
            <Calendar size={16} className="text-gray-400" />
            <select className="text-sm outline-none bg-transparent">
              <option>直近30日</option>
              <option>直近7日</option>
              <option>直近90日</option>
              <option>今月</option>
              <option>先月</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "総再生回数", value: "1.84M", change: "+28.5%", up: true, icon: <Eye size={20} className="text-blue-500" /> },
            { label: "エンゲージメント率", value: "8.5%", change: "+0.8%", up: true, icon: <Heart size={20} className="text-pink-500" /> },
            { label: "成約件数", value: "342件", change: "+15.8%", up: true, icon: <ShoppingBag size={20} className="text-green-500" /> },
            { label: "コンバージョン率", value: "4.2%", change: "+0.5%", up: true, icon: <TrendingUp size={20} className="text-primary" /> },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center">{stat.icon}</div>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${stat.up ? "text-green-500" : "text-red-500"}`}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </span>
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Views Chart */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold mb-4">今週の再生回数</h2>
            <div className="flex items-end justify-between h-40 gap-2">
              {weeklyData.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-xs text-gray-500">{(d.views / 10000).toFixed(1)}万</div>
                  <div
                    className="w-full gradient-bg rounded-t-md opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${(d.views / maxWeeklyViews) * 120}px` }}
                  />
                  <div className="text-xs text-gray-500">{d.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold mb-4">月間報酬推移</h2>
            <div className="flex items-end justify-between h-40 gap-3">
              {monthlyStats.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-xs text-gray-500">¥{(m.revenue / 10000).toFixed(0)}万</div>
                  <div
                    className="w-full bg-primary/80 rounded-t-md hover:bg-primary transition-colors"
                    style={{ height: `${(m.revenue / maxMonthlyRevenue) * 120}px` }}
                  />
                  <div className="text-xs text-gray-500">{m.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">エンゲージメント内訳（直近30日）</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "いいね", value: "121,000", icon: <Heart size={20} className="text-pink-500" />, percentage: "65%" },
              { label: "コメント", value: "6,070", icon: <MessageCircle size={20} className="text-blue-500" />, percentage: "3.3%" },
              { label: "シェア", value: "18,900", icon: <Share2 size={20} className="text-green-500" />, percentage: "10.3%" },
              { label: "保存", value: "39,200", icon: <Users size={20} className="text-purple-500" />, percentage: "21.3%" },
            ].map((item) => (
              <div key={item.label} className="bg-surface rounded-xl p-4 text-center">
                <div className="flex items-center justify-center mb-2">{item.icon}</div>
                <div className="font-bold text-lg">{item.value}</div>
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full gradient-bg rounded-full" style={{ width: item.percentage }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Performance Table */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-bold mb-4">動画別パフォーマンス</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">動画</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">再生回数</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">いいね</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">コメント</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">成約</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">CVR</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">報酬</th>
                </tr>
              </thead>
              <tbody>
                {videoPerformance.map((video) => (
                  <tr key={video.title} className="border-b border-border last:border-0 hover:bg-surface">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Video size={14} className="text-primary/50" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate max-w-[200px]">{video.title}</div>
                          <div className="text-xs text-gray-500">{video.postedAt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-3 px-2">{(video.views / 10000).toFixed(1)}万</td>
                    <td className="text-right py-3 px-2">{(video.likes / 1000).toFixed(1)}K</td>
                    <td className="text-right py-3 px-2">{video.comments.toLocaleString()}</td>
                    <td className="text-right py-3 px-2 font-medium">{video.sales}件</td>
                    <td className="text-right py-3 px-2">
                      <span className={`inline-flex items-center gap-0.5 ${video.trend === "up" ? "text-green-600" : "text-red-500"}`}>
                        {video.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {video.conversionRate}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-2 font-bold text-primary">¥{video.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
