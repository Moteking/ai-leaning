"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Building2, Video } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"advertiser" | "affiliate">("advertiser");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    tiktokHandle: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-bold text-xl">
              Tik<span className="text-primary">Afi</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold mb-2">新規登録</h1>
          <p className="text-gray-500 text-sm mb-6">無料でアカウントを作成</p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setRole("advertiser")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                role === "advertiser"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-gray-300"
              }`}
            >
              <Building2
                size={24}
                className={role === "advertiser" ? "text-primary" : "text-gray-400"}
              />
              <div className="text-left">
                <div className="font-medium text-sm">広告主</div>
                <div className="text-xs text-gray-500">商品を宣伝したい</div>
              </div>
            </button>
            <button
              onClick={() => setRole("affiliate")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors ${
                role === "affiliate"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-gray-300"
              }`}
            >
              <Video
                size={24}
                className={role === "affiliate" ? "text-primary" : "text-gray-400"}
              />
              <div className="text-left">
                <div className="font-medium text-sm">アフィリエイター</div>
                <div className="text-xs text-gray-500">商品を紹介したい</div>
              </div>
            </button>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-2">
                {role === "advertiser" ? "担当者名" : "お名前"}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                placeholder={role === "advertiser" ? "山田 太郎" : "あなたの名前"}
              />
            </div>

            {role === "advertiser" ? (
              <div>
                <label className="block text-sm font-medium mb-2">会社名</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => updateField("company", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="株式会社サンプル"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">TikTokアカウント</label>
                <input
                  type="text"
                  value={formData.tiktokHandle}
                  onChange={(e) => updateField("tiktokHandle", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                  placeholder="@your_tiktok_handle"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">メールアドレス</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">パスワード</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm pr-12"
                  placeholder="8文字以上で設定"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" className="rounded border-border mt-1" />
              <span className="text-xs text-gray-500">
                <a href="#" className="text-primary hover:underline">利用規約</a>
                と
                <a href="#" className="text-primary hover:underline">プライバシーポリシー</a>
                に同意します
              </span>
            </div>

            <Link
              href={role === "advertiser" ? "/dashboard/advertiser" : "/dashboard/affiliate"}
              className="block w-full gradient-bg text-white py-3 rounded-xl font-medium text-center hover:opacity-90 transition-opacity"
            >
              無料でアカウントを作成
            </Link>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            すでにアカウントをお持ちの方は{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              ログイン
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 gradient-bg items-center justify-center p-12">
        <div className="text-white text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">
            {role === "advertiser"
              ? "売上を伸ばすアフィリエイターが見つかる"
              : "高単価な案件が見つかる"}
          </h2>
          <p className="text-white/80 leading-relaxed">
            {role === "advertiser"
              ? "売上実績・エンゲージメント率・アフィリエイタースコアで最適なパートナーを見つけましょう。"
              : "あなたの得意ジャンルに合った案件で、TikTokアフィリエイトの収益を最大化しましょう。"}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-left">
            {role === "advertiser"
              ? [
                  "5,000+ アフィリエイター",
                  "AIマッチング",
                  "リアルタイム分析",
                  "安全な報酬管理",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white/90">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    {item}
                  </div>
                ))
              : [
                  "高報酬案件",
                  "即日参加可能",
                  "自動レポート",
                  "安心の支払い",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white/90">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    {item}
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
