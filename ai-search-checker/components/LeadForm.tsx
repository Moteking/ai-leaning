"use client";

import { useState } from "react";
import Link from "next/link";

interface LeadFormProps {
  url: string;
  score: number;
  grade: string;
  onUnlock: () => void;
}

/** 詳細レポート閲覧前のリード獲得フォーム(会社名・メール必須) */
export default function LeadForm({ url, score, grade, onUnlock }: LeadFormProps) {
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // ハニーポット(ボット検出用・人間には非表示)
  const [website, setWebsite] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!company.trim()) {
      setError("会社名を入力してください。");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("正しいメールアドレスを入力してください。");
      return;
    }
    if (!agree) {
      setError("個人情報の取り扱いに同意してください。");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: company.trim(), email: email.trim(), url, score, grade, website }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "送信に失敗しました。");
      }
      onUnlock();
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました。");
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-brand-200 bg-white p-6 shadow-card sm:p-8">
      <div className="mx-auto max-w-md text-center">
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
          あと一歩で詳細レポート
        </span>
        <h2 className="mt-3 text-xl font-bold">詳細レポートと改善提案を見る</h2>
        <p className="mt-2 text-sm text-ink-500">
          会社名とメールアドレスをご入力いただくと、項目別の詳細診断・改善アドバイス・AI講評をすべてご覧いただけます。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-6 max-w-md space-y-4">
        {/* ハニーポット: 人間には見えない。ボットが入力すると送信時に弾く */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />
        <div>
          <label className="block text-sm font-semibold" htmlFor="company">
            会社名 <span className="text-red-500">*</span>
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="株式会社サンプル"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            autoComplete="organization"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold" htmlFor="email">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            autoComplete="email"
          />
        </div>

        <label className="flex items-start gap-2 text-xs text-ink-500">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300"
          />
          <span>
            入力情報を当サービスからのご連絡・改善提案の目的で利用することに同意します。
          </span>
        </label>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-600 px-4 py-3 text-base font-bold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "送信中..." : "詳細レポートを見る"}
        </button>
        <p className="text-center text-[11px] leading-relaxed text-ink-500">
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-700 underline hover:text-brand-800"
          >
            プライバシーポリシー
          </Link>
          に同意の上送信してください。
        </p>
      </form>
    </div>
  );
}
