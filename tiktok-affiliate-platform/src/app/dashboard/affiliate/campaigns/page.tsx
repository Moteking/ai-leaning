"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Search, Filter, DollarSign, Calendar, Tag, ArrowRight } from "lucide-react";
import { mockCampaigns } from "@/lib/mock-data";

const categories = ["すべて", "美容", "コスメ", "ファッション", "ガジェット", "フィットネス", "料理", "ペット"];

export default function AffiliateCampaignsPage() {
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [searchQuery, setSearchQuery] = useState("");

  const activeCampaigns = mockCampaigns.filter((c) => c.status === "active");
  const filteredCampaigns = activeCampaigns.filter((c) => {
    const matchesSearch =
      searchQuery === "" ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "すべて" || c.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="affiliate" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">案件を探す</h1>
          <p className="text-sm text-gray-500 mt-1">あなたに合った案件を見つけて応募しましょう</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="案件名や商品名で検索..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border text-sm hover:bg-surface transition-colors">
              <Filter size={16} />
              フィルター
            </button>
          </div>

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

        <div className="text-sm text-gray-500 mb-4">{filteredCampaigns.length}件の案件が見つかりました</div>

        {/* Campaign Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image Placeholder */}
              <div className="h-40 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <Tag size={40} className="text-primary/30" />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {campaign.categories.map((cat) => (
                    <span key={cat} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {cat}
                    </span>
                  ))}
                </div>

                <h3 className="font-bold text-lg mb-2">{campaign.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign size={16} className="text-primary" />
                    <div>
                      <div className="font-bold text-primary">
                        {campaign.commissionType === "percentage"
                          ? `${campaign.commissionRate}%`
                          : `¥${campaign.commissionRate.toLocaleString()}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {campaign.commissionType === "percentage" ? "成果報酬" : "固定報酬"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <div>
                      <div className="font-medium text-sm">{campaign.endDate}まで</div>
                      <div className="text-xs text-gray-500">募集期限</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-sm text-gray-500">
                    商品: <span className="font-medium text-gray-700">{campaign.productName}</span>
                  </div>
                  <button className="flex items-center gap-1 px-4 py-2 gradient-bg text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    応募する <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
