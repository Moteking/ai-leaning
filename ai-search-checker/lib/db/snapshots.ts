/**
 * 経時追跡用のスナップショット保存(Supabase / PostgREST)。
 *
 * SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY が未設定なら全て no-op になり、
 * 既存機能には一切影響しない(推移グラフが出ないだけ)。
 *
 * 必要なテーブル(Supabaseの SQL Editor で実行):
 *
 *   create table if not exists mention_snapshots (
 *     id bigint generated always as identity primary key,
 *     brand text not null,
 *     query text not null,
 *     visibility_score int not null default 0,
 *     mentioned boolean not null default false,
 *     rank int,
 *     coverage_mentioned int not null default 0,
 *     coverage_total int not null default 0,
 *     source text not null default 'user',
 *     created_at timestamptz not null default now()
 *   );
 *   create index if not exists idx_snapshots_brand_query
 *     on mention_snapshots (brand, query, created_at);
 *
 *   create table if not exists tracked_queries (
 *     brand text not null,
 *     query text not null,
 *     last_tracked_at timestamptz,
 *     created_at timestamptz not null default now(),
 *     primary key (brand, query)
 *   );
 */

export interface SnapshotInput {
  brand: string;
  query: string;
  visibilityScore: number;
  mentioned: boolean;
  rank: number | null;
  coverageMentioned: number;
  coverageTotal: number;
  source?: "user" | "cron";
}

export interface HistoryPoint {
  date: string; // ISO
  score: number;
  mentioned: boolean;
}

export interface TrackedQuery {
  brand: string;
  query: string;
}

function config(): { url: string; key: string } | null {
  const url = (process.env.SUPABASE_URL ?? "").trim().replace(/\/$/, "");
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  if (!url || !key) return null;
  return { url, key };
}

export function isTrackingEnabled(): boolean {
  return config() !== null;
}

async function sb(
  path: string,
  init: RequestInit & { headers?: Record<string, string> } = {},
  ms = 8000
): Promise<Response> {
  const c = config();
  if (!c) throw new Error("tracking disabled");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(`${c.url}/rest/v1/${path}`, {
      ...init,
      signal: ctrl.signal,
      headers: {
        apikey: c.key,
        Authorization: `Bearer ${c.key}`,
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

/** スナップショットを1件記録し、追跡対象に upsert する。失敗しても投げない。 */
export async function recordSnapshot(input: SnapshotInput): Promise<void> {
  if (!isTrackingEnabled()) return;
  const brand = input.brand.trim();
  const query = input.query.trim();
  if (!brand || !query) return;
  try {
    await sb("mention_snapshots", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        brand,
        query,
        visibility_score: input.visibilityScore,
        mentioned: input.mentioned,
        rank: input.rank,
        coverage_mentioned: input.coverageMentioned,
        coverage_total: input.coverageTotal,
        source: input.source ?? "user",
      }),
    });
    await sb("tracked_queries?on_conflict=brand,query", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ brand, query, last_tracked_at: new Date().toISOString() }),
    });
  } catch (err) {
    console.error("[tracking] recordSnapshot失敗:", err);
  }
}

/** 指定ブランド×クエリの履歴を古い順に取得。失敗時は空配列。 */
export async function getHistory(brand: string, query: string, limit = 90): Promise<HistoryPoint[]> {
  if (!isTrackingEnabled()) return [];
  const b = encodeURIComponent(brand.trim());
  const q = encodeURIComponent(query.trim());
  try {
    const res = await sb(
      `mention_snapshots?brand=eq.${b}&query=eq.${q}` +
        `&select=visibility_score,mentioned,created_at&order=created_at.asc&limit=${limit}`,
      { method: "GET" }
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as Array<{
      visibility_score: number;
      mentioned: boolean;
      created_at: string;
    }>;
    return rows.map((r) => ({
      date: r.created_at,
      score: r.visibility_score,
      mentioned: r.mentioned,
    }));
  } catch (err) {
    console.error("[tracking] getHistory失敗:", err);
    return [];
  }
}

/** 追跡対象を「最後に追跡した時刻が古い順」に取得(cron用)。 */
export async function listTrackedQueries(limit = 20): Promise<TrackedQuery[]> {
  if (!isTrackingEnabled()) return [];
  try {
    const res = await sb(
      `tracked_queries?select=brand,query&order=last_tracked_at.asc.nullsfirst&limit=${limit}`,
      { method: "GET" }
    );
    if (!res.ok) return [];
    return (await res.json()) as TrackedQuery[];
  } catch (err) {
    console.error("[tracking] listTrackedQueries失敗:", err);
    return [];
  }
}
