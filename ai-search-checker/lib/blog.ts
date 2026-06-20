import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// AIOメディア(ブログ)のデータ層。content/blog/*.md を読み、frontmatter を解析して描画する。
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface FaqItem {
  q: string;
  a: string;
}

export interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  faq: FaqItem[];
}

export interface TocItem {
  depth: number;
  text: string;
  id: string;
}

export interface BlogPost extends BlogMeta {
  html: string;
  toc: TocItem[];
}

/** 生成HTMLの簡易サニタイズ(スクリプト等を除去) */
function sanitize(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/ on[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/ on[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

function normalizeMeta(slug: string, data: Record<string, unknown>): BlogMeta {
  const faqRaw = Array.isArray(data.faq) ? (data.faq as unknown[]) : [];
  const faq: FaqItem[] = faqRaw
    .map((f) => f as Record<string, unknown>)
    .filter((f) => f && typeof f.q === "string" && typeof f.a === "string")
    .map((f) => ({ q: String(f.q), a: String(f.a) }));
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    description: typeof data.description === "string" ? data.description : "",
    date: typeof data.date === "string" ? data.date : "1970-01-01",
    tags: Array.isArray(data.tags) ? (data.tags as unknown[]).map(String) : [],
    faq,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllPostsMeta(): BlogMeta[] {
  return getAllSlugs()
    .map((slug) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), "utf8");
      return normalizeMeta(slug, matter(raw).data);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): BlogPost | null {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);

  // ==重要語== を黄色マーカー(<mark>)に変換
  const withMarks = content.replace(/==([^=\n]+)==/g, "<mark>$1</mark>");
  let rendered = marked.parse(withMarks, { async: false }) as string;

  // 見出し(h2/h3)に連番アンカーIDを付与し、目次(TOC)を生成
  const toc: TocItem[] = [];
  let n = 0;
  rendered = rendered.replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_m, lvl: string, inner: string) => {
      n += 1;
      const id = `sec-${n}`;
      const text = inner.replace(/<[^>]+>/g, "").trim();
      toc.push({ depth: Number(lvl), text, id });
      return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
    }
  );

  const html = sanitize(rendered);
  return { ...normalizeMeta(slug, data), html, toc };
}
