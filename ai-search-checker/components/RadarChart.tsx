"use client";

export interface RadarDatum {
  label: string;
  percent: number; // 0-100
}

interface RadarChartProps {
  data: RadarDatum[];
  size?: number;
}

/** カテゴリ別スコアを多角形レーダーチャートで可視化(外部ライブラリ不使用) */
export default function RadarChart({ data, size = 320 }: RadarChartProps) {
  const n = data.length;
  if (n < 3) return null;

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 56; // ラベル分の余白
  const levels = 4;

  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const pointFor = (i: number, ratio: number) => {
    const a = angleFor(i);
    return {
      x: cx + radius * ratio * Math.cos(a),
      y: cy + radius * ratio * Math.sin(a),
    };
  };

  // 背景グリッド(同心多角形)
  const gridPolygons = Array.from({ length: levels }, (_, level) => {
    const ratio = (level + 1) / levels;
    const pts = data
      .map((_, i) => {
        const p = pointFor(i, ratio);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(" ");
    return pts;
  });

  // 軸線
  const axes = data.map((_, i) => pointFor(i, 1));

  // データ多角形
  const dataPoints = data.map((d, i) => pointFor(i, Math.max(0, Math.min(100, d.percent)) / 100));
  const dataPolygon = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${size} ${size}`}
      className="max-w-[360px] mx-auto"
      role="img"
      aria-label="カテゴリ別スコアのレーダーチャート"
    >
      {gridPolygons.map((pts, i) => (
        <polygon
          key={`grid-${i}`}
          points={pts}
          fill={i === levels - 1 ? "#f8fafc" : "none"}
          stroke="#e2e8f0"
          strokeWidth={1}
        />
      ))}

      {axes.map((p, i) => (
        <line
          key={`axis-${i}`}
          x1={cx}
          y1={cy}
          x2={p.x}
          y2={p.y}
          stroke="#e2e8f0"
          strokeWidth={1}
        />
      ))}

      <polygon
        points={dataPolygon}
        fill="rgba(37,99,235,0.20)"
        stroke="#2563eb"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {dataPoints.map((p, i) => (
        <circle key={`pt-${i}`} cx={p.x} cy={p.y} r={3.5} fill="#2563eb" />
      ))}

      {data.map((d, i) => {
        const labelP = pointFor(i, 1.18);
        const anchor =
          Math.abs(labelP.x - cx) < 8 ? "middle" : labelP.x > cx ? "start" : "end";
        return (
          <text
            key={`label-${i}`}
            x={labelP.x}
            y={labelP.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-ink-700"
            style={{ fontSize: 11, fontWeight: 600 }}
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
