// 簡易レートリミッタ(インメモリ・ベストエフォート)。
// サーバーレスではインスタンス単位の制限になるが、無いよりは濫用を抑制できる。
// 本格運用では Upstash Redis 等の共有ストアへの差し替えを推奨。

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * 指定キーが時間窓内の上限を超えていないか判定する。
 * @returns allowed=false なら制限超過
 */
export function rateLimit(
  key: string,
  limit = 20,
  windowMs = 10 * 60 * 1000
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

/** リクエストから接続元IPを推定する */
export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
