import { ImageResponse } from "next/og";

// サービスのファビコン("AI"のブランドマーク)を動的生成
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "white",
          background: "#2563eb",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          letterSpacing: -1,
        }}
      >
        AI
      </div>
    ),
    { ...size }
  );
}
