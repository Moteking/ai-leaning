import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import type { LeadInput, LeadRecord, LeadStore } from "./leadStore";

/**
 * ローカル SQLite によるリード保存実装。
 * 保存先は環境変数 LEADS_DB_PATH、未指定なら ./data/leads.db。
 */
export class SqliteLeadStore implements LeadStore {
  private db: Database.Database;

  constructor() {
    const dbPath =
      process.env.LEADS_DB_PATH || path.join(process.cwd(), "data", "leads.db");
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.db = new Database(dbPath);
    this.db.pragma("journal_mode = WAL");
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        company   TEXT NOT NULL,
        email     TEXT NOT NULL,
        url       TEXT NOT NULL,
        score     INTEGER NOT NULL,
        grade     TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);
  }

  async save(lead: LeadInput): Promise<LeadRecord> {
    const createdAt = new Date().toISOString();
    const stmt = this.db.prepare(
      `INSERT INTO leads (company, email, url, score, grade, createdAt)
       VALUES (@company, @email, @url, @score, @grade, @createdAt)`
    );
    const info = stmt.run({ ...lead, createdAt });
    return { id: Number(info.lastInsertRowid), createdAt, ...lead };
  }

  async list(limit = 100): Promise<LeadRecord[]> {
    const rows = this.db
      .prepare(`SELECT * FROM leads ORDER BY id DESC LIMIT ?`)
      .all(limit);
    return rows as LeadRecord[];
  }
}
