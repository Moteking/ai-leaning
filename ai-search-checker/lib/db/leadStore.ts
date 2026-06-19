// リード情報の保存インターフェース。
// 現状はローカル SQLite 実装。後で外部DB・スプレッドシート連携に差し替えやすいよう、
// LeadStore インターフェースとファクトリ getLeadStore() に集約している。

export interface LeadInput {
  company: string;
  email: string;
  url: string;
  score: number;
  grade: string;
}

export interface LeadRecord extends LeadInput {
  id: number;
  createdAt: string;
}

export interface LeadStore {
  save(lead: LeadInput): Promise<LeadRecord>;
  list(limit?: number): Promise<LeadRecord[]>;
}

let cached: LeadStore | null = null;

/**
 * 利用する LeadStore を返す。
 * 選択順:
 *   1. 環境変数 LEADS_WEBHOOK_URL があれば WebhookLeadStore(サーバーレスでも永続化可)
 *   2. ローカルで better-sqlite3 が使えれば SqliteLeadStore
 *   3. いずれも不可なら起動を止めないよう MemoryLeadStore にフォールバック
 *
 * 差し替え方法:
 *   ここの分岐に SpreadsheetLeadStore や PostgresLeadStore を追加するだけでよい。
 */
export async function getLeadStore(): Promise<LeadStore> {
  if (cached) return cached;

  const webhookUrl = process.env.LEADS_WEBHOOK_URL;
  if (webhookUrl) {
    const { WebhookLeadStore } = await import("./webhookLeadStore");
    cached = new WebhookLeadStore(webhookUrl);
    return cached;
  }

  try {
    const { SqliteLeadStore } = await import("./sqliteLeadStore");
    cached = new SqliteLeadStore();
  } catch (err) {
    console.warn(
      "[leadStore] SQLite の初期化に失敗したためメモリ保存にフォールバックします:",
      err instanceof Error ? err.message : err
    );
    const { MemoryLeadStore } = await import("./memoryLeadStore");
    cached = new MemoryLeadStore();
  }
  return cached;
}
