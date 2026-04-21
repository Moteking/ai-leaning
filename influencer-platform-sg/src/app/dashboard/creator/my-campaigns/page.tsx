"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Calendar, DollarSign, MessageSquare, ExternalLink, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";

const myApplications = [
  {
    id: "a1",
    title: "New Vitamin C Serum Launch",
    brand: "Glow Skincare Co.",
    payment: 1500,
    status: "shortlisted" as const,
    appliedAt: "2026-04-12",
    deadline: "2026-05-15",
  },
  {
    id: "a2",
    title: "HDB Home Makeover Series",
    brand: "HomeStyle SG",
    payment: 2000,
    status: "accepted" as const,
    appliedAt: "2026-04-08",
    deadline: "2026-05-30",
  },
  {
    id: "a3",
    title: "Café Hopping SG Series",
    brand: "Local Brews Co.",
    payment: 800,
    status: "pending" as const,
    appliedAt: "2026-04-14",
    deadline: "2026-04-30",
  },
  {
    id: "a4",
    title: "Summer Swimwear Collection",
    brand: "Coastal SG",
    payment: 1200,
    status: "rejected" as const,
    appliedAt: "2026-04-01",
    deadline: "2026-04-20",
  },
];

const pastCampaigns = [
  { title: "Spring Fashion Collection", brand: "StyleCo SG", amount: 1800, completedAt: "2026-03-28", rating: 5 },
  { title: "Smoothie Bowl Collab", brand: "FreshBites Café", amount: 800, completedAt: "2026-02-14", rating: 5 },
  { title: "New Year Glow Campaign", brand: "Luxe Beauty", amount: 2200, completedAt: "2026-01-30", rating: 4 },
];

export default function MyCampaignsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"active" | "past">("active");
  const [sendingMsg, setSendingMsg] = useState<string | null>(null);

  const statusConfig = {
    pending: { label: "Awaiting response", color: "bg-yellow-100 text-yellow-700" },
    shortlisted: { label: "Shortlisted", color: "bg-blue-100 text-blue-700" },
    accepted: { label: "Accepted", color: "bg-green-100 text-green-700" },
    rejected: { label: "Not selected", color: "bg-gray-100 text-gray-600" },
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="creator" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">My campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">Track your applications and completed campaigns</p>
        </div>

        <div className="flex gap-1 bg-white rounded-xl border border-border p-1 mb-6 w-fit">
          <button onClick={() => setTab("active")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "active" ? "bg-primary text-white" : "text-gray-600 hover:bg-surface"}`}>
            Active & pending ({myApplications.length})
          </button>
          <button onClick={() => setTab("past")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "past" ? "bg-primary text-white" : "text-gray-600 hover:bg-surface"}`}>
            Completed ({pastCampaigns.length})
          </button>
        </div>

        {tab === "active" && (
          <div className="space-y-4">
            {myApplications.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-bold text-lg">{app.title}</h3>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusConfig[app.status].color}`}>
                        {statusConfig[app.status].label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">{app.brand}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign size={16} className="text-gray-400" />
                    <div>
                      <div className="font-medium">S${app.payment.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Payment</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-gray-400" />
                    <div>
                      <div className="font-medium">{app.appliedAt}</div>
                      <div className="text-xs text-gray-500">Applied</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <div>
                      <div className="font-medium">{app.deadline}</div>
                      <div className="text-xs text-gray-500">Content deadline</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="font-medium">
                      {app.status === "accepted" ? "Action required" : app.status === "shortlisted" ? "In review" : "Waiting"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={async () => {
                      setSendingMsg(app.id);
                      try {
                        await api.messages.send({
                          recipientId: "brand-placeholder-id",
                          content: `Hi, I have a question about the "${app.title}" campaign.`,
                          campaignTitle: app.title,
                        });
                        router.push("/dashboard/creator/messages");
                      } catch { alert("Failed to send message. Please try from the Messages page."); }
                      finally { setSendingMsg(null); }
                    }}
                    disabled={sendingMsg === app.id}
                    className="flex items-center gap-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface disabled:opacity-50"
                  >
                    {sendingMsg === app.id ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
                    Message brand
                  </button>
                  {app.status === "accepted" && (
                    <button
                      onClick={() => {
                        const url = prompt("Paste the URL of your published content:");
                        if (url) alert(`Content submitted: ${url}\nThe brand will be notified for review.`);
                      }}
                      className="flex items-center gap-1 px-4 py-2 gradient-bg text-white rounded-lg text-sm font-medium hover:opacity-90"
                    >
                      Submit content
                    </button>
                  )}
                  <button
                    onClick={() => alert(`Campaign Brief: ${app.title}\n\nBrand: ${app.brand}\nPayment: S$${app.payment.toLocaleString()}\nDeadline: ${app.deadline}`)}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    View brief <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "past" && (
          <div className="space-y-3">
            {pastCampaigns.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-5 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{c.title}</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                      <CheckCircle2 size={10} /> Paid
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{c.brand}</span>
                    <span>{c.completedAt}</span>
                    <span>{"★".repeat(c.rating)}{"☆".repeat(5 - c.rating)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">S${c.amount.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Earned</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
