"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Search,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { mockCampaigns, mockAffiliates } from "@/lib/mock-data";

function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">{icon}</div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            changeType === "up" ? "text-green-500" : "text-red-500"
          }`}
        >
          {changeType === "up" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {change}
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
    </div>
  );
}

export default function AdvertiserDashboard() {
  const activeCampaigns = mockCampaigns.filter((c) => c.status === "active");

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="advertiser" />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">ダッシュボード</h1>
            <p className="text-sm text-gray-500 mt-1">キャンペーンの概要と成果を確認</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/advertiser/search"
              className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-white transition-colors"
            >
              <Search size={16} />
              アフィリエイター検索
            </Link>
            <Link
              href="/dashboard/advertiser/campaigns"
              className="flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
              キャンペーン作成
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="今月の売上"
            value="¥2,450,000"
            change="+18.5%"
            changeType="up"
            icon={<DollarSign size={24} className="text-primary" />}
          />
          <StatCard
            title="アクティブキャンペーン"
            value={`${activeCampaigns.length}件`}
            change="+2件"
            changeType="up"
            icon={<BarChart3 size={24} className="text-primary" />}
          />
          <StatCard
            title="提携アフィリエイター"
            value="24名"
            change="+5名"
            changeType="up"
            icon={<Users size={24} className="text-primary" />}
          />
          <StatCard
            title="総インプレッション"
            value="3.2M"
            change="+12.3%"
            changeType="up"
            icon={<Eye size={24} className="text-primary" />}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Campaigns */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">アクティブキャンペーン</h2>
              <Link href="/dashboard/advertiser/campaigns" className="text-sm text-primary hover:underline">
                すべて見る
              </Link>
            </div>
            <div className="space-y-4">
              {mockCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-surface transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">{campaign.title}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>報酬: {campaign.commissionType === "percentage" ? `${campaign.commissionRate}%` : `¥${campaign.commissionRate.toLocaleString()}`}</span>
                      <span>予算: ¥{campaign.budget.toLocaleString()}</span>
                      <span>応募: {campaign.applicants.length}件</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        campaign.status === "active"
                          ? "bg-green-100 text-green-700"
                          : campaign.status === "draft"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {campaign.status === "active" ? "公開中" : campaign.status === "draft" ? "下書き" : "一時停止"}
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-medium">¥{campaign.spent.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">消化額</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Affiliates */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">トップアフィリエイター</h2>
              <Link href="/dashboard/advertiser/search" className="text-sm text-primary hover:underline">
                もっと見る
              </Link>
            </div>
            <div className="space-y-4">
              {mockAffiliates.slice(0, 5).map((affiliate, index) => (
                <div key={affiliate.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{affiliate.tiktokHandle}</div>
                    <div className="text-xs text-gray-500">
                      {affiliate.categories[0]} / {(affiliate.followers / 10000).toFixed(1)}万フォロワー
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">{affiliate.affiliateScore}</div>
                    <div className="text-xs text-gray-500">スコア</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Performance Chart Placeholder */}
        <div className="mt-8 bg-white rounded-2xl border border-border p-6">
          <h2 className="font-bold text-lg mb-6">売上推移（直近30日）</h2>
          <div className="flex items-end justify-between h-48 px-4">
            {Array.from({ length: 30 }).map((_, i) => {
              const height = 20 + Math.random() * 80;
              return (
                <div
                  key={i}
                  className="w-full max-w-[12px] gradient-bg rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${height}%` }}
                  title={`Day ${i + 1}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400 px-4">
            <span>3/4</span>
            <span>3/11</span>
            <span>3/18</span>
            <span>3/25</span>
            <span>4/3</span>
          </div>
        </div>
      </main>
    </div>
  );
}
