import type { CheerioAPI } from "cheerio";
import type { CategoryResult, DiagnosisItem, ItemStatus } from "./types";

/** JSON-LD ノードの簡易表現 */
type JsonLdNode = Record<string, unknown>;

/** @type の値を文字列配列へ正規化 */
function typeNames(node: JsonLdNode): string[] {
  const t = node["@type"];
  if (typeof t === "string") return [t];
  if (Array.isArray(t)) return t.filter((x): x is string => typeof x === "string");
  return [];
}

/** ページ内の全 JSON-LD を平坦化して収集(@graph・配列・ネストに対応) */
function collectJsonLdNodes($: CheerioAPI): JsonLdNode[] {
  const nodes: JsonLdNode[] = [];

  const walk = (value: unknown) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (typeof value === "object") {
      const obj = value as JsonLdNode;
      if ("@graph" in obj) walk(obj["@graph"]);
      if ("@type" in obj) nodes.push(obj);
      // ネストされた値(offers, aggregateRating, review など)も辿る
      for (const [key, v] of Object.entries(obj)) {
        if (key === "@graph") continue;
        if (v && typeof v === "object") walk(v);
      }
    }
  };

  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    if (!raw || !raw.trim()) return;
    try {
      walk(JSON.parse(raw));
    } catch {
      // 不正なJSONは無視(別途 detail に記録される)
    }
  });

  return nodes;
}

/** 指定タイプのノードを取得 */
function findByType(nodes: JsonLdNode[], type: string): JsonLdNode[] {
  return nodes.filter((n) => typeNames(n).includes(type));
}

/** プロパティが存在するか(前方一致も許容: "gtin" は gtin13 等にマッチ) */
function hasProp(node: JsonLdNode, prop: string): boolean {
  for (const [key, v] of Object.entries(node)) {
    if ((key === prop || key.startsWith(prop)) && v !== undefined && v !== null && v !== "") {
      return true;
    }
  }
  return false;
}

/** 指定プロパティ群のうち存在するものを返す */
function presentProps(node: JsonLdNode, props: string[]): string[] {
  return props.filter((p) => hasProp(node, p));
}

interface SchemaSpec {
  id: string;
  type: string;
  label: string;
  /** このスキーマの満点 */
  weight: number;
  /** 必須プロパティ(充足率でスコアを按分) */
  required: string[];
  /** 推奨プロパティ(満たすとより高評価。weight の一部を按分) */
  recommended?: string[];
  /** 未対応時のアドバイス */
  failAdvice: string;
  /** 必須不足時のアドバイス(不足プロパティ名を埋め込む) */
  warnAdvice: (missing: string[]) => string;
  /** 推奨不足時のヒント(必須は満たすが推奨が欠ける場合) */
  recommendAdvice?: (missing: string[]) => string;
}

