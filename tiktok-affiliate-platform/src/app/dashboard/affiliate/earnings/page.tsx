"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  DollarSign,
  Download,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Wallet,
  Calendar,
  Building2,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

const earningsHistory = [
  { id: "e-001", month: "2026年3月", amount: 485000, status: "pending", paidAt: null, campaigns: 3, sales: 342 },
  { id: "e-002", month: "2026年2月", amount: 450000, status: "paid", paidAt: "2026-03-31", campaigns: 3, sales: 310 },
  { id: "e-003", month: "2026年1月", amount: 380000, status: "paid", paidAt: "2026-02-28", campaigns: 2, sales: 265 },
  { id: "e-004", month: "2025年12月", amount: 420000, status: "paid", paidAt: "2026-01-31", campaigns: 3, sales: 290 },
  { id: "e-005", month: "2025年11月", amount: 350000, status: "paid", paidAt: "2025-12-31", campaigns: 2, sales: 245 },
  { id: "e-006", month: "2025年10月", amount: 280000, status: "paid", paidAt: "2025-11-30", campaigns: 2, sales: 198 },
];

const transactionDetails = [
  { campaign: "新作リップティント プロモーション", date: "2026-03-28", sales: 15, amount: 52500, status: "confirmed" },
  { campaign: "新作リップティント プロモーション", date: "2026-03-25", sales: 12, amount: 42000, status: "confirmed" },
  { campaign: "ワイヤレスイヤホン レビューキャンペーン", date: "2026-03-30", sales: 8, amount: 16000, status: "confirmed" },
  { campaign: "新作リップティント プロモーション", date: "2026-03-22", sales: 18, amount: 63000, status: "confirmed" },
  { campaign: "ワイヤレスイヤホン レビューキャンペーン", date: "2026-03-27", sales: 5, amount: 10000, status: "pending" },
  { campaign: "春の新作ワンピース プロモーション", date: "2026-03-20", sales: 22, amount: 66000, status: "confirmed" },
];

export default function EarningsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "details">("overview");
  const totalPaid = earningsHistory.filter((e) => e.status === "paid").reduce((sum, e) => sum + e.amount, 0);
  const pendingAmount = earningsHistory.filter((e) => e.status === "pending").reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex min-h-screen bg-surface">
      <DashboardSidebar role="affiliate" />

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">報酬管理</h1>
            <p className="text-sm text-gray-500 mt-1">報酬の確認・振込履歴の管理</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-white transition-colors">
            <Download size={16} />
            CSVダウンロード
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <DollarSign size={20} className="text-primary" />
              </div>
              <div className="text-sm text-gray-500">累計報酬</div>
            </div>
            <div className="text-2xl font-bold">¥{(totalPaid + pendingAmount).toLocaleString()}</div>
            <div className="text-xs text-green-500 flex items-center gap-0.5 mt-1">
              <ArrowUpRight size={12} /> 前月比 +18.5%
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={20} className="text-green-600" />
              </div>
              <div className="text-sm text-gray-500">支払い済み</div>
            </div>
            <div className="text-2xl font-bold text-green-600">¥{totalPaid.toLocaleString()}</div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-yellow-600" />
              </div>
              <div className="text-sm text-gray-500">確定待ち</div>
            </div>
            <div className="text-2xl font-bold text-yellow-600">¥{pendingAmount.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">翌月末お支払い予定</div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Wallet size={20} className="text-blue-600" />
              </div>
              <div className="text-sm text-gray-500">今月の成約</div>
            </div>
            <div className="text-2xl font-bold">342件</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white rounded-xl border border-border p-1 mb-6 w-fit">
          {[
            { value: "overview" as const, label: "概要" },
            { value: "history" as const, label: "振込履歴" },
            { value: "details" as const, label: "取引明細" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.value ? "bg-primary text-white" : "text-gray-600 hover:bg-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Earnings Chart */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="font-bold mb-4">月間報酬推移</h2>
              <div className="flex items-end justify-between h-48 gap-3">
                {earningsHistory.reverse().map((e) => {
                  const maxAmount = Math.max(...earningsHistory.map((h) => h.amount));
                  return (
                    <div key={e.id} className="flex-1 flex flex-col items-center gap-1">
                      <div className="text-xs text-gray-500">¥{(e.amount / 10000).toFixed(0)}万</div>
                      <div
                        className={`w-full rounded-t-md transition-colors ${
                          e.status === "pending" ? "bg-yellow-400" : "bg-primary/80 hover:bg-primary"
                        }`}
                        style={{ height: `${(e.amount / maxAmount) * 160}px` }}
                      />
                      <div className="text-xs text-gray-500 whitespace-nowrap">{e.month.slice(5)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bank Account Info */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="font-bold mb-4 flex items-center gap-2">
                  <CreditCard size={18} />
                  振込先口座
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-gray-500">金融機関</span>
                    <span className="text-sm font-medium">三菱UFJ銀行</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-gray-500">支店名</span>
                    <span className="text-sm font-medium">渋谷支店</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-gray-500">口座種別</span>
                    <span className="text-sm font-medium">普通</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-gray-500">口座番号</span>
                    <span className="text-sm font-medium">****1234</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-500">口座名義</span>
                    <span className="text-sm font-medium">ミカ</span>
                  </div>
                </div>
                <button className="mt-4 w-full py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-surface transition-colors">
                  口座情報を変更
                </button>
              </div>

              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm text-blue-800">次回振込予定</div>
                    <div className="text-sm text-blue-700 mt-1">
                      2026年4月30日に¥485,000が振り込まれる予定です。
                      最低振込額は¥5,000です。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="text-left py-3 px-6 font-medium text-gray-500">対象月</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-500">金額</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-500">案件数</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-500">成約件数</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-500">ステータス</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-500">振込日</th>
                </tr>
              </thead>
              <tbody>
                {earningsHistory.map((e) => (
                  <tr key={e.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                    <td className="py-4 px-6 font-medium">{e.month}</td>
                    <td className="py-4 px-6 text-right font-bold">¥{e.amount.toLocaleString()}</td>
                    <td className="py-4 px-6 text-right">{e.campaigns}件</td>
                    <td className="py-4 px-6 text-right">{e.sales}件</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${
                        e.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {e.status === "paid" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {e.status === "paid" ? "支払い済み" : "確定待ち"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-gray-500">{e.paidAt || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "details" && (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="text-left py-3 px-6 font-medium text-gray-500">キャンペーン</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-500">日付</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-500">成約件数</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-500">報酬額</th>
                  <th className="text-center py-3 px-6 font-medium text-gray-500">ステータス</th>
                </tr>
              </thead>
              <tbody>
                {transactionDetails.map((t, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-surface/50">
                    <td className="py-4 px-6">
                      <div className="font-medium">{t.campaign}</div>
                    </td>
                    <td className="py-4 px-6 text-right text-gray-500">{t.date}</td>
                    <td className="py-4 px-6 text-right">{t.sales}件</td>
                    <td className="py-4 px-6 text-right font-bold text-primary">¥{t.amount.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        t.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {t.status === "confirmed" ? "確定" : "未確定"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
