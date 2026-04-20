"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Plus, MoreHorizontal, Calendar, Users, DollarSign, Camera as Instagram, Film as Youtube } from "lucide-react";
import Link from "next/link";
import { mockCampaigns } from "@/lib/mock-data";
import { SocialPlatform } from "@/lib/types";

function PlatformIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "instagram") return <Instagram size={14} />;
  if (platform === "youtube") return <Youtube size={14} />;
  if (platform === "tiktok") return <span className="text-[10px] font-bold">TT</span>;
  return <span className="text-[10px] font-bold">XHS</span>;
}

export default function CampaignsPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCampaigns = statusFilter === "all" ? mockCampaigns : mockCampaigns.filter((c) => c.status === statusFilter);

  const statusConfig: Record<string, { label: string; color: string }> = {
    open: { label: "Open", color: "bg-green-100 text-green-700" },
    in_progress: { label: "In progress", color: "bg-blue-100 text-blue-700" },
    draft: { label: "Draft", color: "bg-gray-100 text-gray-700" },
    completed: { label: "Completed", color: "bg-purple-100 text-purple-700" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="brand" />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Campaigns</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all your influencer campaigns</p>
          </div>
          <Link href="/dashboard/brand/campaigns/new" className="flex items-center gap-2 px-5 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90">
            <Plus size={16} />
            New campaign
          </Link>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { value: "all", label: "All" },
            { value: "open", label: "Open" },
            { value: "in_progress", label: "In progress" },
            { value: "draft", label: "Drafts" },
            { value: "completed", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === tab.value ? "bg-primary text-white" : "bg-white text-gray-600 border border-border hover:bg-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-bold text-lg">{campaign.title}</h3>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusConfig[campaign.status]?.color}`}>
                      {statusConfig[campaign.status]?.label}
                    </span>
                    <div className="flex items-center gap-1">
                      {campaign.platforms.map((p) => (
                        <span key={p} className="w-6 h-6 bg-surface rounded flex items-center justify-center">
                          <PlatformIcon platform={p} />
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{campaign.description}</p>
                </div>
                <button className="p-2 hover:bg-surface rounded-lg">
                  <MoreHorizontal size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign size={16} className="text-gray-400" />
                  <div>
                    <div className="font-medium">S${campaign.paymentPerCreatorSGD.toLocaleString()}/creator</div>
                    <div className="text-xs text-gray-500">Payment</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign size={16} className="text-gray-400" />
                  <div>
                    <div className="font-medium">S${campaign.budgetSGD.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Total budget</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <div className="font-medium">{campaign.applicationDeadline}</div>
                    <div className="text-xs text-gray-500">Apply by</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-gray-400" />
                  <div>
                    <div className="font-medium">{campaign.applicants.length} applicants</div>
                    <div className="text-xs text-gray-500">{campaign.selectedCreators.length} selected</div>
                  </div>
                </div>
              </div>

              {campaign.applicants.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <div className="text-sm font-medium mb-2">Recent applicants</div>
                  <div className="flex flex-wrap gap-2">
                    {campaign.applicants.map((app) => (
                      <div
                        key={app.id}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                          app.status === "accepted" ? "bg-green-50 text-green-700 border-green-200" :
                          app.status === "shortlisted" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          app.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                          "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {app.creatorHandle}
                        <span className="opacity-70">
                          ({app.status})
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
