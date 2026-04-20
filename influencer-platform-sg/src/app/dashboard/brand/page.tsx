"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Megaphone,
  Users,
  MessageSquare,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  Star,
} from "lucide-react";
import Link from "next/link";
import { mockCampaigns, mockCreators } from "@/lib/mock-data";

function StatCard({ title, value, subtitle, icon }: { title: string; value: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">{icon}</div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
    </div>
  );
}

export default function BrandDashboard() {
  const activeCampaigns = mockCampaigns.filter((c) => c.status === "open" || c.status === "in_progress");
  const totalApplicants = mockCampaigns.reduce((sum, c) => sum + c.applicants.length, 0);

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="brand" />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening with your campaigns.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/brand/creators" className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-white">
              <Search size={16} />
              Find creators
            </Link>
            <Link href="/dashboard/brand/campaigns/new" className="flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90">
              <Plus size={16} />
              New campaign
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Active campaigns" value={`${activeCampaigns.length}`} subtitle="Running now" icon={<Megaphone size={22} className="text-primary" />} />
          <StatCard title="Total applications" value={`${totalApplicants}`} subtitle="Awaiting review: 2" icon={<Users size={22} className="text-primary" />} />
          <StatCard title="Messages" value="8" subtitle="3 unread" icon={<MessageSquare size={22} className="text-primary" />} />
          <StatCard title="Pending reviews" value="4" subtitle="Content to approve" icon={<Clock size={22} className="text-primary" />} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Active campaigns</h2>
              <Link href="/dashboard/brand/campaigns" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-4">
              {mockCampaigns.slice(0, 4).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-surface">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">{campaign.title}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>S${campaign.paymentPerCreatorSGD.toLocaleString()}/creator</span>
                      <span>{campaign.applicants.length} applicants</span>
                      <span>Deadline: {campaign.applicationDeadline}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    campaign.status === "open" ? "bg-green-100 text-green-700" :
                    campaign.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                    campaign.status === "draft" ? "bg-gray-100 text-gray-700" :
                    "bg-purple-100 text-purple-700"
                  }`}>
                    {campaign.status === "open" ? "Open" :
                     campaign.status === "in_progress" ? "In progress" :
                     campaign.status === "draft" ? "Draft" : "Completed"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Recommended creators</h2>
              <Link href="/dashboard/brand/creators" className="text-sm text-primary hover:underline">Browse</Link>
            </div>
            <div className="space-y-4">
              {mockCreators.slice(0, 5).map((creator) => (
                <Link key={creator.id} href="/dashboard/brand/creators" className="flex items-center gap-3 hover:bg-surface rounded-xl p-2 -m-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {creator.displayName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate flex items-center gap-1">
                      {creator.handle}
                      {creator.verified && <CheckCircle2 size={12} className="text-blue-500" />}
                    </div>
                    <div className="text-xs text-gray-500">
                      {creator.categories[0]} · {(creator.platforms.reduce((sum, p) => sum + p.followers, 0) / 1000).toFixed(0)}K followers
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{creator.averageRating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-border p-6">
          <h2 className="font-bold text-lg mb-4">Getting started checklist</h2>
          <div className="space-y-3">
            {[
              { text: "Complete your brand profile", done: true },
              { text: "Post your first campaign brief", done: true },
              { text: "Browse and shortlist 5 creators", done: false },
              { text: "Approve your first deliverable", done: false },
              { text: "Invite team members to collaborate", done: false },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? "bg-green-500" : "bg-gray-200"}`}>
                  {item.done && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <span className={`text-sm ${item.done ? "text-gray-400 line-through" : ""}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
