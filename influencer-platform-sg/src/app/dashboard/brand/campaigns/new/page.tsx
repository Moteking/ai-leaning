"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { ArrowLeft, Upload, Save, Send, Plus, Minus, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { SocialPlatform } from "@/lib/types";
import { api } from "@/lib/api-client";

const allCategories = ["Beauty", "F&B", "Fashion", "Fitness", "Tech", "Travel", "Lifestyle", "Parenting", "Home", "Gadgets", "Wellness"];

type DeliverableType = "instagram_post" | "instagram_reel" | "instagram_story" | "tiktok_video" | "youtube_video" | "youtube_short";

const deliverableOptions: { value: DeliverableType; label: string }[] = [
  { value: "instagram_post", label: "Instagram Post" },
  { value: "instagram_reel", label: "Instagram Reel" },
  { value: "instagram_story", label: "Instagram Story" },
  { value: "tiktok_video", label: "TikTok Video" },
  { value: "youtube_video", label: "YouTube Video" },
  { value: "youtube_short", label: "YouTube Short" },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    briefMarkdown: "",
    productName: "",
    budgetSGD: "",
    paymentPerCreatorSGD: "",
    targetCity: "Singapore",
    minFollowers: "",
    maxFollowers: "",
    applicationDeadline: "",
    contentDeadline: "",
    startDate: "",
    endDate: "",
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [deliverables, setDeliverables] = useState<{ type: DeliverableType; quantity: number; requirements: string }[]>([
    { type: "instagram_reel", quantity: 1, requirements: "" },
  ]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms((prev) => prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]);
  };

  const addDeliverable = () => {
    setDeliverables((prev) => [...prev, { type: "instagram_post", quantity: 1, requirements: "" }]);
  };

  const removeDeliverable = (index: number) => {
    setDeliverables((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDeliverable = (index: number, field: string, value: string | number) => {
    setDeliverables((prev) => prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
  };

  const handleSave = async (status: string) => {
    setError("");
    if (!formData.title || !formData.description) {
      setError("Title and description are required");
      return;
    }
    setLoading(true);
    try {
      await api.campaigns.create({
        ...formData,
        status,
        categories: selectedCategories,
        platforms: selectedPlatforms,
        budgetSGD: parseInt(formData.budgetSGD) || 0,
        paymentPerCreatorSGD: parseInt(formData.paymentPerCreatorSGD) || 0,
        minFollowers: parseInt(formData.minFollowers) || 0,
        maxFollowers: parseInt(formData.maxFollowers) || 0,
        deliverables,
      });
      router.push("/dashboard/brand/campaigns");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="brand" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <Link href="/dashboard/brand/campaigns" className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4">
            <ArrowLeft size={16} /> Back to campaigns
          </Link>
          <h1 className="text-2xl font-bold">Create new campaign</h1>
          <p className="text-sm text-gray-500 mt-1">Post a brief to attract the right creators</p>
        </div>

        <div className="max-w-3xl">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
          )}

          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleSave("open"); }}>
            {/* Basic */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-5">Campaign basics</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Campaign title <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.title} onChange={(e) => updateField("title", e.target.value)}
                    placeholder="e.g. Summer Skincare Launch"
                    className="w-full px-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Short description <span className="text-red-500">*</span></label>
                  <textarea value={formData.description} onChange={(e) => updateField("description", e.target.value)}
                    rows={3} placeholder="One-line description that creators will see first"
                    className="w-full px-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary text-sm resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full brief</label>
                  <textarea value={formData.briefMarkdown} onChange={(e) => updateField("briefMarkdown", e.target.value)}
                    rows={6} placeholder="Details, requirements, do's and don'ts, hashtags, mentions, etc. Supports Markdown."
                    className="w-full px-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary text-sm resize-none font-mono" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Product / service name</label>
                  <input type="text" value={formData.productName} onChange={(e) => updateField("productName", e.target.value)}
                    placeholder="e.g. Glow Vitamin C Serum"
                    className="w-full px-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Product images</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary cursor-pointer">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <div className="text-sm text-gray-500">Drag & drop or click to upload</div>
                    <div className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories & Platforms */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-5">Categories & platforms</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Categories <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    {allCategories.map((cat) => (
                      <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedCategories.includes(cat) ? "gradient-bg text-white" : "bg-surface text-gray-600 hover:bg-gray-200"
                        }`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Platforms <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    {(["instagram", "tiktok", "youtube", "xiaohongshu"] as SocialPlatform[]).map((p) => (
                      <button key={p} type="button" onClick={() => togglePlatform(p)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedPlatforms.includes(p) ? "gradient-bg text-white" : "bg-surface text-gray-600 hover:bg-gray-200"
                        }`}>
                        {p === "instagram" ? "Instagram" : p === "tiktok" ? "TikTok" : p === "youtube" ? "YouTube" : "Xiaohongshu"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Deliverables */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-lg">Deliverables</h2>
                <button type="button" onClick={addDeliverable} className="flex items-center gap-1 text-sm text-primary hover:underline">
                  <Plus size={14} /> Add deliverable
                </button>
              </div>
              <div className="space-y-3">
                {deliverables.map((d, i) => (
                  <div key={i} className="p-4 border border-border rounded-xl space-y-3">
                    <div className="flex items-center gap-3">
                      <select value={d.type} onChange={(e) => updateDeliverable(i, "type", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-border text-sm outline-none bg-white">
                        {deliverableOptions.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <input type="number" min="1" value={d.quantity} onChange={(e) => updateDeliverable(i, "quantity", parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-2 rounded-lg border border-border text-sm outline-none" />
                      <span className="text-sm text-gray-500">qty</span>
                      {deliverables.length > 1 && (
                        <button type="button" onClick={() => removeDeliverable(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                          <Minus size={14} />
                        </button>
                      )}
                    </div>
                    <textarea value={d.requirements} onChange={(e) => updateDeliverable(i, "requirements", e.target.value)}
                      placeholder="Specific requirements for this deliverable..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none resize-none" />
                  </div>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-5">Budget & payment</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Payment per creator (SGD) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">S$</span>
                    <input type="number" value={formData.paymentPerCreatorSGD} onChange={(e) => updateField("paymentPerCreatorSGD", e.target.value)}
                      placeholder="1500"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Total campaign budget (SGD) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">S$</span>
                    <input type="number" value={formData.budgetSGD} onChange={(e) => updateField("budgetSGD", e.target.value)}
                      placeholder="15000"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary text-sm" />
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-blue-50 rounded-xl p-3 flex items-start gap-2">
                <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-700">
                  A 5% service fee applies to each completed campaign payment. Payments are released to creators only after you approve the content.
                </div>
              </div>
            </div>

            {/* Creator requirements */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-5">Creator requirements</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Min followers</label>
                  <input type="number" value={formData.minFollowers} onChange={(e) => updateField("minFollowers", e.target.value)}
                    placeholder="50000"
                    className="w-full px-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Max followers</label>
                  <input type="number" value={formData.maxFollowers} onChange={(e) => updateField("maxFollowers", e.target.value)}
                    placeholder="500000"
                    className="w-full px-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary text-sm" />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-5">Timeline</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Application deadline <span className="text-red-500">*</span></label>
                  <input type="date" value={formData.applicationDeadline} onChange={(e) => updateField("applicationDeadline", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Content delivery deadline <span className="text-red-500">*</span></label>
                  <input type="date" value={formData.contentDeadline} onChange={(e) => updateField("contentDeadline", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Campaign start</label>
                  <input type="date" value={formData.startDate} onChange={(e) => updateField("startDate", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Campaign end</label>
                  <input type="date" value={formData.endDate} onChange={(e) => updateField("endDate", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary text-sm" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pb-8">
              <Link href="/dashboard/brand/campaigns" className="px-5 py-2.5 text-sm text-gray-500 hover:text-gray-700">Cancel</Link>
              <div className="flex items-center gap-3">
                <button type="button" disabled={loading} onClick={() => handleSave("draft")} className="flex items-center gap-2 px-6 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-surface disabled:opacity-50">
                  <Save size={16} />
                  Save draft
                </button>
                <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {loading ? "Publishing..." : "Publish campaign"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
