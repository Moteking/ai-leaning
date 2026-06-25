import { ImageResponse } from "next/og";

// 検索結果・SNSシェア時のサムネイル(OGP画像)を動的生成。
// app直下に置くと全ページのデフォルト og:image / twitter:image になる。
export const alt = "AI検索対応診断 | ECサイトのAI検索対応度を無料診断";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 36 }}>
          <div
            style={{
              width: 72,
              height: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "white",
              color: "#1d4ed8",
              borderRadius: 16,
              fontSize: 38,
              fontWeight: 800,
            }}
          >
            AI
          </div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>AI検索対応診断</div>
        </div>
        <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.25 }}>
          あなたのECサイトは
        </div>
        <div style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.25 }}>
          AIに見つけてもらえますか?
        </div>
        <div style={{ marginTop: 32, fontSize: 30, color: "#bfdbfe" }}>
          URLを入れるだけ・30秒で無料診断 — ChatGPT / Perplexity / AI Overview 対応度をスコア化
        </div>
      </div>
    ),
    { ...size }
  );
}
