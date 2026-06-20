// X(Twitter)へ自動投稿するスクリプト。GitHub Actions から毎日実行される想定。
// キュー(x-queue.txt)から「年内通算日」に応じて1本を選び投稿する（状態保存不要のローテーション）。
//
// 必要な環境変数（GitHub Secrets）:
//   X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET
// 未設定の場合は何もせず正常終了（スキップ）。

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET } = process.env;

if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET) {
  console.log("X APIキーが未設定のため投稿をスキップします。");
  process.exit(0);
}

const here = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(join(here, "x-queue.txt"), "utf8");
const posts = raw
  .split(/\n-{3,}\n/)
  .map((s) => s.trim())
  .filter(Boolean);

if (posts.length === 0) {
  console.log("キューが空です。");
  process.exit(0);
}

// 年内通算日でローテーション（毎日違う投稿。1周したら最初に戻る）
const now = new Date();
const start = new Date(now.getFullYear(), 0, 0);
const dayOfYear = Math.floor((now - start) / 86400000);
const post = posts[dayOfYear % posts.length];

const { TwitterApi } = await import("twitter-api-v2");
const client = new TwitterApi({
  appKey: X_API_KEY,
  appSecret: X_API_SECRET,
  accessToken: X_ACCESS_TOKEN,
  accessSecret: X_ACCESS_SECRET,
});

try {
  const { data } = await client.v2.tweet(post);
  console.log("投稿成功:", data.id);
} catch (err) {
  console.error("投稿失敗:", err?.data || err?.message || err);
  process.exit(1);
}
