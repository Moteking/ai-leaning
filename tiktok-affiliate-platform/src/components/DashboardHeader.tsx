"use client";

import { useState } from "react";
import { Bell, X, CheckCircle2, Megaphone, DollarSign, MessageSquare, Users } from "lucide-react";

interface Notification {
  id: string;
  type: "campaign" | "payment" | "message" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "n-001",
    type: "campaign",
    title: "キャンペーン承認",
    description: "「新作リップティント プロモーション」への参加が承認されました",
    time: "5分前",
    read: false,
  },
  {
    id: "n-002",
    type: "payment",
    title: "報酬確定",
    description: "3月分の報酬 ¥485,000 が確定しました",
    time: "1時間前",
    read: false,
  },
  {
    id: "n-003",
    type: "message",
    title: "新着メッセージ",
    description: "グロウコスメ株式会社から新しいメッセージがあります",
    time: "3時間前",
    read: false,
  },
  {
    id: "n-004",
    type: "system",
    title: "スコア更新",
    description: "あなたのアフィリエイタースコアが93→95に更新されました",
    time: "昨日",
    read: true,
  },
  {
    id: "n-005",
    type: "campaign",
    title: "新着おすすめ案件",
    description: "あなたにおすすめの新しい案件が3件あります",
    time: "昨日",
    read: true,
  },
];

export default function DashboardHeader({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "campaign":
        return <Megaphone size={16} className="text-purple-500" />;
      case "payment":
        return <DollarSign size={16} className="text-green-500" />;
      case "message":
        return <MessageSquare size={16} className="text-blue-500" />;
      default:
        return <CheckCircle2 size={16} className="text-primary" />;
    }
  };

  return (
    <div className="flex items-center justify-between mb-8">
      {title && (
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="relative ml-auto">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2.5 rounded-xl border border-border hover:bg-white transition-colors"
        >
          <Bell size={20} className="text-gray-500" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 gradient-bg rounded-full flex items-center justify-center text-white text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
            <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl border border-border shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-bold">通知</h3>
                <div className="flex items-center gap-2">
                  <button className="text-xs text-primary hover:underline">すべて既読</button>
                  <button onClick={() => setShowNotifications(false)}>
                    <X size={18} className="text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-4 border-b border-border last:border-0 hover:bg-surface cursor-pointer ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="w-9 h-9 bg-surface rounded-xl flex items-center justify-center flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{notification.title}</span>
                        {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.description}</p>
                      <span className="text-xs text-gray-400 mt-1 block">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-border text-center">
                <button className="text-sm text-primary hover:underline font-medium">すべての通知を見る</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
