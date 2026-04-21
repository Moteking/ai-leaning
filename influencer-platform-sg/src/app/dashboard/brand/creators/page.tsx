"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Search, SlidersHorizontal, Star, CheckCircle2, Heart, Camera as Instagram, Film as Youtube, MapPin, Languages, MessageSquare, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { mockCreators } from "@/lib/mock-data";
import { SocialPlatform } from "@/lib/types";
import { api } from "@/lib/api-client";

const categories = ["All", "Beauty", "F&B", "Fashion", "Fitness", "Tech", "Travel", "Lifestyle", "Parenting", "Home", "Gadgets", "Wellness"];
const platformFilters: { value: SocialPlatform | "all"; label: string }[] = [
  { value: "all", label: "All platforms" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "xiaohongshu", label: "Xiaohongshu" },
];

function PlatformIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "instagram") return <Instagram size={14} />;
  if (platform === "youtube") return <Youtube size={14} />;
  if (platform === "tiktok") return <span className="text-xs font-bold">TT</span>;
  return <span className="text-xs font-bold">XHS</span>;
}

export default function CreatorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | "all">("all");
  const [savedCreators, setSavedCreators] = useState<string[]>([]);
  const [messagingCreator, setMessagingCreator] = useState<string | null>(null);
  const [messageSent, setMessageSent] = useState<string[]>([]);
  const router = useRouter();

  const handleMessage = async (creatorUserId: string, creatorName: string) => {
    setMessagingCreator(creatorUserId);
    try {
      await api.messages.send({
        recipientId: creatorUserId,
        content: `Hi ${creatorName}! I'd like to discuss a potential campaign collaboration with you.`,
      });
      setMessageSent((prev) => [...prev, creatorUserId]);
      router.push("/dashboard/brand/messages");
    } catch {
      alert("Failed to send message. Make sure you are logged in.");
    } finally {
      setMessagingCreator(null);
    }
  };

  const handleInvite = async (creatorName: string, creatorUserId: string) => {
    const campaignTitle = prompt(`Enter the campaign title to invite ${creatorName} to:`);
    if (!campaignTitle) return;
    setMessagingCreator(creatorUserId);
    try {
      await api.messages.send({
        recipientId: creatorUserId,
        content: `Hi ${creatorName}! We'd like to invite you to our campaign "${campaignTitle}". Are you interested?`,
        campaignTitle,
      });
      alert(`Invitation sent to ${creatorName}!`);
    } catch {
      alert("Failed to send invitation. Make sure you are logged in.");
    } finally {
      setMessagingCreator(null);
    }
  };

  const filteredCreators = mockCreators.filter((creator) => {
    const matchesSearch =
      searchQuery === "" ||
      creator.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || creator.categories.includes(selectedCategory);
    const matchesPlatform = selectedPlatform === "all" || creator.platforms.some((p) => p.platform === selectedPlatform);
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  const toggleSave = (id: string) => {
    setSavedCreators((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="brand" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Discover Creators</h1>
          <p className="text-sm text-gray-500 mt-1">Browse verified creators across Singapore</p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, handle, or keyword..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border outline-none focus:border-primary text-sm"
              />
            </div>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as SocialPlatform | "all")}
              className="px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary bg-white"
            >
              {platformFilters.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-sm hover:bg-surface">
              <SlidersHorizontal size={16} />
              More filters
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat ? "gradient-bg text-white" : "bg-surface text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4">{filteredCreators.length} creators found</div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredCreators.map((creator) => {
            const totalFollowers = creator.platforms.reduce((sum, p) => sum + p.followers, 0);
            const isSaved = savedCreators.includes(creator.id);

            return (
              <div key={creator.id} className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {creator.displayName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg truncate">{creator.handle}</h3>
                      {creator.verified && <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0" />}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{creator.displayName}</div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={10} />{creator.city}</span>
                      <span className="flex items-center gap-1"><Languages size={10} />{creator.languages.join(", ")}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSave(creator.id)}
                    className="p-2 rounded-lg hover:bg-surface"
                  >
                    <Heart size={18} className={isSaved ? "text-red-500 fill-red-500" : "text-gray-400"} />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{creator.bio}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {creator.categories.map((cat) => (
                    <span key={cat} className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium">{cat}</span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-border">
                  <div className="text-center">
                    <div className="font-bold text-lg">{(totalFollowers / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500">Total reach</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{creator.completedCampaigns}</div>
                    <div className="text-xs text-gray-500">Campaigns</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg flex items-center justify-center gap-0.5">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      {creator.averageRating}
                    </div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {creator.platforms.map((p) => (
                    <div key={p.platform} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-600">
                        <PlatformIcon platform={p.platform} />
                        {p.handle}
                      </span>
                      <span className="font-medium">{(p.followers / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>

                <div className="bg-surface rounded-xl p-3 mb-4">
                  <div className="text-xs text-gray-500 mb-2">Rate card (starting from)</div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    {creator.rateCardSGD.instagramPost && (
                      <span>IG post: <strong>S${creator.rateCardSGD.instagramPost}</strong></span>
                    )}
                    {creator.rateCardSGD.instagramReel && (
                      <span>IG reel: <strong>S${creator.rateCardSGD.instagramReel}</strong></span>
                    )}
                    {creator.rateCardSGD.tiktokVideo && (
                      <span>TikTok: <strong>S${creator.rateCardSGD.tiktokVideo}</strong></span>
                    )}
                    {creator.rateCardSGD.youtubeVideo && (
                      <span>YT video: <strong>S${creator.rateCardSGD.youtubeVideo}</strong></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMessage(creator.id, creator.displayName)}
                    disabled={messagingCreator === creator.id}
                    className="flex-1 flex items-center justify-center gap-1 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface disabled:opacity-50"
                  >
                    {messagingCreator === creator.id ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
                    {messageSent.includes(creator.id) ? "Messaged" : "Message"}
                  </button>
                  <button
                    onClick={() => handleInvite(creator.displayName, creator.id)}
                    disabled={messagingCreator === creator.id}
                    className="flex-1 py-2 gradient-bg text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    Invite to campaign
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
