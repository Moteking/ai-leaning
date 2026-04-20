import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, ANTHROPIC_MODEL } from "./anthropic";

export const ResumeStructureSchema = z.object({
  displayName: z.string().describe("候補者のフルネーム。記載があればそのまま、なければ空文字。"),
  currentPosition: z.string().describe("直近の職種・肩書き。例: シニアソフトウェアエンジニア。"),
  yearsOfExperience: z.number().int().min(0).max(60).describe("社会人経験年数(概算)。"),
  skills: z.array(z.string()).describe("ハードスキル・技術スタックのリスト。8〜15件。"),
  desiredRoles: z.array(z.string()).describe("今後挑戦したい職種・領域。記載がなければ推定しない。"),
  summary: z.string().describe("300字程度の経歴サマリ。日本語。"),
});

export type ResumeStructure = z.infer<typeof ResumeStructureSchema>;

// [COMPLIANCE] The instruction below forbids the model from inferring or
// highlighting attributes protected under the Employment Security Act.
const SYSTEM_PROMPT = `あなたは中途採用マッチングサービスのプロフィール整形エンジンです。
職務経歴書のテキストを構造化されたJSONに変換してください。

**重要な制約**:
- 年齢・性別・国籍・婚姻状況・宗教・障害の有無を推定したり出力に含めてはいけません (職業安定法・個人情報保護法)。
- 差別的・偏見的な表現は使用しないでください。
- スキルは技術・業務知識・業界経験に限定し、固有名詞を正確に扱ってください。
- 分からない項目は空文字や空配列を返し、推測で埋めないでください。`;

export async function parseResume(resumeText: string): Promise<ResumeStructure> {
  const response = await anthropic().messages.parse({
    model: ANTHROPIC_MODEL,
    max_tokens: 4000,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `以下の職務経歴書を構造化してください。\n\n<<<RESUME\n${resumeText}\nRESUME`,
      },
    ],
    output_config: { format: zodOutputFormat(ResumeStructureSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("職務経歴書の構造化に失敗しました。本文を見直して再度お試しください。");
  }
  return response.parsed_output;
}
