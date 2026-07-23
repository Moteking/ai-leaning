"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { DollarSign, ClipboardList, MessageSquare, Target, ArrowRight, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

interface CampaignItem {
  id: string;
  title: string;
  description: string;
  brandName?: string;
  brand?: { name: string; company: string };
  paymentPerCreatorSGD: number;
  applicationDeadline: string;
  categories: string;
  status: string;
}

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.campaigns.list({ status: "open" })
      .then((r) => setCampaigns(((r as { data: CampaignItem[] }).data || []).slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-surface">
        <DashboardSidebar role="creator" />
        <main className="flex-1 flex items-center justify-center"><Loader2 size={32} className="animate-spin text-primary" /></main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="creator" />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome back{user ? `, ${user.name}` : ""}!</h1>
            <p className="text-sm text-gray-500 mt-1">Here are your latest campaign opportunities</p>
          </div>
          <Link href="/dashboard/creator/campaigns" className="flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90">
            <Target size={16} /> Browse campaigns
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Open campaigns</h2>
              <Link href="/dashboard/creator/campaigns" className="text-sm text-primary hover:underline">See all</Link>
            </div>
            {campaigns.length === 0 ? (
              <p className="text-center py-10 text-sm text-gray-500">No open campaigns right now. Check back later!</p>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="p-4 rounded-xl border border-border hover:bg-surface">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <div className="font-medium">{campaign.title}</div>
                          {campaign.categories.split(",").filter(Boolean).slice(0, 2).map((cat) => (
                            <span key={cat} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{cat}</span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500">{campaign.brand?.company || campaign.brand?.name}</div>
                      </div>
                      </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{campaign.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Clock size={12} />Apply by {campaign.applicationDeadline || "TBD"}</span>
                      </div>
                      <Link href="/dashboard/creator/campaigns" className="flex items-center gap-1 text-sm text-primary hover:underline">
                        View details <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold text-lg mb-4">Quick links</h2>
            <div className="space-y-2">
              <Link href="/dashboard/creator/campaigns" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface text-sm">
                <Target size={18} className="text-primary" /> Browse open campaigns
              </Link>
              <Link href="/dashboard/creator/my-campaigns" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface text-sm">
                <ClipboardList size={18} className="text-primary" /> My campaigns
              </Link>
              <Link href="/dashboard/creator/messages" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface text-sm">
                <MessageSquare size={18} className="text-primary" /> Messages
              </Link>
              <Link href="/dashboard/creator/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface text-sm">
                <ClipboardList size={18} className="text-primary" /> Edit profile
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
