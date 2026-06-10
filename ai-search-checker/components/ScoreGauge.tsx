"use client";

interface ScoreGaugeProps {
  score: number; // 0-100
  grade: string;
  size?: number;
}

/** 総合スコアを円形ゲージで表示 */
export default function ScoreGauge({ score, grade, size = 200 }: ScoreGaugeProps) {
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference * (1 - clamped / 100);

  // スコア帯で色を変える
  const color =
    clamped >= 75 ? "#16a34a" : clamped >= 50 ? "#2563eb" : clamped >= 40 ? "#d97706" : "#dc2626";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="gauge-animate"
          style={
            {
              ["--gauge-start" as string]: `${circumference}`,
              ["--gauge-end" as string]: `${offset}`,
            } as React.CSSProperties
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-extrabold tabular-nums" style={{ color }}>
          {clamped}
        </div>
        <div className="text-xs text-ink-500">/ 100点</div>
        <div
          className="mt-1 rounded-full px-3 py-0.5 text-sm font-bold text-white"
          style={{ backgroundColor: color }}
        >
          グレード {grade}
        </div>
      </div>
    </div>
  );
}
