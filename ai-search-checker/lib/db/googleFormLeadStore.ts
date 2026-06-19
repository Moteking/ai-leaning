import type { LeadInput, LeadRecord, LeadStore } from "./leadStore";

// 各項目に対応づけるためのマーカー文字列。
// Googleフォームの「事前入力したURLを取得」で、各設問にこの文字列を入れてもらい、
// そのURLから entry.xxxx(設問ID) ↔ 項目 の対応を自動解析する。
const MARKER_TO_FIELD: Record<string, keyof LeadInput> = {
  __COMPANY__: "company",
  __EMAIL__: "email",
  __URL__: "url",
  __SCORE__: "score",
  __GRADE__: "grade",
};

/**
 * Googleフォーム経由でリードをスプレッドシートに保存する実装(OAuth不要)。
 *
 * 環境変数 LEADS_FORM_PREFILL_URL に、Googleフォームの「事前入力したURLを取得」で
 * 生成したURL(各設問に __COMPANY__ などのマーカーを入力したもの)を設定する。
 * 例:
 *   https://docs.google.com/forms/d/e/XXXX/viewform?usp=pp_url
 *     &entry.111=__COMPANY__&entry.222=__EMAIL__&entry.333=__URL__
 *     &entry.444=__SCORE__&entry.555=__GRADE__
 */
export class GoogleFormLeadStore implements LeadStore {
  private responseUrl: string;
  /** 項目名 → entry.xxxx(設問ID) の対応 */
  private entryMap: Partial<Record<keyof LeadInput, string>> = {};

  constructor(prefillUrl: string) {
    const u = new URL(prefillUrl);
    for (const [key, value] of u.searchParams.entries()) {
      if (!key.startsWith("entry.")) continue;
      const field = MARKER_TO_FIELD[value.trim()];
      if (field) this.entryMap[field] = key;
    }
    if (Object.keys(this.entryMap).length === 0) {
      throw new Error(
        "LEADS_FORM_PREFILL_URL から設問IDを解析できませんでした。事前入力URLのマーカー(__COMPANY__ 等)をご確認ください。"
      );
    }
    // /viewform → /formResponse に置き換えて送信先URLを作る
    this.responseUrl = `${u.origin}${u.pathname.replace(/viewform$/, "formResponse")}`;
  }

  async save(lead: LeadInput): Promise<LeadRecord> {
    const createdAt = new Date().toISOString();

    const body = new URLSearchParams();
    const values: Record<keyof LeadInput, string> = {
      company: lead.company,
      email: lead.email,
      url: lead.url,
      score: String(lead.score),
      grade: lead.grade,
    };
    for (const field of Object.keys(this.entryMap) as (keyof LeadInput)[]) {
      const entryKey = this.entryMap[field];
      if (entryKey) body.set(entryKey, values[field]);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(this.responseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        signal: controller.signal,
        redirect: "follow",
      });
      if (!res.ok) {
        throw new Error(`Googleフォーム応答エラー: HTTP ${res.status}`);
      }
    } finally {
      clearTimeout(timer);
    }

    // 一覧はスプレッドシート側で確認するため、暫定IDを返す
    return { id: Date.now(), createdAt, ...lead };
  }

  async list(): Promise<LeadRecord[]> {
    return [];
  }
}
