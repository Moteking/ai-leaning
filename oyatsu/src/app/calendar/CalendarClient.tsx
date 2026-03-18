"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  X,
  Clock,
  Heart,
  Gift,
  Cake,
  Star,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // MM-DD
  type: string;
  parentRelation: string | null;
  reminder: boolean;
  reminderDays: number;
  notes: string | null;
}

interface ParentInfo {
  relation: string;
  name: string;
}

interface Props {
  initialEvents: CalendarEvent[];
  parents: ParentInfo[];
}

const MONTHS = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

const EVENT_TYPES = [
  { value: "birthday", label: "誕生日", icon: Cake, color: "text-pink-500" },
  { value: "mothers_day", label: "母の日", icon: Heart, color: "text-red-500" },
  { value: "fathers_day", label: "父の日", icon: Star, color: "text-blue-500" },
  { value: "obon", label: "お盆", icon: Heart, color: "text-purple-500" },
  { value: "new_year", label: "お正月", icon: Star, color: "text-red-600" },
  { value: "keiro", label: "敬老の日", icon: Heart, color: "text-orange-500" },
  { value: "gift", label: "贈り物", icon: Gift, color: "text-amber-500" },
  { value: "visit", label: "帰省・訪問", icon: CalendarIcon, color: "text-green-500" },
  { value: "custom", label: "その他", icon: CalendarIcon, color: "text-gray-500" },
];

const SUGGESTED_ACTIONS: Record<string, string> = {
  birthday: "お祝いの品を贈りましょう",
  mothers_day: "感謝の気持ちを伝えましょう",
  fathers_day: "お父さんへの贈り物を選びましょう",
  obon: "帰省の準備をしましょう",
  new_year: "年始の挨拶と贈り物を準備しましょう",
  keiro: "敬老の日のプレゼントを用意しましょう",
  gift: "贈り物を選びましょう",
  visit: "お土産を準備しましょう",
  custom: "予定を確認しましょう",
};

function getDaysUntil(dateStr: string): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  const [month, day] = dateStr.split("-").map(Number);

  let eventDate = new Date(currentYear, month - 1, day);
  if (eventDate < now) {
    eventDate = new Date(currentYear + 1, month - 1, day);
  }

  const diff = eventDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getEventTypeInfo(type: string) {
  return EVENT_TYPES.find((t) => t.value === type) || EVENT_TYPES[EVENT_TYPES.length - 1];
}

function formatDate(dateStr: string): string {
  const [month, day] = dateStr.split("-").map(Number);
  return `${month}月${day}日`;
}

