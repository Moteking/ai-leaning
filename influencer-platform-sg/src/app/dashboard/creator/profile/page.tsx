"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Star, MapPin, CheckCircle2, Plus, Edit3, Camera, Loader2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { SocialPlatform } from "@/lib/types";

interface Profile {
  id: string;
  email: string;
  name: string;
  role: string;
  creatorProfile: {
    handle: string;
    displayName: string;
    bio: string;
    city: string;
    languages: string;
    categories: string;
    verified: boolean;
    completedCampaigns: number;
    averageRating: number;
    platforms: { platform: string; handle: string; followers: number }[];
    rateCard: Record<string, number | null> | null;
  } | null;
}

export default function CreatorProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.auth.me()
      .then((data) => setProfile(data as Profile))
      .catch(() => {})
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

  const cp = profile?.creatorProfile;

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="creator" />

      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My profile</h1>
            <p className="text-sm text-gray-500 mt-1">This is what brands see when they discover you</p>
          </div>
          <Link href="/dashboard/creator/settings" className="flex items-center gap-2 px-4 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90">
            <Edit3 size={14} /> Edit profile
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-border overflow-hidden mb-8">
          <div className="h-32 gradient-bg" />
          <div className="px-8 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-3xl border-4 border-white shadow-lg">
                {profile?.name?.charAt(0) || "?"}
              </div>
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{cp?.handle || profile?.name}</h2>
                  {cp?.verified && <CheckCircle2 size={18} className="text-blue-500" />}
                </div>
                <div className="text-sm text-gray-600 mb-1">{cp?.displayName || profile?.name}</div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={14} />{cp?.city || "Singapore"}</span>
                  <span>Languages: {cp?.languages?.replace(/,/g, ", ") || "English"}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 max-w-2xl">{cp?.bio || "No bio yet. Edit your profile to add one."}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {cp?.categories?.split(",").filter(Boolean).map((cat) => (
                <span key={cat} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{cat}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total followers", value: cp?.platforms ? `${(cp.platforms.reduce((s, p) => s + p.followers, 0) / 1000).toFixed(0)}K` : "0" },
            { label: "Campaigns completed", value: cp?.completedCampaigns || 0 },
            { label: "Average rating", value: cp?.averageRating ? `${cp.averageRating.toFixed(1)}/5.0` : "—" },
            { label: "Platforms", value: cp?.platforms?.length || 0 },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-border p-5 text-center">
              <div className="font-bold text-2xl mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Connected platforms</h3>
            </div>
            {(!cp?.platforms || cp.platforms.length === 0) ? (
              <p className="text-sm text-gray-500 py-4">No platforms connected yet. Add your social handles in settings.</p>
            ) : (
              <div className="space-y-3">
                {cp.platforms.map((p) => (
                  <div key={p.platform} className="flex items-center justify-between p-3 border border-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-xs font-bold">
                        {p.platform === "instagram" ? "IG" : p.platform === "tiktok" ? "TT" : p.platform === "youtube" ? "YT" : "XHS"}
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
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
