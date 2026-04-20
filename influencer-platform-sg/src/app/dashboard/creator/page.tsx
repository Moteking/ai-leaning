"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { DollarSign, ClipboardList, MessageSquare, CheckCircle2, Target, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { mockCampaigns } from "@/lib/mock-data";

export default function CreatorDashboard() {
  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="creator" />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Shermaine! 👋</h1>
            <p className="text-sm text-gray-500 mt-1">Here are your latest campaign opportunities</p>
          </div>
          <Link href="/dashboard/creator/campaigns" className="flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90">
            <Target size={16} />
            Browse campaigns
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Active campaigns", value: "2", subtitle: "In progress", icon: <Target className="text-primary" /> },
            { title: "Pending applications", value: "3", subtitle: "Awaiting response", icon: <ClipboardList className="text-primary" /> },
            { title: "Total earnings", value: "S$8,450", subtitle: "This month", icon: <DollarSign className="text-primary" /> },
            { title: "Unread messages", value: "4", subtitle: "Respond ASAP", icon: <MessageSquare className="text-primary" /> },
          ].map((stat) => (
            <div key={stat.title} className="bg-white rounded-2xl border border-border p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">{stat.icon}</div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.title}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.subtitle}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Recommended for you</h2>
              <Link href="/dashboard/creator/campaigns" className="text-sm text-primary hover:underline">See all</Link>
            </div>
            <div className="space-y-4">
              {mockCampaigns.filter((c) => c.status === "open").slice(0, 3).map((campaign) => (
                <div key={campaign.id} className="p-4 rounded-xl border border-border hover:bg-surface">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <div className="font-medium">{campaign.title}</div>
                        {campaign.categories.slice(0, 2).map((cat) => (
                          <span key={cat} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{cat}</span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">{campaign.brandName}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-primary">S${campaign.paymentPerCreatorSGD.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">per creator</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{campaign.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={12} />Apply by {campaign.applicationDeadline}</span>
                    </div>
                    <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                      View details <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold text-lg mb-4">Profile strength</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Complete your profile</span>
                <span className="font-bold">85%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full gradient-bg rounded-full" style={{ width: "85%" }} />
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: "Basic info", done: true },
                { label: "Social handles linked", done: true },
                { label: "Bio & categories", done: true },
                { label: "Rate card set", done: true },
                { label: "ID verification", done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${item.done ? "bg-green-500" : "bg-gray-200"}`}>
                    {item.done && <CheckCircle2 size={10} className="text-white" />}
                  </div>
                  <span className={item.done ? "text-gray-500" : ""}>{item.label}</span>
                </div>
              ))}
            </div>
            <Link href="/dashboard/creator/profile" className="mt-4 block text-center py-2 text-sm text-primary font-medium border-t border-border">
              Complete profile
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-border p-6">
          <h2 className="font-bold text-lg mb-4">Payment history</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Campaign</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Brand</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Amount</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Status</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { campaign: "Spring Fashion Collection", brand: "StyleCo SG", amount: 1800, status: "Paid", date: "2026-03-28" },
                  { campaign: "Hawker Heritage", brand: "Hawker Heritage", amount: 2500, status: "Processing", date: "2026-04-02" },
                  { campaign: "Skincare Review Series", brand: "Glow Skincare Co.", amount: 1500, status: "Pending", date: "2026-04-10" },
                  { campaign: "Smoothie Bowl Collab", brand: "FreshBites Café", amount: 800, status: "Paid", date: "2026-02-14" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-surface">
                    <td className="py-3 px-2">{row.campaign}</td>
                    <td className="py-3 px-2 text-gray-500">{row.brand}</td>
                    <td className="py-3 px-2 text-right font-bold">S${row.amount.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right">
                      <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        row.status === "Paid" ? "bg-green-100 text-green-700" :
                        row.status === "Processing" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>{row.status}</span>
                    </td>
                    <td className="py-3 px-2 text-right text-gray-500">{row.date}</td>
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
