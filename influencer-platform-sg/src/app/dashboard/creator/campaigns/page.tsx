"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Search, Filter, Calendar, Tag, ArrowRight, Camera as Instagram, Film as Youtube, Loader2, CheckCircle2 } from "lucide-react";
import { mockCampaigns } from "@/lib/mock-data";
import { SocialPlatform } from "@/lib/types";
import { api } from "@/lib/api-client";

const categories = ["All", "Beauty", "F&B", "Fashion", "Fitness", "Tech", "Travel", "Lifestyle", "Parenting", "Home"];

function PlatformIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "instagram") return <Instagram size={14} />;
  if (platform === "youtube") return <Youtube size={14} />;
  if (platform === "tiktok") return <span className="text-[10px] font-bold">TT</span>;
  return <span className="text-[10px] font-bold">XHS</span>;
}

export default function CreatorCampaignsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const handleApply = async (campaignId: string) => {
    setApplyingTo(campaignId);
    try {
      await api.campaigns.apply({ campaignId, message: "I'd love to work on this campaign!" });
      setAppliedIds((prev) => [...prev, campaignId]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to apply");
    } finally {
      setApplyingTo(null);
    }
  };

  const openCampaigns = mockCampaigns.filter((c) => c.status === "open");
  const filtered = openCampaigns.filter((c) => {
    const matchesSearch = searchQuery === "" || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.brandName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || c.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="creator" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Browse campaigns</h1>
          <p className="text-sm text-gray-500 mt-1">Find campaigns that match your content</p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campaigns or brands..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm" />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-sm hover:bg-surface">
              <Filter size={16} />
              Filters
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat ? "gradient-bg text-white" : "bg-surface text-gray-600 hover:bg-gray-200"
                }`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4">{filtered.length} open campaigns</div>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <Tag size={36} className="text-primary/30" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-500">{campaign.brandName}</div>
                  <div className="flex items-center gap-1">
                    {campaign.platforms.map((p) => (
                      <span key={p} className="w-6 h-6 bg-surface rounded flex items-center justify-center">
                        <PlatformIcon platform={p} />
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-2">{campaign.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {campaign.categories.map((cat) => (
                    <span key={cat} className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">{cat}</span>
                  ))}
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  {campaign.deliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>{d.quantity}× {d.type.replace(/_/g, " ")}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <div className="font-bold text-lg text-primary">S${campaign.paymentPerCreatorSGD.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={10} /> Apply by {campaign.applicationDeadline}
                    </div>
                  </div>
                  {appliedIds.includes(campaign.id) ? (
                    <span className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      <CheckCircle2 size={14} /> Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(campaign.id)}
                      disabled={applyingTo === campaign.id}
                      className="flex items-center gap-1 px-4 py-2 gradient-bg text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                    >
                      {applyingTo === campaign.id ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                      {applyingTo === campaign.id ? "Applying..." : "Apply"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
