import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, ANTHROPIC_MODEL } from "./anthropic";

export const MatchEvaluationSchema = z.object({
  fitScore: z.number().min(0).max(100).describe("0-100の総合マッチ度"),
  skillMatch: z.string().describe("スキル面の評価を日本語で200字前後"),
  cultureMatch: z.string().describe("カルチャー面の評価を日本語で200字前後"),
  careerMatch: z.string().describe("キャリア段階の適合性を日本語で200字前後"),
  concerns: z.array(z.string()).describe("懸念点のリスト (0〜5件)"),
  recommendation: z.enum(["APPROVE", "REJECT"]).describe("総合推薦。70点以上かつ懸念少なければAPPROVE。"),
  reasoning: z.string().describe("総合評価の理由を日本語で300字前後"),
});

export type MatchEvaluation = z.infer<typeof MatchEvaluationSchema>;

// [COMPLIANCE] Prompt explicitly forbids protected-attribute screening; any
// change to this block needs placement-officer sign-off.
const SYSTEM_PROMPT = `あなたはベテランの採用コンサルタントです。候補者プロフィールと求人情報を
突き合わせ、マッチ度を客観的に評価してください。

重要な制約:
- 年齢・性別・国籍・人種・宗教・婚姻状況・健康状態・障害の有無を理由とした
  スコアリングや言及は禁止です (職業安定法違反)。
- 推測や偏見を交えた表現を避け、スキル・経験・志向・カルチャーの客観的な
  適合性のみを評価してください。
- カルチャーの観点では、候補者のカルチャー診断の回答と求人企業の特性を
  突き合わせてください。
- 懸念事項は建設的に記述してください。`;

export type CandidateContext = {
  id: string;
  displayName: string;
  currentPosition: string | null;
  yearsOfExperience: number | null;
  skills: string[];
  desiredRoles: string[];
  desiredSalaryMin: number | null;
  desiredSalaryMax: number | null;
  workStyle: string;
  cultureAnswers: Record<string, string>;
  resumeText: string | null;
};

export type JobContext = {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  salaryMin: number;
  salaryMax: number;
  workStyle: string;
  company: {
    name: string;
    industry: string;
    description: string;
    size: string;
  };
};

export async function evaluateMatch(
  candidate: CandidateContext,
  job: JobContext
): Promise<MatchEvaluation> {
  // The system prompt is stable across every evaluation in a batch, so we
  // mark it cache_control: ephemeral to reuse it across calls in a run.
  const response = await anthropic().messages.parse({
    model: ANTHROPIC_MODEL,
    max_tokens: 2000,
    system: [
      { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
    ],
    messages: [
      {
        role: "user",
        content: `以下の候補者と求人のマッチ度を評価してください。

【候補者】
${JSON.stringify(candidate, null, 2)}

【求人】
${JSON.stringify(job, null, 2)}

JSONで出力してください。`,
      },
    ],
    output_config: { format: zodOutputFormat(MatchEvaluationSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("マッチ評価の構造化に失敗しました。");
  }
  return response.parsed_output;
}
