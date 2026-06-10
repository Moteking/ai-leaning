"use client";

import type { CategoryResult, ItemStatus } from "@/lib/diagnose/types";

const STATUS_META: Record<
  ItemStatus,
  { label: string; badge: string; dot: string; icon: string }
> = {
  ok: {
    label: "OK",
    badge: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    icon: "✓",
  },
  warning: {
    label: "要改善",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    icon: "！",
  },
  fail: {
    label: "未対応",
    badge: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    icon: "×",
  },
};

/** カテゴリ1件分の詳細カード */
export default function CategoryCard({ category }: { category: CategoryResult }) {
  const ratio = category.maxScore ? category.score / category.maxScore : 0;
  const barColor =
    ratio >= 0.75 ? "bg-green-500" : ratio >= 0.5 ? "bg-brand-500" : ratio >= 0.4 ? "bg-amber-500" : "bg-red-500";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold">{category.label}</h3>
          <p className="mt-0.5 text-xs text-ink-500">{category.description}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-extrabold tabular-nums text-ink-900">
            {category.score}
            <span className="text-sm font-medium text-ink-500">/{category.maxScore}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${barColor} transition-all`}
          style={{ width: `${Math.round(ratio * 100)}%` }}
        />
      </div>

      <ul className="mt-4 space-y-3">
        {category.items.map((item) => {
          const meta = STATUS_META[item.status];
          return (
            <li key={item.id} className="rounded-lg border border-slate-100 bg-slate-50/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className={`inline-block h-2 w-2 rounded-full ${meta.dot}`} />
                  {item.label}
                </span>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-bold ${meta.badge}`}
                >
                  {meta.label}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-ink-700">{item.detail}</p>
              {item.advice && (
                <p className="mt-2 rounded-md bg-brand-50 px-3 py-2 text-xs leading-relaxed text-brand-800">
                  <span className="font-bold">改善アドバイス：</span>
                  {item.advice}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