export default function CalendarClient({ initialEvents, parents }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formType, setFormType] = useState("custom");
  const [formParent, setFormParent] = useState("");
  const [formNotes, setFormNotes] = useState("");

  // Sort events by upcoming
  const sortedEvents = [...events].sort((a, b) => {
    const daysA = getDaysUntil(a.date);
    const daysB = getDaysUntil(b.date);
    return daysA - daysB;
  });

  // Group events by month for calendar view
  const eventsByMonth: Record<number, CalendarEvent[]> = {};
  for (const event of events) {
    const month = parseInt(event.date.split("-")[0], 10);
    if (!eventsByMonth[month]) eventsByMonth[month] = [];
    eventsByMonth[month].push(event);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          date: formDate,
          type: formType,
          parentRelation: formParent || null,
          notes: formNotes || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "イベントの追加に失敗しました");
        return;
      }

      setEvents((prev) => [
        ...prev,
        {
          id: data.event.id,
          title: data.event.title,
          date: data.event.date,
          type: data.event.type,
          parentRelation: data.event.parentRelation,
          reminder: data.event.reminder,
          reminderDays: data.event.reminderDays,
          notes: data.event.notes,
        },
      ]);

      // Reset form
      setFormTitle("");
      setFormDate("");
      setFormType("custom");
      setFormParent("");
      setFormNotes("");
      setShowForm(false);
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <CalendarIcon className="w-10 h-10 text-orange-500 mx-auto mb-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            親孝行カレンダー
          </h1>
          <p className="text-gray-600">
            大切な日を忘れない。親孝行のタイミングを管理しましょう
          </p>
        </div>

        {/* Upcoming events */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              近日のイベント
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              イベントを追加
            </button>
          </div>

          {sortedEvents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <CalendarIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">
                まだイベントが登録されていません
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
              >
                <Plus className="w-4 h-4" />
                最初のイベントを追加する
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedEvents.slice(0, 5).map((event) => {
                const daysUntil = getDaysUntil(event.date);
                const typeInfo = getEventTypeInfo(event.type);
                const IconComponent = typeInfo.icon;
                const isUrgent = daysUntil <= 14;
                const parentName = parents.find(
                  (p) => p.relation === event.parentRelation
                )?.name;

                return (
                  <div
                    key={event.id}
                    className={`bg-white rounded-xl border p-5 flex items-start gap-4 transition-all ${
                      isUrgent
                        ? "border-orange-200 shadow-sm"
                        : "border-gray-100"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isUrgent ? "bg-orange-100" : "bg-gray-50"
                      }`}
                    >
                      <IconComponent
                        className={`w-6 h-6 ${typeInfo.color}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {formatDate(event.date)}
                            {parentName && (
                              <span className="ml-2 text-orange-500">
                                ({parentName})
                              </span>
                            )}
                          </p>
                        </div>
                        <div
                          className={`text-right shrink-0 ${
                            isUrgent ? "text-orange-600" : "text-gray-400"
                          }`}
                        >
                          <p className="text-2xl font-bold">{daysUntil}</p>
                          <p className="text-xs">日後</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {SUGGESTED_ACTIONS[event.type] || "予定を確認しましょう"}
                      </p>
                      {event.notes && (
                        <p className="text-xs text-gray-400 mt-1">
                          {event.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Year calendar */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-orange-500" />
            年間カレンダー
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {MONTHS.map((monthName, idx) => {
              const monthNum = idx + 1;
              const monthEvents = eventsByMonth[monthNum] || [];
              const hasEvents = monthEvents.length > 0;

              return (
                <div
                  key={monthName}
                  className={`rounded-xl border p-4 ${
                    hasEvents
                      ? "bg-white border-orange-200 shadow-sm"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <h3
                    className={`text-sm font-bold mb-2 ${
                      hasEvents ? "text-orange-600" : "text-gray-400"
                    }`}
                  >
                    {monthName}
                  </h3>
                  {monthEvents.length > 0 ? (
                    <div className="space-y-1.5">
                      {monthEvents.map((event) => {
                        const typeInfo = getEventTypeInfo(event.type);
                        const IconComponent = typeInfo.icon;
                        const day = event.date.split("-")[1];
                        return (
                          <div
                            key={event.id}
                            className="flex items-center gap-1.5 text-xs"
                          >
                            <IconComponent
                              className={`w-3 h-3 shrink-0 ${typeInfo.color}`}
                            />
                            <span className="text-gray-500">{day}日</span>
                            <span className="text-gray-700 truncate">
                              {event.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-300">予定なし</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add event modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">
                  イベントを追加
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    タイトル <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="例: お母さんの誕生日"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                    required
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    日付 (MM-DD) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="例: 05-11"
                    pattern="\d{2}-\d{2}"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    月-日の形式で入力してください
                  </p>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    種類 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 appearance-none bg-white"
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Related parent */}
                {parents.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      関連する親
                    </label>
                    <div className="relative">
                      <select
                        value={formParent}
                        onChange={(e) => setFormParent(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 appearance-none bg-white"
                      >
                        <option value="">選択しない</option>
                        {parents.map((p) => (
                          <option key={p.relation} value={p.relation}>
                            {p.name}（
                            {p.relation === "mother" ? "お母さん" : "お父さん"}）
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    メモ
                  </label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="例: 今年は温泉旅行をプレゼントしたい"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 resize-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      追加中...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      追加する
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
