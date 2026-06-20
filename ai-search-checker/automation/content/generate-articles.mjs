// AIOメディアの記事を自動生成するスクリプト。GitHub Actions から毎日実行される想定。
// 公式 Anthropic SDK(@anthropic-ai/sdk)で Claude を呼び、content/blog/*.md を生成する。
//
// 必要な環境変数:
//   ANTHROPIC_API_KEY            … Anthropic APIキー(GitHub Secrets)。未設定なら何もせず終了。
//   ARTICLES_PER_RUN (任意)      … 1回の実行で生成する記事数(既定 2)。
//   ARTICLE_MODEL (任意)         … 使用モデル(既定 claude-opus-4-8)。コスト重視なら claude-haiku-4-5 等に変更可。
//
// 仕組み: topics.txt の未使用トピックを ARTICLES_PER_RUN 件選び、各トピックで記事(JSON)を生成し、
//         content/blog/<slug>.md にフロントマター付きで書き出す。GitHub Actions がコミット&プッシュ→Vercelが公開。

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.log("ANTHROPIC_API_KEY が未設定のため、記事生成をスキップします。");
  process.exit(0);
}

const MODEL = process.env.ARTICLE_MODEL || "claude-opus-4-8";
const PER_RUN = Math.max(1, parseInt(process.env.ARTICLES_PER_RUN || "2", 10) || 2);

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "..", "..");
const BLOG_DIR = path.join(projectRoot, "content", "blog");
const TOPICS_FILE = path.join(here, "topics.txt");
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aio-diagnosis.com";

fs.mkdirSync(BLOG_DIR, { recursive: true });

// 既に生成済みのトピックを収集(frontmatter の topic キーで重複判定)
const usedTopics = new Set();
const existingSlugs = new Set();
for (const f of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))) {
  existingSlugs.add(f.replace(/\.md$/, ""));
  try {
    const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, f), "utf8"));
    if (data && typeof data.topic === "string") usedTopics.add(data.topic.trim());
  } catch {
    /* 壊れたファイルは無視 */
  }
}

const allTopics = fs
  .readFileSync(TOPICS_FILE, "utf8")
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter(Boolean);

const pending = allTopics.filter((t) => !usedTopics.has(t)).slice(0, PER_RUN);
if (pending.length === 0) {
  console.log("生成すべき新しいトピックがありません(topics.txt を追加してください)。");
  process.exit(0);
}

const { default: Anthropic } = await import("@anthropic-ai/sdk");
const client = new Anthropic({ apiKey });

// 構造化出力スキーマ(有効なJSONを保証)
const schema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    slug: { type: "string", description: "URL用の英小文字スラッグ(英数字とハイフンのみ)" },
    tags: { type: "array", items: { type: "string" } },
    body_markdown: { type: "string", description: "見出し(##, ###)・箇条書きを含む本文(Markdown)" },
    faq: {
      type: "array",
      items: {
        type: "object",
        properties: { q: { type: "string" }, a: { type: "string" } },
        required: ["q", "a"],
        additionalProperties: false,
      },
    },
  },
  required: ["title", "description", "slug", "tags", "body_markdown", "faq"],
  additionalProperties: false,
};

function slugify(s, fallback) {
  const base = String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || fallback;
}

function uniqueSlug(slug) {
  let s = slug;
  let i = 2;
  while (existingSlugs.has(s)) {
    s = `${slug}-${i++}`;
  }
  existingSlugs.add(s);
  return s;
}

const today = new Date().toISOString().slice(0, 10);
let written = 0;

for (const topic of pending) {
  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 8000,
      output_config: { format: { type: "json_schema", schema } },
      system:
        "あなたは日本のEC事業者向けに、AI検索最適化(AIO)・SEO・構造化データに精通したプロのコンテンツ編集者です。" +
        "読者の役に立つ、独自性のある正確な記事を日本語で書きます。誇張や事実でない断定は避け、具体的で実践的に書いてください。" +
        "出力はHTMLではなくMarkdownのみ(見出しは ## と ###、箇条書きや表を適宜使用)。スクリプトや危険なHTMLは絶対に含めないこと。",
      messages: [
        {
          role: "user",
          content:
            `次のトピックでSEO/AIO記事を1本書いてください。\n\n` +
            `トピック: ${topic}\n\n` +
            `要件:\n` +
            `- 本文は約1500〜2200文字、## と ### の見出しで構成\n` +
            `- 箇条書きや表を適宜使い、読みやすく\n` +
            `- EC事業者がすぐ実践できる具体的な内容に\n` +
            `- 末尾に、無料診断(${SITE_URL})への自然な誘導を1段落入れる\n` +
            `- FAQを3〜5個(各問いと回答)\n` +
            `- description は120文字以内\n` +
            `- slug は内容を表す英小文字のスラッグ(例: chatgpt-search-ec-products)\n`,
        },
      ],
    });

    const textBlock = res.content.find((b) => b.type === "text");
    if (!textBlock) {
      console.error(`[skip] テキスト応答なし: ${topic}`);
      continue;
    }
    const data = JSON.parse(textBlock.text);

    const slug = uniqueSlug(slugify(data.slug, slugify(topic, `post-${Date.now()}`)));
    const frontmatter = {
      title: data.title,
      description: data.description,
      date: today,
      tags: Array.isArray(data.tags) ? data.tags.slice(0, 6) : [],
      topic, // 重複判定用
      faq: Array.isArray(data.faq) ? data.faq : [],
    };
    const fileContent = matter.stringify(String(data.body_markdown || "").trim() + "\n", frontmatter);
    fs.writeFileSync(path.join(BLOG_DIR, `${slug}.md`), fileContent, "utf8");
    console.log(`✅ 生成: ${slug}.md  (${data.title})`);
    written++;
  } catch (err) {
    console.error(`[error] ${topic}:`, err?.message || err);
  }
}

console.log(`完了: ${written} 件の記事を生成しました。`);
