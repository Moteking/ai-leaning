"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Eye,
  ShoppingBag,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

const campaignReports = [
  {
    name: "新作リップティント プロモーション",
    impressions: 2850000,
    clicks: 142500,
    ctr: 5.0,
    conversions: 1250,
    cvr: 0.88,
    revenue: 4375000,
    spend: 185000,
    roas: 23.6,
    affiliates: 8,
  },
  {
    name: "ワイヤレスイヤホン レビューキャンペーン",
    impressions: 1200000,
    clicks: 72000,
    ctr: 6.0,
    conversions: 480,
    cvr: 0.67,
    revenue: 1920000,
    spend: 48000,
    roas: 40.0,
    affiliates: 3,
  },
];

const dailyData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  impressions: 50000 + Math.floor(Math.random() * 100000),
  conversions: 20 + Math.floor(Math.random() * 60),
  revenue: 100000 + Math.floor(Math.random() * 200000),
}));

export default function ReportsPage() {
  const [period, setPeriod] = useState("30days");
  const maxRevenue = Math.max(...dailyData.map((d) => d.revenue));

  const totalImpressions = campaignReports.reduce((sum, c) => sum + c.impressions, 0);
  const totalConversions = campaignReports.reduce((sum, c) => sum + c.conversions, 0);
  const totalRevenue = campaignReports.reduce((sum, c) => sum + c.revenue, 0);
  const totalSpend = campaignReports.reduce((sum, c) => sum + c.spend, 0);

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="advertiser" />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">レポート</h1>
            <p className="text-sm text-gray-500 mt-1">キャンペーンの詳細パフォーマンスレポート</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-xl border border-border px-4 py-2">
              <Calendar size={16} className="text-gray-400" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="text-sm outline-none bg-transparent"
              >
                <option value="7days">直近7日</option>
                <option value="30days">直近30日</option>
                <option value="90days">直近90日</option>
                <option value="thisMonth">今月</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-white transition-colors">
              <Download size={16} />
              レポートをDL
            </button>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "総インプレッション", value: `${(totalImpressions / 1000000).toFixed(1)}M`, change: "+18.3%", up: true, icon: <Eye size={20} className="text-blue-500" /> },
            { label: "総コンバージョン", value: totalConversions.toLocaleString(), change: "+22.5%", up: true, icon: <ShoppingBag size={20} className="text-green-500" /> },
            { label: "総売上", value: `¥${(totalRevenue / 10000).toFixed(0)}万`, change: "+15.8%", up: true, icon: <DollarSign size={20} className="text-primary" /> },
            { label: "広告費", value: `¥${(totalSpend / 10000).toFixed(0)}万`, change: "+8.2%", up: true, icon: <BarChart3 size={20} className="text-purple-500" /> },
            { label: "ROAS", value: `${(totalRevenue / totalSpend).toFixed(1)}x`, change: "+3.2x", up: true, icon: <TrendingUp size={20} className="text-orange-500" /> },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center">{stat.icon}</div>
                <span className={`text-xs font-medium flex items-center gap-0.5 ${stat.up ? "text-green-500" : "text-red-500"}`}>
                  {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </span>
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-8">
          <h2 className="font-bold mb-6">日別売上推移</h2>
          <div className="flex items-end justify-between h-48 gap-1 px-2">
            {dailyData.map((d) => (
              <div
                key={d.day}
                className="flex-1 gradient-bg rounded-t-sm opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                title={`${d.day}日: ¥${d.revenue.toLocaleString()}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs text-gray-400 px-2">
            <span>3/4</span><span>3/9</span><span>3/14</span><span>3/19</span><span>3/24</span><span>3/29</span><span>4/3</span>
          </div>
        </div>

        {/* Campaign Breakdown */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-8">
          <h2 className="font-bold mb-4">キャンペーン別レポート</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 font-medium text-gray-500">キャンペーン</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-500">IMP</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-500">Click</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-500">CTR</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-500">CV</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-500">CVR</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-500">売上</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-500">広告費</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-500">ROAS</th>
                  <th className="text-right py-3 px-3 font-medium text-gray-500">AF数</th>
                </tr>
              </thead>
              <tbody>
                {campaignReports.map((c) => (
                  <tr key={c.name} className="border-b border-border last:border-0 hover:bg-surface">
                    <td className="py-3 px-3 font-medium">{c.name}</td>
                    <td className="py-3 px-3 text-right">{(c.impressions / 10000).toFixed(0)}万</td>
                    <td className="py-3 px-3 text-right">{(c.clicks / 1000).toFixed(1)}K</td>
                    <td className="py-3 px-3 text-right">{c.ctr}%</td>
                    <td className="py-3 px-3 text-right font-medium">{c.conversions.toLocaleString()}</td>
                    <td className="py-3 px-3 text-right">{c.cvr}%</td>
                    <td className="py-3 px-3 text-right font-bold text-primary">¥{(c.revenue / 10000).toFixed(0)}万</td>
                    <td className="py-3 px-3 text-right">¥{(c.spend / 10000).toFixed(1)}万</td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-bold text-green-600">{c.roas}x</span>
                    </td>
                    <td className="py-3 px-3 text-right">{c.affiliates}名</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Affiliate Performance */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-bold mb-4">アフィリエイター別パフォーマンス</h2>
          <div className="space-y-3">
            {[
              { name: "@beauty_mika", sales: 520, revenue: 1820000, cvr: 4.8, rank: 1 },
              { name: "@fashion_remi", sales: 380, revenue: 1330000, cvr: 3.5, rank: 2 },
              { name: "@cooking_papa", sales: 290, revenue: 1015000, cvr: 4.5, rank: 3 },
              { name: "@gadget_taro", sales: 240, revenue: 960000, cvr: 3.8, rank: 4 },
              { name: "@fit_yuna", sales: 180, revenue: 630000, cvr: 5.1, rank: 5 },
            ].map((af) => (
              <div key={af.name} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-surface">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                    af.rank === 1 ? "bg-yellow-500" : af.rank === 2 ? "bg-gray-400" : af.rank === 3 ? "bg-amber-700" : "bg-gray-300"
                  }`}>
                    {af.rank}
                  </div>
                  <div className="font-medium">{af.name}</div>
                </div>
                <div className="flex items-center gap-8 text-sm">
                  <div className="text-right">
                    <div className="font-medium">{af.sales}件</div>
                    <div className="text-xs text-gray-500">成約</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">¥{(af.revenue / 10000).toFixed(0)}万</div>
                    <div className="text-xs text-gray-500">売上</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">{af.cvr}%</div>
                    <div className="text-xs text-gray-500">CVR</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
