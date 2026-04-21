"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Megaphone, Users, MessageSquare, Clock, Plus, Search, CheckCircle2, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api-client";

interface CampaignItem {
  id: string;
  title: string;
  status: string;
  paymentPerCreatorSGD: number;
  applicationDeadline: string;
  applications: { id: string }[];
}

interface CreatorItem {
  id: string;
  handle: string;
  displayName: string;
  categories: string;
  verified: boolean;
  completedCampaigns: number;
  averageRating: number;
  platforms: { followers: number }[];
}

export default function BrandDashboard() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [creators, setCreators] = useState<CreatorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.campaigns.list().then((r) => setCampaigns(((r as { data: CampaignItem[] }).data || []))),
      api.creators.list().then((r) => setCreators(((r as { data: CreatorItem[] }).data || []).slice(0, 5))),
    ]).finally(() => setLoading(false));
  }, []);

  const activeCampaigns = campaigns.filter((c) => c.status === "open" || c.status === "in_progress");
  const totalApplicants = campaigns.reduce((sum, c) => sum + (c.applications?.length || 0), 0);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-surface">
        <DashboardSidebar role="brand" />
        <main className="flex-1 flex items-center justify-center"><Loader2 size={32} className="animate-spin text-primary" /></main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="brand" />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/brand/creators" className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-white">
              <Search size={16} /> Find creators
            </Link>
            <Link href="/dashboard/brand/campaigns/new" className="flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90">
              <Plus size={16} /> New campaign
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Active campaigns", value: `${activeCampaigns.length}`, icon: <Megaphone size={22} className="text-primary" /> },
            { title: "Total applications", value: `${totalApplicants}`, icon: <Users size={22} className="text-primary" /> },
            { title: "All campaigns", value: `${campaigns.length}`, icon: <MessageSquare size={22} className="text-primary" /> },
            { title: "Pending reviews", value: `${campaigns.filter((c) => c.status === "draft").length}`, icon: <Clock size={22} className="text-primary" /> },
          ].map((stat) => (
            <div key={stat.title} className="bg-white rounded-2xl border border-border p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">{stat.icon}</div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.title}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Campaigns</h2>
              <Link href="/dashboard/brand/campaigns" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            {campaigns.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p className="mb-4">No campaigns yet</p>
                <Link href="/dashboard/brand/campaigns/new" className="gradient-bg text-white px-6 py-2 rounded-xl text-sm font-medium">Create your first campaign</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {campaigns.slice(0, 5).map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-surface">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm mb-1">{campaign.title}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>S${campaign.paymentPerCreatorSGD?.toLocaleString()}/creator</span>
                        <span>{campaign.applications?.length || 0} applicants</span>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      campaign.status === "open" ? "bg-green-100 text-green-700" :
                      campaign.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                      campaign.status === "draft" ? "bg-gray-100 text-gray-700" :
                      "bg-purple-100 text-purple-700"
                    }`}>
                      {campaign.status === "open" ? "Open" : campaign.status === "in_progress" ? "In progress" : campaign.status === "draft" ? "Draft" : "Completed"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Top creators</h2>
              <Link href="/dashboard/brand/creators" className="text-sm text-primary hover:underline">Browse</Link>
            </div>
            {creators.length === 0 ? (
              <p className="text-center py-6 text-sm text-gray-500">No creators registered yet</p>
            ) : (
              <div className="space-y-4">
                {creators.map((creator) => (
                  <div key={creator.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {creator.displayName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate flex items-center gap-1">
                        {creator.handle}
                        {creator.verified && <CheckCircle2 size={12} className="text-blue-500" />}
                      </div>
                      <div className="text-xs text-gray-500">
                        {creator.categories.split(",")[0]} · {(creator.platforms.reduce((s, p) => s + p.followers, 0) / 1000).toFixed(0)}K
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{creator.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
