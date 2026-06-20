// 「AI検索対応診断」バッジ(SVG)。外部サイトに埋め込まれると被リンクになる。
// 例: /api/badge?score=85

export const runtime = "nodejs";

function escapeXml(s: string): string {
  return s.replace(/[<>&"']/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c] as string)
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("score");
  const score = raw !== null && raw !== "" ? Math.max(0, Math.min(100, parseInt(raw, 10) || 0)) : null;

  const scoreColor =
    score === null
      ? "#16a34a"
      : score >= 75
      ? "#16a34a"
      : score >= 50
      ? "#2563eb"
      : score >= 40
      ? "#d97706"
      : "#dc2626";

  const label = "✓ AI検索対応診断";
  const right = score === null ? "診断済み" : `${score}点`;
  const font =
    "font-family='Hiragino Sans, Hiragino Kaku Gothic ProN, Noto Sans JP, Meiryo, sans-serif'";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="234" height="40" role="img" aria-label="${escapeXml(label)} ${escapeXml(right)}">
  <rect width="234" height="40" rx="6" fill="#1d4ed8"/>
  <text x="14" y="25" fill="#ffffff" ${font} font-size="13" font-weight="700">${escapeXml(label)}</text>
  <rect x="168" y="8" width="58" height="24" rx="12" fill="${scoreColor}"/>
  <text x="197" y="24" fill="#ffffff" ${font} font-size="12" font-weight="700" text-anchor="middle">${escapeXml(right)}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
