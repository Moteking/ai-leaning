import { track as vercelTrack } from "@vercel/analytics";

type EventProps = Record<string, string | number | boolean | null>;

/**
 * コンバージョン計測のイベント送信。
 * - Vercel Analytics: Cookie不要・同意不要で常時計測される(ファネルの主軸)
 * - GA4(gtag): Cookie同意済みの場合のみ追加で送る
 * どちらも失敗しても画面には影響させない。
 */
export function trackEvent(name: string, props?: EventProps) {
  try {
    vercelTrack(name, props);
  } catch {
    /* noop */
  }
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof window !== "undefined" && typeof w.gtag === "function") {
      w.gtag("event", name, props ?? {});
    }
  } catch {
    /* noop */
  }
}
