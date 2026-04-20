// Culture-fit diagnostic. 5 questions spanning decision-making style, pace,
// work environment, motivation, and learning mode. Kept static so we can audit
// changes — these answers feed the matching model in Phase 3.
export type CultureQuestion = {
  id: string;
  prompt: string;
  options: { value: string; label: string }[];
};

export const CULTURE_QUESTIONS: readonly CultureQuestion[] = [
  {
    id: "decision_making",
    prompt: "チームで働くとき、あなたはどちらに近いですか?",
    options: [
      { value: "lead", label: "意思決定を主導する" },
      { value: "consensus", label: "合意形成を重視する" },
      { value: "expertise", label: "専門性で貢献する" },
    ],
  },
  {
    id: "pace_preference",
    prompt: "どちらの環境で成果を出しやすいですか?",
    options: [
      { value: "startup", label: "変化が速く、優先順位が日々変わる環境" },
      { value: "balanced", label: "一定のスピード感で計画的に進める環境" },
      { value: "stable", label: "腰を据えて深く掘り下げる環境" },
    ],
  },
  {
    id: "work_style",
    prompt: "理想的な働き方に最も近いものは?",
    options: [
      { value: "remote_first", label: "フルリモート中心" },
      { value: "hybrid", label: "週数回オフィス + リモート" },
      { value: "office", label: "オフィス中心で対面コラボ" },
      { value: "flexible", label: "役割に応じて柔軟に" },
    ],
  },
  {
    id: "motivation",
    prompt: "仕事で最もエネルギーが出るのは?",
    options: [
      { value: "impact", label: "事業インパクトを直接感じること" },
      { value: "craft", label: "技術・専門性を極めること" },
      { value: "team", label: "仲間と協働し成果を作ること" },
      { value: "growth", label: "新しい領域を学ぶこと" },
    ],
  },
  {
    id: "learning_mode",
    prompt: "新しい知識はどう身につけたいですか?",
    options: [
      { value: "mentor", label: "優れたメンター・上司から学ぶ" },
      { value: "peers", label: "同僚との議論から学ぶ" },
      { value: "self", label: "自分で調べて試す" },
      { value: "formal", label: "体系的な教材や研修で学ぶ" },
    ],
  },
] as const;

export type CultureAnswers = Record<string, string>;
