"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  UserCheck,
  UserX,
  Building2,
} from "lucide-react";

function AdminSidebar() {
  const pathname = usePathname();
  const items = [
    { label: "ダッシュボード", href: "/dashboard/admin", icon: <LayoutDashboard size={20} /> },
    { label: "ユーザー管理", href: "/dashboard/admin", icon: <Users size={20} /> },
    { label: "キャンペーン管理", href: "/dashboard/admin", icon: <Megaphone size={20} /> },
    { label: "売上レポート", href: "/dashboard/admin", icon: <BarChart3 size={20} /> },
    { label: "審査管理", href: "/dashboard/admin", icon: <Shield size={20} /> },
    { label: "設定", href: "/dashboard/admin", icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-xl text-white">
            Tik<span className="text-primary">Afi</span>
          </span>
        </Link>
        <div className="mt-3 text-xs text-gray-500 bg-gray-800 rounded-full px-3 py-1 inline-block">
          管理者パネル
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {items.map((item, i) => (
            <li key={i}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  i === 0 ? "bg-primary/20 text-primary" : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <Link href="/" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-500 hover:text-red-400">
          <LogOut size={18} />
          ログアウト
        </Link>
      </div>
    </aside>
  );
}

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">管理者ダッシュボード</h1>
          <p className="text-sm text-gray-500 mt-1">プラットフォーム全体の状況を管理</p>
        </div>

        {/* Platform KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "総ユーザー数", value: "5,850", change: "+124", icon: <Users size={20} className="text-blue-500" /> },
            { label: "月間GMV", value: "¥3.2億", change: "+18.5%", icon: <DollarSign size={20} className="text-green-500" /> },
            { label: "アクティブ案件", value: "342件", change: "+28件", icon: <Megaphone size={20} className="text-purple-500" /> },
            { label: "プラットフォーム収益", value: "¥4,800万", change: "+22.3%", icon: <TrendingUp size={20} className="text-primary" /> },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center">{stat.icon}</div>
                <span className="text-xs font-medium text-green-500 flex items-center gap-0.5">
                  <ArrowUpRight size={12} />{stat.change}
                </span>
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* User Breakdown */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold mb-4">ユーザー内訳</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Users size={18} className="text-pink-500" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">アフィリエイター</div>
                    <div className="text-xs text-gray-500">登録済み</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">5,000</div>
                  <div className="text-xs text-green-500">+98 今月</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Building2 size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">広告主</div>
                    <div className="text-xs text-gray-500">企業アカウント</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">850</div>
                  <div className="text-xs text-green-500">+26 今月</div>
                </div>
              </div>
              <div className="h-4 bg-surface rounded-full overflow-hidden flex">
                <div className="h-full bg-pink-500" style={{ width: "85.5%" }} />
                <div className="h-full bg-blue-500" style={{ width: "14.5%" }} />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-pink-500 rounded-full" />アフィリエイター 85.5%</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full" />広告主 14.5%</span>
              </div>
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              審査待ち
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">12件</span>
            </h2>
            <div className="space-y-3">
              {[
                { name: "@new_creator_1", type: "新規AF審査", date: "4/3", status: "pending" },
                { name: "@health_guru_jp", type: "新規AF審査", date: "4/3", status: "pending" },
                { name: "株式会社ABC", type: "新規広告主", date: "4/2", status: "pending" },
                { name: "@travel_love_99", type: "新規AF審査", date: "4/2", status: "pending" },
                { name: "キャンペーン #C-125", type: "コンテンツ審査", date: "4/1", status: "pending" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.type} • {item.date}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 bg-green-100 rounded-lg hover:bg-green-200 transition-colors">
                      <UserCheck size={14} className="text-green-600" />
                    </button>
                    <button className="p-1.5 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
                      <UserX size={14} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold mb-4">アラート</h2>
            <div className="space-y-3">
              {[
                { text: "不正クリックの疑い: キャンペーン #C-098", level: "warning", time: "30分前" },
                { text: "新規AF登録が急増中（前日比+45%）", level: "info", time: "2時間前" },
                { text: "報酬支払い処理完了: 3月分", level: "success", time: "5時間前" },
                { text: "API レートリミット警告", level: "warning", time: "昨日" },
                { text: "月次レポート生成完了", level: "success", time: "昨日" },
              ].map((alert, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${
                  alert.level === "warning" ? "bg-yellow-50" : alert.level === "success" ? "bg-green-50" : "bg-blue-50"
                }`}>
                  {alert.level === "warning" ? (
                    <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  ) : alert.level === "success" ? (
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Eye size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{alert.text}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-border p-6 mb-8">
          <h2 className="font-bold mb-4">月間プラットフォーム収益推移</h2>
          <div className="flex items-end justify-between h-48 gap-3 px-2">
            {[
              { month: "10月", value: 2800 },
              { month: "11月", value: 3200 },
              { month: "12月", value: 3800 },
              { month: "1月", value: 3500 },
              { month: "2月", value: 4200 },
              { month: "3月", value: 4800 },
            ].map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-gray-500">¥{m.value}万</div>
                <div
                  className="w-full gradient-bg rounded-t-md hover:opacity-100 opacity-80 transition-opacity"
                  style={{ height: `${(m.value / 4800) * 160}px` }}
                />
                <div className="text-xs text-gray-500">{m.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-bold mb-4">最新アクティビティ</h2>
          <div className="space-y-3">
            {[
              { action: "@beauty_mika がキャンペーン「新作リップティント」に動画を投稿", time: "3分前", icon: <Megaphone size={14} /> },
              { action: "株式会社グロウコスメ が新規キャンペーンを作成", time: "15分前", icon: <Building2 size={14} /> },
              { action: "@gadget_taro の本人確認が完了", time: "1時間前", icon: <Shield size={14} /> },
              { action: "@fashion_remi のアフィリエイタースコアが更新 (89 → 91)", time: "2時間前", icon: <TrendingUp size={14} /> },
              { action: "3月分の報酬支払い処理が完了 (対象: 4,200名)", time: "5時間前", icon: <DollarSign size={14} /> },
              { action: "新規広告主「株式会社XYZ」がプロプランに申し込み", time: "8時間前", icon: <Building2 size={14} /> },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center text-gray-400">
                  {activity.icon}
                </div>
                <div className="flex-1 text-sm">{activity.action}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={12} />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
