"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { Star, MapPin, CheckCircle2, Camera as InstagramIcon, Film as YoutubeIcon, Plus, Edit3, Camera } from "lucide-react";
const Instagram = InstagramIcon;
const Youtube = YoutubeIcon;
import { mockCreators } from "@/lib/mock-data";
import { SocialPlatform } from "@/lib/types";

function PlatformIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "instagram") return <Instagram size={16} />;
  if (platform === "youtube") return <Youtube size={16} />;
  if (platform === "tiktok") return <span className="text-xs font-bold">TikTok</span>;
  return <span className="text-xs font-bold">XHS</span>;
}

export default function CreatorProfilePage() {
  const me = mockCreators[0];

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="creator" />

      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My profile</h1>
            <p className="text-sm text-gray-500 mt-1">This is what brands see when they discover you</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90">
            <Edit3 size={14} /> Edit profile
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-border overflow-hidden mb-8">
          <div className="h-32 gradient-bg relative">
            <button className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-white/30">
              Change cover
            </button>
          </div>
          <div className="px-8 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-3xl border-4 border-white shadow-lg">
                  {me.displayName.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-border rounded-full flex items-center justify-center shadow-sm">
                  <Camera size={14} className="text-gray-500" />
                </button>
              </div>
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{me.handle}</h2>
                  {me.verified && <CheckCircle2 size={18} className="text-blue-500" />}
                </div>
                <div className="text-sm text-gray-600 mb-1">{me.displayName}</div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={14} />{me.city}</span>
                  <span>Languages: {me.languages.join(", ")}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 max-w-2xl">{me.bio}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {me.categories.map((cat) => (
                <span key={cat} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{cat}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total followers", value: `${(me.platforms.reduce((s, p) => s + p.followers, 0) / 1000).toFixed(0)}K` },
            { label: "Campaigns completed", value: me.completedCampaigns },
            { label: "Average rating", value: `${me.averageRating}/5.0` },
            { label: "Member since", value: "Aug 2024" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-border p-5 text-center">
              <div className="font-bold text-2xl mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Connected platforms</h3>
              <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                <Plus size={14} /> Add platform
              </button>
            </div>
            <div className="space-y-3">
              {me.platforms.map((p) => (
                <div key={p.platform} className="flex items-center justify-between p-3 border border-border rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center">
                      <PlatformIcon platform={p.platform} />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{p.handle}</div>
                      <div className="text-xs text-gray-500">{(p.followers / 1000).toFixed(0)}K followers</div>
                    </div>
                  </div>
                  <CheckCircle2 size={16} className="text-green-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Rate card (SGD)</h3>
              <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                <Edit3 size={14} /> Edit
              </button>
            </div>
            <div className="space-y-3">
              {Object.entries(me.rateCardSGD).filter(([, v]) => v).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-surface rounded-xl">
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                  <span className="font-bold">S${value?.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              These are starting rates. Brands can negotiate specific prices per campaign.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-4">Recent reviews from brands</h3>
          <div className="space-y-4">
            {[
              { brand: "StyleCo SG", rating: 5, comment: "Shermaine delivered beyond expectations. Professional and on-time.", campaign: "Spring Fashion Collection" },
              { brand: "FreshBites Café", rating: 5, comment: "Loved her creative approach. Would definitely work with her again.", campaign: "Smoothie Bowl Collab" },
              { brand: "Luxe Beauty", rating: 4, comment: "Great content and engagement. Fast turnaround.", campaign: "New Year Glow Campaign" },
            ].map((review, i) => (
              <div key={i} className="p-4 border border-border rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">{review.brand}</div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, ix) => (
                      <Star key={ix} size={12} className={ix < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">&ldquo;{review.comment}&rdquo;</p>
                <div className="text-xs text-gray-400">{review.campaign}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
