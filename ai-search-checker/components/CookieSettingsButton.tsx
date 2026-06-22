"use client";

/** フッターから Cookie(アクセス解析)の同意を再選択するためのボタン。 */
export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("aio:open-consent"))}
      className="font-medium text-ink-700 hover:text-brand-700 hover:underline"
    >
      Cookie設定
    </button>
  );
}
