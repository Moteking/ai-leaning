import type { LeadInput, LeadRecord, LeadStore } from "./leadStore";

/**
 * リードを外部URL(Webフック)へ POST する実装。
 * サーバーレス(Vercel等)でも永続化できるよう、保存先を外部に委ねる。
 *
 * 環境変数 LEADS_WEBHOOK_URL に、以下のいずれかのエンドポイントURLを設定すれば動作する:
 *   - Google スプレッドシート連携(Google Apps Script の doPost で受ける)
 *   - Zapier / Make の Webhook
 *   - 自社CRM / Slack Incoming Webhook など
 *
 * 送信されるJSON: { company, email, url, score, grade, createdAt, source }
 */
export class WebhookLeadStore implements LeadStore {
  constructor(private readonly endpoint: string) {}

  async save(lead: LeadInput): Promise<LeadRecord> {
    const createdAt = new Date().toISOString();
    const payload = { ...lead, createdAt, source: "ai-search-checker" };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`Webhook応答エラー: HTTP ${res.status}`);
      }
    } finally {
      clearTimeout(timer);
    }

    // Webフック先がIDを管理するため、ここでは時刻ベースの暫定IDを返す
    return { id: Date.now(), createdAt, ...lead };
  }

  async list(): Promise<LeadRecord[]> {
    // 送信専用。一覧取得は保存先(スプレッドシート/CRM)側で行う。
    return [];
  }
}
