import type { LeadInput, LeadRecord, LeadStore } from "./leadStore";

/**
 * メモリ上にリードを保持するフォールバック実装。
 * SQLite が使えない環境でもアプリが落ちないようにするための保険。
 * プロセス再起動で消えるため、本番では外部DB実装に差し替えること。
 */
export class MemoryLeadStore implements LeadStore {
  private leads: LeadRecord[] = [];
  private nextId = 1;

  async save(lead: LeadInput): Promise<LeadRecord> {
    const record: LeadRecord = {
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      ...lead,
    };
    this.leads.unshift(record);
    return record;
  }

  async list(limit = 100): Promise<LeadRecord[]> {
    return this.leads.slice(0, limit);
  }
}
