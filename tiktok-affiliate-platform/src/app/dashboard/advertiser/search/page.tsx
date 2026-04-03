"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Search, SlidersHorizontal, Star, TrendingUp, Users, Eye, ShoppingBag, ExternalLink } from "lucide-react";
import { mockAffiliates } from "@/lib/mock-data";

const categories = [
  "すべて",
  "美容",
  "コスメ",
  "ファッション",
  "ガジェット",
  "フィットネス",
  "料理",
  "ペット",
  "テック",
];

export default function AffiliateSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [sortBy, setSortBy] = useState("score");

  const filteredAffiliates = mockAffiliates
    .filter((a) => {
      const matchesSearch =
        searchQuery === "" ||
        a.tiktokHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.bio.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "すべて" || a.categories.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "score") return b.affiliateScore - a.affiliateScore;
      if (sortBy === "followers") return b.followers - a.followers;
      if (sortBy === "gmv") return b.monthlyGmv - a.monthlyGmv;
      if (sortBy === "engagement") return b.engagementRate - a.engagementRate;
      return 0;
    });

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="advertiser" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">アフィリエイター検索</h1>
          <p className="text-sm text-gray-500 mt-1">
            売上実績・エンゲージメント率で最適なアフィリエイターを見つけましょう
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="アフィリエイター名やキーワードで検索..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border border-border text-sm outline-none focus:border-primary"
              >
                <option value="score">スコア順</option>
                <option value="followers">フォロワー順</option>
                <option value="gmv">売上順</option>
                <option value="engagement">エンゲージメント順</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-sm hover:bg-surface transition-colors">
                <SlidersHorizontal size={16} />
                詳細フィルター
              </button>
            </div>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "gradient-bg text-white"
                    : "bg-surface text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500 mb-4">{filteredAffiliates.length}件のアフィリエイターが見つかりました</div>

        {/* Results */}
        <div className="space-y-4">
          {filteredAffiliates.map((affiliate) => (
            <div
              key={affiliate.id}
              className="bg-white rounded-2xl border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Avatar & Basic Info */}
                <div className="flex items-start gap-4 lg:w-72">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {affiliate.tiktokHandle.charAt(1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{affiliate.tiktokHandle}</div>
                    <div className="text-sm text-gray-500 mb-2">{affiliate.region}</div>
                    <div className="flex flex-wrap gap-1">
                      {affiliate.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-xl bg-surface">
                    <Users size={18} className="text-gray-400 mx-auto mb-1" />
                    <div className="font-bold text-sm">
                      {(affiliate.followers / 10000).toFixed(1)}万
                    </div>
                    <div className="text-xs text-gray-500">フォロワー</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-surface">
                    <Eye size={18} className="text-gray-400 mx-auto mb-1" />
                    <div className="font-bold text-sm">
                      {(affiliate.avgViews / 10000).toFixed(1)}万
                    </div>
                    <div className="text-xs text-gray-500">平均再生</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-surface">
                    <TrendingUp size={18} className="text-gray-400 mx-auto mb-1" />
                    <div className="font-bold text-sm">{affiliate.engagementRate}%</div>
                    <div className="text-xs text-gray-500">エンゲージメント</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-surface">
                    <ShoppingBag size={18} className="text-gray-400 mx-auto mb-1" />
                    <div className="font-bold text-sm">
                      ¥{(affiliate.monthlyGmv / 10000).toFixed(0)}万
                    </div>
                    <div className="text-xs text-gray-500">月間GMV</div>
                  </div>
                </div>

                {/* Score & Action */}
                <div className="flex lg:flex-col items-center gap-4 lg:w-32">
                  <div className="text-center">
                    <div className="flex items-center gap-1 mb-1">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-2xl font-bold">{affiliate.affiliateScore}</span>
                    </div>
                    <div className="text-xs text-gray-500">スコア</div>
                  </div>
                  <button className="gradient-bg text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1">
                    詳細 <ExternalLink size={14} />
                  </button>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-gray-600">{affiliate.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
