"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { Calendar, DollarSign, ExternalLink, Clock, CheckCircle2, XCircle, Video } from "lucide-react";
import Link from "next/link";
import { mockCampaigns } from "@/lib/mock-data";

const myCampaignData = [
  {
    ...mockCampaigns[0],
    myStatus: "active" as const,
    myEarnings: 185000,
    mySales: 52,
    myVideos: 3,
    joinedAt: "2026-03-28",
  },
  {
    ...mockCampaigns[1],
    myStatus: "active" as const,
    myEarnings: 48000,
    mySales: 24,
    myVideos: 2,
    joinedAt: "2026-03-30",
  },
  {
    id: "c-past-001",
    advertiserId: "adv-002",
    title: "春の新作ワンピース プロモーション",
    description: "春の新作ワンピースの着用レビュー動画を投稿してください。",
    productName: "フラワープリントワンピース",
    productUrl: "",
    productImageUrl: "",
    commissionRate: 12,
    commissionType: "percentage" as const,
    budget: 400000,
    spent: 400000,
    status: "completed" as const,
    categories: ["ファッション"],
    targetRegion: "全国",
    startDate: "2026-02-01",
    endDate: "2026-03-15",
    applicants: [],
    createdAt: "2026-01-28",
    myStatus: "completed" as const,
    myEarnings: 220000,
    mySales: 78,
    myVideos: 5,
    joinedAt: "2026-02-03",
  },
  {
    id: "c-past-002",
    advertiserId: "adv-003",
    title: "オーガニックシャンプー レビュー",
    description: "オーガニックシャンプーの使用感レビュー動画を投稿してください。",
    productName: "ナチュラルボタニカルシャンプー",
    productUrl: "",
    productImageUrl: "",
    commissionRate: 1500,
    commissionType: "fixed" as const,
    budget: 200000,
    spent: 200000,
    status: "completed" as const,
    categories: ["美容", "スキンケア"],
    targetRegion: "全国",
    startDate: "2026-01-15",
    endDate: "2026-02-28",
    applicants: [],
    createdAt: "2026-01-10",
    myStatus: "completed" as const,
    myEarnings: 150000,
    mySales: 100,
    myVideos: 4,
    joinedAt: "2026-01-18",
  },
];

export default function MyCampaignsPage() {
  const activeCampaigns = myCampaignData.filter((c) => c.myStatus === "active");
  const completedCampaigns = myCampaignData.filter((c) => c.myStatus === "completed");

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="affiliate" />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">マイ案件</h1>
            <p className="text-sm text-gray-500 mt-1">参加中・過去の案件を管理</p>
          </div>
          <Link
            href="/dashboard/affiliate/campaigns"
            className="flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90"
          >
            新しい案件を探す
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="text-sm text-gray-500 mb-1">参加中の案件</div>
            <div className="text-2xl font-bold">{activeCampaigns.length}件</div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="text-sm text-gray-500 mb-1">合計獲得報酬</div>
            <div className="text-2xl font-bold text-primary">
              ¥{myCampaignData.reduce((sum, c) => sum + c.myEarnings, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="text-sm text-gray-500 mb-1">投稿動画数</div>
            <div className="text-2xl font-bold">
              {myCampaignData.reduce((sum, c) => sum + c.myVideos, 0)}本
            </div>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            参加中のキャンペーン
          </h2>
          <div className="space-y-4">
            {activeCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-2xl border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{campaign.title}</h3>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700">
                        参加中
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{campaign.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-4">
                  <div className="bg-surface rounded-xl p-3 text-center">
                    <DollarSign size={16} className="text-primary mx-auto mb-1" />
                    <div className="font-bold text-sm">¥{campaign.myEarnings.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">獲得報酬</div>
                  </div>
                  <div className="bg-surface rounded-xl p-3 text-center">
                    <CheckCircle2 size={16} className="text-green-500 mx-auto mb-1" />
                    <div className="font-bold text-sm">{campaign.mySales}件</div>
                    <div className="text-xs text-gray-500">成約数</div>
                  </div>
                  <div className="bg-surface rounded-xl p-3 text-center">
                    <Video size={16} className="text-blue-500 mx-auto mb-1" />
                    <div className="font-bold text-sm">{campaign.myVideos}本</div>
                    <div className="text-xs text-gray-500">投稿動画</div>
                  </div>
                  <div className="bg-surface rounded-xl p-3 text-center">
                    <DollarSign size={16} className="text-gray-400 mx-auto mb-1" />
                    <div className="font-bold text-sm">
                      {campaign.commissionType === "percentage"
                        ? `${campaign.commissionRate}%`
                        : `¥${campaign.commissionRate.toLocaleString()}`}
                    </div>
                    <div className="text-xs text-gray-500">報酬単価</div>
                  </div>
                  <div className="bg-surface rounded-xl p-3 text-center">
                    <Calendar size={16} className="text-gray-400 mx-auto mb-1" />
                    <div className="font-bold text-sm">{campaign.endDate}</div>
                    <div className="text-xs text-gray-500">終了日</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <button className="flex items-center gap-1 px-4 py-2 gradient-bg text-white rounded-lg text-sm font-medium hover:opacity-90">
                    <Video size={14} /> 動画を投稿
                  </button>
                  <button className="flex items-center gap-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface">
                    <ExternalLink size={14} /> 商品を確認
                  </button>
                  <button className="flex items-center gap-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface">
                    レポートを見る
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Campaigns */}
        <div>
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
            完了した案件
          </h2>
          <div className="space-y-3">
            {completedCampaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-2xl border border-border p-5 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{campaign.title}</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      完了
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{campaign.startDate} ~ {campaign.endDate}</span>
                    <span>{campaign.myVideos}本投稿</span>
                    <span>{campaign.mySales}件成約</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">¥{campaign.myEarnings.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">獲得報酬</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
