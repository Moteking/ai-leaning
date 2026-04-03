"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { ArrowLeft, Upload, Info, Save, Send } from "lucide-react";
import Link from "next/link";

const allCategories = [
  "美容", "コスメ", "スキンケア", "ファッション", "アパレル",
  "ガジェット", "テック", "フィットネス", "健康", "サプリ",
  "料理", "キッチン", "食品", "ペット", "インテリア", "旅行",
];

export default function NewCampaignPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    productName: "",
    productUrl: "",
    commissionType: "percentage",
    commissionRate: "",
    budget: "",
    targetRegion: "全国",
    startDate: "",
    endDate: "",
    requirements: "",
    hashtags: "",
    guidelines: "",
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="advertiser" />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <Link
            href="/dashboard/advertiser/campaigns"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-4"
          >
            <ArrowLeft size={16} /> キャンペーン一覧に戻る
          </Link>
          <h1 className="text-2xl font-bold">新規キャンペーン作成</h1>
          <p className="text-sm text-gray-500 mt-1">アフィリエイターに公開するキャンペーンを作成します</p>
        </div>

        <div className="max-w-3xl">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-5">基本情報</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">キャンペーンタイトル <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="例：新作リップティント プロモーション"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">キャンペーン説明 <span className="text-red-500">*</span></label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={4}
                    placeholder="キャンペーンの目的やアフィリエイターに期待する内容を記載してください"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">カテゴリ <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2">
                    {allCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedCategories.includes(cat)
                            ? "gradient-bg text-white"
                            : "bg-surface text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-5">商品情報</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">商品名 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => updateField("productName", e.target.value)}
                    placeholder="例：グロウリップティント #春色コレクション"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">商品URL</label>
                  <input
                    type="url"
                    value={formData.productUrl}
                    onChange={(e) => updateField("productUrl", e.target.value)}
                    placeholder="https://example.com/product"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">商品画像</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <div className="text-sm text-gray-500">クリックまたはドラッグ&ドロップで画像をアップロード</div>
                    <div className="text-xs text-gray-400 mt-1">JPG, PNG形式、最大10MB</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Commission */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-5">報酬設定</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">報酬タイプ <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateField("commissionType", "percentage")}
                      className={`p-4 rounded-xl border-2 text-left transition-colors ${
                        formData.commissionType === "percentage" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className="font-medium text-sm">成果報酬（%）</div>
                      <div className="text-xs text-gray-500 mt-0.5">売上に対して一定割合を支払い</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField("commissionType", "fixed")}
                      className={`p-4 rounded-xl border-2 text-left transition-colors ${
                        formData.commissionType === "fixed" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <div className="font-medium text-sm">固定報酬（¥）</div>
                      <div className="text-xs text-gray-500 mt-0.5">1件成約あたり固定金額を支払い</div>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      報酬{formData.commissionType === "percentage" ? "率" : "額"} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.commissionRate}
                        onChange={(e) => updateField("commissionRate", e.target.value)}
                        placeholder={formData.commissionType === "percentage" ? "15" : "2000"}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary pr-12"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        {formData.commissionType === "percentage" ? "%" : "円"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">予算上限 <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => updateField("budget", e.target.value)}
                        placeholder="500000"
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary pr-8"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">円</span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 flex items-start gap-2">
                  <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-700">
                    成果報酬の場合、TikAfiのプラットフォーム手数料（10%）が別途かかります。
                    例：報酬率15%の場合、アフィリエイターには15%、プラットフォームには1.5%をお支払いいただきます。
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule & Target */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-5">スケジュール・対象</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">開始日 <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateField("startDate", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">終了日 <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => updateField("endDate", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">対象地域</label>
                  <select
                    value={formData.targetRegion}
                    onChange={(e) => updateField("targetRegion", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary bg-white"
                  >
                    <option>全国</option>
                    <option>関東</option>
                    <option>関西</option>
                    <option>中部</option>
                    <option>九州</option>
                    <option>北海道・東北</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold text-lg mb-5">投稿ガイドライン</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">応募条件</label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => updateField("requirements", e.target.value)}
                    rows={3}
                    placeholder="例：フォロワー5,000人以上、美容・コスメカテゴリの投稿経験あり"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">必須ハッシュタグ</label>
                  <input
                    type="text"
                    value={formData.hashtags}
                    onChange={(e) => updateField("hashtags", e.target.value)}
                    placeholder="例：#PR #商品名 #ブランド名（カンマ区切り）"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">投稿ガイドライン</label>
                  <textarea
                    value={formData.guidelines}
                    onChange={(e) => updateField("guidelines", e.target.value)}
                    rows={4}
                    placeholder="動画の構成、NGワード、注意事項などを記載してください"
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">ガイドライン資料</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                    <div className="text-sm text-gray-500">PDF, Word, 画像ファイルをアップロード</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pb-8">
              <Link
                href="/dashboard/advertiser/campaigns"
                className="px-5 py-2.5 text-sm text-gray-500 hover:text-gray-700"
              >
                キャンセル
              </Link>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-surface transition-colors"
                >
                  <Save size={16} />
                  下書き保存
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Send size={16} />
                  公開する
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