const SCHEMA_SPECS: SchemaSpec[] = [
  {
    id: "product",
    type: "Product",
    label: "Product(商品)スキーマ",
    weight: 6,
    required: ["name", "image", "description"],
    recommended: ["brand", "sku", "gtin", "mpn"],
    failAdvice:
      "商品ページに Product スキーマ(JSON-LD)を追加してください。AI検索が商品名・画像・説明を正確に理解できるようになります。",
    warnAdvice: (m) =>
      `Product スキーマに ${m.join(" / ")} が不足しています。これらを補うとAIが商品情報をより正確に引用できます。`,
    recommendAdvice: (m) =>
      `Product に商品識別子 ${m.join(" / ")} を追加すると、AIショッピングや商品マッチングでの精度が上がります。`,
  },
  {
    id: "offer",
    type: "Offer",
    label: "Offer(価格・在庫)スキーマ",
    weight: 5,
    required: ["price", "priceCurrency", "availability"],
    recommended: ["shippingDetails", "hasMerchantReturnPolicy"],
    failAdvice:
      "価格・在庫を示す Offer スキーマを追加してください。AI検索やGoogleの商品表示で価格・在庫が反映されやすくなります。",
    warnAdvice: (m) =>
      `Offer スキーマに ${m.join(" / ")} が不足しています。price・priceCurrency・availability を揃えると効果的です。`,
    recommendAdvice: (m) =>
      `Offer に送料・返品情報(${m.join(" / ")})を追加すると、Googleの無料リスティングやAI購買での評価が高まります。`,
  },
  {
    id: "aggregateRating",
    type: "AggregateRating",
    label: "AggregateRating(評価集計)スキーマ",
    weight: 2,
    required: ["ratingValue", "reviewCount"],
    failAdvice:
      "レビュー評価の集計(AggregateRating)を追加すると、AI検索や検索結果で星評価が表示されやすくなります。",
    warnAdvice: (m) =>
      `AggregateRating に ${m.join(" / ")} が不足しています。ratingValue と件数情報を揃えてください。`,
  },
  {
    id: "review",
    type: "Review",
    label: "Review(個別レビュー)スキーマ",
    weight: 2,
    required: ["reviewRating", "author"],
    failAdvice:
      "個別のレビュー(Review)を構造化すると、AIが「利用者の声」を引用しやすくなり信頼性が高まります。",
    warnAdvice: (m) =>
      `Review に ${m.join(" / ")} が不足しています。評価値と投稿者情報を含めてください。`,
  },
  {
    id: "faqPage",
    type: "FAQPage",
    label: "FAQPage(よくある質問)スキーマ",
    weight: 3,
    required: ["mainEntity"],
    failAdvice:
      "よくある質問を FAQPage スキーマで構造化すると、AI検索が質問への直接回答として引用しやすくなります。",
    warnAdvice: () =>
      "FAQPage に質問項目(mainEntity)が含まれていません。Question / Answer を追加してください。",
  },
  {
    id: "breadcrumbList",
    type: "BreadcrumbList",
    label: "BreadcrumbList(パンくず)スキーマ",
    weight: 1,
    required: ["itemListElement"],
    failAdvice:
      "パンくずリストを BreadcrumbList で構造化すると、AI・検索エンジンがサイト階層を理解しやすくなります。",
    warnAdvice: () =>
      "BreadcrumbList に階層項目(itemListElement)が含まれていません。",
  },
  {
    id: "organization",
    type: "Organization",
    label: "Organization(事業者情報)スキーマ",
    weight: 3,
    required: ["name", "url", "logo"],
    failAdvice:
      "運営事業者を示す Organization スキーマを追加すると、AIが「どの会社のサイトか」を正しく認識し信頼性が高まります。",
    warnAdvice: (m) =>
      `Organization に ${m.join(" / ")} が不足しています。name・url・logo を揃えると効果的です。`,
  },
  {
    id: "website",
    type: "WebSite",
    label: "WebSite + SearchAction スキーマ",
    weight: 1,
    required: ["url"],
    recommended: ["potentialAction"],
    failAdvice:
      "WebSite スキーマを追加すると、サイト名や検索ボックス(SearchAction)が認識されやすくなります。",
    warnAdvice: (m) =>
      `WebSite スキーマに ${m.join(" / ")} が不足しています。`,
    recommendAdvice: () =>
      "WebSite に SearchAction(potentialAction)を追加すると、サイト内検索ボックスが検索結果に表示される可能性があります。",
  },
  {
    id: "itemList",
    type: "ItemList",
    label: "ItemList(一覧)スキーマ",
    weight: 1,
    required: ["itemListElement"],
    failAdvice:
      "カテゴリ・商品一覧ページに ItemList スキーマを追加すると、AIが一覧の構造を理解しやすくなります(主に一覧ページ向け)。",
    warnAdvice: () => "ItemList に一覧項目(itemListElement)が含まれていません。",
  },
];

const CATEGORY_MAX = SCHEMA_SPECS.reduce((s, spec) => s + spec.weight, 0); // 合計24点

/**
 * 構造化データ(JSON-LD)の診断。
 * 満点 24点(各スキーマの加重合計)。
 */
