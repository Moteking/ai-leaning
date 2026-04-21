"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Calendar, DollarSign, MessageSquare, ExternalLink, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";

interface Application {
  id: string;
  campaignId: string;
  message: string;
  proposedRate: number | null;
  status: string;
  appliedAt: string;
  campaign: {
    id: string;
    title: string;
    description: string;
    paymentPerCreatorSGD: number;
    contentDeadline: string;
    brand: { name: string; company: string; id: string };
  };
}

export default function MyCampaignsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMsg, setSendingMsg] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = (await api.campaigns.list()) as { data: { applications: Application[] }[] };
      const allApps: Application[] = [];
      for (const campaign of res.data) {
        for (const app of campaign.applications || []) {
          allApps.push(app);
        }
      }
      setApplications(allApps);
    } catch {
      // no applications
    } finally {
      setLoading(false);
    }
  };

  const activeApps = applications.filter((a) => ["pending", "shortlisted", "accepted"].includes(a.status));
  const pastApps = applications.filter((a) => ["rejected", "withdrawn"].includes(a.status));

  const [tab, setTab] = useState<"active" | "past">("active");

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending: { label: "Awaiting response", color: "bg-yellow-100 text-yellow-700" },
    shortlisted: { label: "Shortlisted", color: "bg-blue-100 text-blue-700" },
    accepted: { label: "Accepted", color: "bg-green-100 text-green-700" },
    rejected: { label: "Not selected", color: "bg-gray-100 text-gray-600" },
    withdrawn: { label: "Withdrawn", color: "bg-gray-100 text-gray-600" },
  };

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
        <div className="mb-8">
          <h1 className="text-2xl font-bold">My campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">Track your applications and campaigns</p>
        </div>

        <div className="flex gap-1 bg-white rounded-xl border border-border p-1 mb-6 w-fit">
          <button onClick={() => setTab("active")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "active" ? "bg-primary text-white" : "text-gray-600 hover:bg-surface"}`}>
            Active ({activeApps.length})
          </button>
          <button onClick={() => setTab("past")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "past" ? "bg-primary text-white" : "text-gray-600 hover:bg-surface"}`}>
            Past ({pastApps.length})
          </button>
        </div>

        {(tab === "active" ? activeApps : pastApps).length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="mb-4">{tab === "active" ? "No active applications" : "No past applications"}</p>
            {tab === "active" && (
              <a href="/dashboard/creator/campaigns" className="gradient-bg text-white px-6 py-2 rounded-xl text-sm font-medium">Browse campaigns</a>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {(tab === "active" ? activeApps : pastApps).map((app) => (
              <div key={app.id} className="bg-white rounded-2xl border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="font-bold text-lg">{app.campaign?.title || "Campaign"}</h3>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusConfig[app.status]?.color || "bg-gray-100"}`}>
                        {statusConfig[app.status]?.label || app.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">{app.campaign?.brand?.company || app.campaign?.brand?.name}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-t border-b border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign size={16} className="text-gray-400" />
                    <div>
                      <div className="font-medium">S${app.campaign?.paymentPerCreatorSGD?.toLocaleString() || 0}</div>
                      <div className="text-xs text-gray-500">Payment</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-gray-400" />
                    <div>
                      <div className="font-medium">{new Date(app.appliedAt).toLocaleDateString("en-SG")}</div>
                      <div className="text-xs text-gray-500">Applied</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <div>
                      <div className="font-medium">{app.campaign?.contentDeadline || "—"}</div>
                      <div className="text-xs text-gray-500">Deadline</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  {app.campaign?.brand?.id && (
                    <button
                      onClick={async () => {
                        setSendingMsg(app.id);
                        try {
                          await api.messages.send({
                            recipientId: app.campaign.brand.id,
                            content: `Hi, I have a question about "${app.campaign.title}".`,
                            campaignTitle: app.campaign.title,
                          });
                          router.push("/dashboard/creator/messages");
                        } catch { alert("Failed to send message"); }
                        finally { setSendingMsg(null); }
                      }}
                      disabled={sendingMsg === app.id}
                      className="flex items-center gap-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface disabled:opacity-50"
                    >
                      {sendingMsg === app.id ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
                      Message brand
                    </button>
                  )}
                  {app.status === "accepted" && (
                    <button
                      onClick={() => {
                        const url = prompt("Paste the URL of your published content:");
                        if (url) alert(`Content submitted: ${url}\nThe brand will be notified.`);
                      }}
                      className="flex items-center gap-1 px-4 py-2 gradient-bg text-white rounded-lg text-sm font-medium hover:opacity-90"
                    >
                      Submit content
                    </button>
                  )}
                  <button
                    onClick={() => alert(`Campaign: ${app.campaign?.title}\n\nPayment: S$${app.campaign?.paymentPerCreatorSGD}\nDeadline: ${app.campaign?.contentDeadline}`)}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    View brief <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
