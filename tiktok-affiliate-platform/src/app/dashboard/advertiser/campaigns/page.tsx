"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Plus, MoreHorizontal, Calendar, Users, DollarSign } from "lucide-react";
import { mockCampaigns } from "@/lib/mock-data";

export default function CampaignsPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCampaigns =
    statusFilter === "all"
      ? mockCampaigns
      : mockCampaigns.filter((c) => c.status === statusFilter);

  const statusLabels: Record<string, { label: string; color: string }> = {
    active: { label: "公開中", color: "bg-green-100 text-green-700" },
    draft: { label: "下書き", color: "bg-gray-100 text-gray-700" },
    paused: { label: "一時停止", color: "bg-yellow-100 text-yellow-700" },
    completed: { label: "完了", color: "bg-blue-100 text-blue-700" },
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="advertiser" />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">キャンペーン管理</h1>
            <p className="text-sm text-gray-500 mt-1">キャンペーンの作成・管理・レポート</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} />
            新規キャンペーン作成
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { value: "all", label: "すべて" },
            { value: "active", label: "公開中" },
            { value: "draft", label: "下書き" },
            { value: "paused", label: "一時停止" },
            { value: "completed", label: "完了" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 border border-border hover:bg-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Campaign Cards */}
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{campaign.title}</h3>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        statusLabels[campaign.status]?.color
                      }`}
                    >
                      {statusLabels[campaign.status]?.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{campaign.description}</p>
                </div>
                <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                  <MoreHorizontal size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign size={16} className="text-gray-400" />
                  <div>
                    <div className="font-medium">
                      {campaign.commissionType === "percentage"
                        ? `${campaign.commissionRate}%`
                        : `¥${campaign.commissionRate.toLocaleString()}`}
                    </div>
                    <div className="text-xs text-gray-500">報酬</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign size={16} className="text-gray-400" />
                  <div>
                    <div className="font-medium">
                      ¥{campaign.spent.toLocaleString()} / ¥{campaign.budget.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">消化 / 予算</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <div className="font-medium">
                      {campaign.startDate} ~ {campaign.endDate}
                    </div>
                    <div className="text-xs text-gray-500">期間</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-gray-400" />
                  <div>
                    <div className="font-medium">{campaign.applicants.length}名</div>
                    <div className="text-xs text-gray-500">応募者</div>
                  </div>
                </div>
              </div>

              {/* Budget Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>予算消化率</span>
                  <span>{campaign.budget > 0 ? Math.round((campaign.spent / campaign.budget) * 100) : 0}%</span>
                </div>
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-bg rounded-full transition-all"
                    style={{
                      width: `${campaign.budget > 0 ? Math.min((campaign.spent / campaign.budget) * 100, 100) : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Applicants Preview */}
              {campaign.applicants.length > 0 && (
                <div className="border-t border-border pt-4">
                  <div className="text-sm font-medium mb-2">応募者</div>
                  <div className="flex flex-wrap gap-2">
                    {campaign.applicants.map((app) => (
                      <div
                        key={app.id}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                          app.status === "approved"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : app.status === "pending"
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        <div className="w-5 h-5 bg-current/10 rounded-full" />
                        {app.affiliateId}
                        <span className="opacity-70">
                          ({app.status === "approved" ? "承認" : app.status === "pending" ? "審査中" : "却下"})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