export function analyzeStructuredData($: CheerioAPI): CategoryResult {
  const scriptCount = $('script[type="application/ld+json"]').length;
  const nodes = collectJsonLdNodes($);

  const items: DiagnosisItem[] = [];
  let score = 0;

  // まず JSON-LD 自体の有無を1項目として表示(スコアは各スキーマで加算)
  if (scriptCount === 0) {
    items.push({
      id: "jsonld-presence",
      label: "JSON-LD 構造化データ",
      status: "fail",
      detail: "JSON-LD(application/ld+json)が見つかりませんでした。",
      advice:
        "AI検索は構造化データを重視します。まずは Product / Organization など主要なスキーマをJSON-LDで実装することを強くおすすめします。",
    });
  } else {
    items.push({
      id: "jsonld-presence",
      label: "JSON-LD 構造化データ",
      status: "ok",
      detail: `JSON-LDを ${scriptCount} 件検出しました。`,
    });
  }

  for (const spec of SCHEMA_SPECS) {
    const matched = findByType(nodes, spec.type);
    if (matched.length === 0) {
      items.push({
        id: `schema-${spec.id}`,
        label: spec.label,
        status: "fail",
        detail: "未検出です。",
        advice: spec.failAdvice,
      });
      continue;
    }

    // 最も充足度の高いノードで判定(必須・推奨それぞれ)
    let bestRequired: string[] = [];
    let bestRecommended: string[] = [];
    for (const node of matched) {
      const req = presentProps(node, spec.required);
      if (req.length > bestRequired.length) bestRequired = req;
      if (spec.recommended) {
        const rec = presentProps(node, spec.recommended);
        if (rec.length > bestRecommended.length) bestRecommended = rec;
      }
    }
    const missing = spec.required.filter((p) => !bestRequired.includes(p));
    const requiredRatio =
      spec.required.length === 0 ? 1 : bestRequired.length / spec.required.length;

    // 推奨プロパティがある場合、weight の20%を推奨の充足率に割り当てる
    let earned: number;
    let missingRec: string[] = [];
    if (spec.recommended && spec.recommended.length > 0) {
      missingRec = spec.recommended.filter((p) => !bestRecommended.includes(p));
      const recRatio = bestRecommended.length / spec.recommended.length;
      earned = spec.weight * (0.8 * requiredRatio + 0.2 * recRatio);
    } else {
      earned = spec.weight * requiredRatio;
    }
    score += earned;

    let status: ItemStatus;
    let detail: string;
    let advice: string | undefined;
    if (missing.length > 0) {
      status = "warning";
      detail = `検出済みですが必須プロパティが不足しています(不足: ${missing.join(", ")})。`;
      advice = spec.warnAdvice(missing);
    } else if (missingRec.length > 0 && spec.recommendAdvice) {
      // 必須は満たすが推奨が欠ける → OK扱いだが改善ヒントを添える
      status = "ok";
      detail = `検出済み・必須プロパティを充足(${matched.length}件)。推奨プロパティ ${missingRec.join(", ")} は未設定です。`;
      advice = spec.recommendAdvice(missingRec);
    } else {
      status = "ok";
      detail = `検出済み・必須プロパティを充足しています(${matched.length}件)。`;
    }
    items.push({ id: `schema-${spec.id}`, label: spec.label, status, detail, advice });
  }

  // JSON-LD以外の形式(microdata / RDFa)の参考検出
  const microdataCount = $("[itemscope]").length;
  if (scriptCount === 0 && microdataCount > 0) {
    items.push({
      id: "microdata-note",
      label: "microdata / RDFa",
      status: "warning",
      detail: `JSON-LDは無いものの microdata(itemscope)を ${microdataCount} 件検出しました。`,
      advice:
        "本診断はJSON-LDを基準に評価しています。GoogleはJSON-LDを推奨しているため、microdataからJSON-LDへの移行・併用を検討してください。",
    });
  }

  score = Math.min(Math.round(score), CATEGORY_MAX);

  return {
    id: "structuredData",
    label: "構造化データ",
    description: "JSON-LDによる商品・評価・FAQなどの構造化(AI検索が最も重視)",
    score,
    maxScore: CATEGORY_MAX,
    percent: Math.round((score / CATEGORY_MAX) * 100),
    items,
  };
}
