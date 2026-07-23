"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  Camera,
} from "lucide-react";

export default function SettingsPage({ role }: { role: "advertiser" | "affiliate" }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { value: "profile", label: "プロフィール", icon: <User size={16} /> },
    { value: "notifications", label: "通知設定", icon: <Bell size={16} /> },
    { value: "security", label: "セキュリティ", icon: <Shield size={16} /> },
    { value: "billing", label: "お支払い", icon: <CreditCard size={16} /> },
  ];

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role={role} />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">設定</h1>
          <p className="text-sm text-gray-500 mt-1">アカウントの設定を管理</p>
        </div>

        <div className="flex gap-8">
          {/* Settings Tabs */}
          <div className="w-56 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.value
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 max-w-2xl">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-bold mb-6">プロフィール設定</h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {role === "affiliate" ? "M" : "S"}
                      </div>
                      <button className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-surface">
                        <Camera size={14} className="text-gray-500" />
                      </button>
                    </div>
                    <div>
                      <div className="font-medium">
                        {role === "affiliate" ? "@beauty_mika" : "株式会社サンプル"}
                      </div>
                      <div className="text-sm text-gray-500">
                        JPG, PNG形式、最大5MB
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {role === "affiliate" ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">表示名</label>
                          <input
                            type="text"
                            defaultValue="Mika"
                            className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">TikTokアカウント</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              defaultValue="@beauty_mika"
                              className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                            />
                            <span className="text-xs text-green-500 font-medium px-3 py-1 bg-green-50 rounded-full">認証済み</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">自己紹介</label>
                          <textarea
                            defaultValue="現役美容部員。プチプラからデパコスまで幅広くレビュー。TikTok Shop売上月間TOP10入り。"
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">カテゴリ</label>
                          <div className="flex flex-wrap gap-2">
                            {["美容", "コスメ", "スキンケア", "ファッション"].map((cat) => (
                              <span key={cat} className="px-3 py-1.5 rounded-full text-sm bg-primary/10 text-primary font-medium">
                                {cat} ×
                              </span>
                            ))}
                            <button className="px-3 py-1.5 rounded-full text-sm border border-dashed border-border text-gray-400 hover:border-primary hover:text-primary">
                              + 追加
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">地域</label>
                          <select className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary bg-white">
                            <option>東京</option>
                            <option>大阪</option>
                            <option>名古屋</option>
                            <option>福岡</option>
                            <option>札幌</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">会社名</label>
                          <input
                            type="text"
                            defaultValue="株式会社サンプル"
                            className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">担当者名</label>
                          <input
                            type="text"
                            defaultValue="山田 太郎"
                            className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">会社URL</label>
                          <input
                            type="url"
                            defaultValue="https://example.com"
                            className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">業種</label>
                          <select className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary bg-white">
                            <option>化粧品・美容</option>
                            <option>アパレル・ファッション</option>
                            <option>食品・飲料</option>
                            <option>家電・ガジェット</option>
                            <option>健康・フィットネス</option>
                            <option>その他</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">会社概要</label>
                          <textarea
                            defaultValue="化粧品の企画・製造・販売を行う企業です。"
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary resize-none"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-1.5">メールアドレス</label>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <input
                          type="email"
                          defaultValue="user@example.com"
                          className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">電話番号</label>
                      <div className="flex items-center gap-2">
                        <Smartphone size={16} className="text-gray-400" />
                        <input
                          type="tel"
                          defaultValue="090-1234-5678"
                          className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border flex justify-end">
                    <button className="flex items-center gap-2 px-6 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90">
                      <Save size={16} />
                      保存する
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="font-bold mb-6">通知設定</h2>
                <div className="space-y-4">
                  {[
                    { label: "新しいキャンペーンの通知", desc: "あなたのカテゴリに合った新しい案件がある場合", default: true },
                    { label: "メッセージ通知", desc: "新しいメッセージを受信した場合", default: true },
                    { label: "売上通知", desc: "新しい成約が発生した場合", default: true },
                    { label: "報酬確定通知", desc: "報酬が確定した場合", default: true },
                    { label: "アプリケーション更新通知", desc: "キャンペーン応募のステータスが変更された場合", default: true },
                    { label: "マーケティングメール", desc: "新機能やキャンペーン情報のお知らせ", default: false },
                    { label: "週次レポート", desc: "毎週のパフォーマンスレポートをメールで受信", default: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-bold mb-6">パスワード変更</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">現在のパスワード</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary pr-12"
                          placeholder="現在のパスワード"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">新しいパスワード</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                        placeholder="新しいパスワード（8文字以上）"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">新しいパスワード（確認）</label>
                      <input
                        type="password"
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-primary"
                        placeholder="もう一度入力"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 gradient-bg text-white rounded-xl text-sm font-medium hover:opacity-90">
                      <Lock size={16} />
                      パスワードを更新
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-bold mb-4">二段階認証</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    アカウントのセキュリティを強化するために、二段階認証を有効にしてください。
                  </p>
                  <button className="px-5 py-2.5 border-2 border-primary text-primary rounded-xl text-sm font-medium hover:bg-primary hover:text-white transition-colors">
                    二段階認証を設定
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-red-200 p-6">
                  <h2 className="font-bold mb-2 text-red-600">アカウント削除</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    アカウントを削除すると、すべてのデータが完全に削除されます。この操作は取り消せません。
                  </p>
                  <button className="px-5 py-2.5 border border-red-300 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
                    アカウントを削除
                  </button>
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-bold mb-4">現在のプラン</h2>
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <div>
                      <div className="font-bold text-lg">プロプラン</div>
                      <div className="text-sm text-gray-600">¥79,800 / 月</div>
                    </div>
                    <button className="px-5 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-surface transition-colors">
                      プラン変更
                    </button>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    次回請求日: 2026年5月1日
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-bold mb-4">支払い方法</h2>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} className="text-gray-400" />
                      <div>
                        <div className="font-medium text-sm">Visa •••• 4242</div>
                        <div className="text-xs text-gray-500">有効期限: 12/2028</div>
                      </div>
                    </div>
                    <button className="text-sm text-primary hover:underline">変更</button>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-bold mb-4">請求履歴</h2>
                  <div className="space-y-2">
                    {[
                      { date: "2026-04-01", amount: 79800, status: "支払い済み" },
                      { date: "2026-03-01", amount: 79800, status: "支払い済み" },
                      { date: "2026-02-01", amount: 79800, status: "支払い済み" },
                    ].map((invoice) => (
                      <div key={invoice.date} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div className="text-sm">{invoice.date}</div>
                        <div className="text-sm font-medium">¥{invoice.amount.toLocaleString()}</div>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{invoice.status}</span>
                        <button className="text-xs text-primary hover:underline">領収書</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
