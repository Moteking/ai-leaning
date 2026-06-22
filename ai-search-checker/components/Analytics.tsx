"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/config";

const CONSENT_KEY = "aio_consent"; // "granted" | "denied"

/**
 * Google Analytics 4 を「利用者の同意」に基づいて読み込む。
 * - NEXT_PUBLIC_GA_ID が未設定なら何もしない(バナーも出さない)
 * - 初回訪問時にCookie同意バナーを表示し、同意した場合のみGAを読み込む
 * - フッターの「Cookie設定」から再選択できる(window イベントで再表示)
 * ※ Vercel Web Analytics はCookieを使わない計測のため、本同意の対象外
 */
export default function Analytics() {
  const [consent, setConsent] = useState<"granted" | "denied" | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "granted" || stored === "denied") {
      setConsent(stored);
    } else {
      setShowBanner(true);
    }
    const open = () => setShowBanner(true);
    window.addEventListener("aio:open-consent", open);
    return () => window.removeEventListener("aio:open-consent", open);
  }, []);

  const choose = (value: "granted" | "denied") => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
    setShowBanner(false);
  };

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      {consent === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {showBanner && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-ink-700">
              当サイトは、サービス改善のためのアクセス解析(Google Analytics・Cookie)を任意で利用します。
              利用に同意いただけますか?（詳細は
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">
                プライバシーポリシー
              </a>
              ）
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => choose("denied")}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-ink-700 hover:bg-slate-50"
              >
                拒否する
              </button>
              <button
                onClick={() => choose("granted")}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700"
              >
                同意する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
