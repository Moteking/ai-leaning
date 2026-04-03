"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

          <h1 className="text-2xl font-bold mb-2">ログイン</h1>
          <p className="text-gray-500 text-sm mb-8">
            アカウントにログインして、ダッシュボードにアクセス
          </p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium mb-2">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">パスワード</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors text-sm pr-12"
                  placeholder="パスワードを入力"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-border" />
                ログイン状態を保持
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                パスワードを忘れた方
              </a>
            </div>

            <Link
              href="/dashboard/advertiser"
              className="block w-full gradient-bg text-white py-3 rounded-xl font-medium text-center hover:opacity-90 transition-opacity"
            >
              ログイン
            </Link>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            アカウントをお持ちでない方は{" "}
            <Link href="/auth/register" className="text-primary hover:underline font-medium">
              新規登録
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 gradient-bg items-center justify-center p-12">
        <div className="text-white text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">
            TikTokアフィリエイトの
            <br />
            新しいスタンダード
          </h2>
          <p className="text-white/80 leading-relaxed">
            5,000人以上の実績あるTikTokアフィリエイターと
            850社以上の広告主が利用する、日本最大級のTikTokアフィリエイトプラットフォーム。
          </p>
        </div>
      </div>
    </div>
  );
}
