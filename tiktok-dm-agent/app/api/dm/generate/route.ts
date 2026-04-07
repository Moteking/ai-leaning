import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  const { affiliatorId, campaignType, product, commission, tone = "friendly" } =
    await request.json();

  const affiliator = await prisma.affiliator.findUnique({
    where: { id: affiliatorId },
  });

  if (!affiliator) {
    return Response.json(
      { error: "Affiliator not found" },
      { status: 404 }
    );
  }

  const campaignTypeLabel =
    campaignType === "collab"
      ? "コラボ提案"
      : campaignType === "review"
        ? "商品レビュー依頼"
        : "アフィリエイト提案";

  const toneLabel =
    tone === "formal" ? "丁寧・フォーマル" : tone === "casual" ? "カジュアル" : "フレンドリー";

  const prompt = `あなたはTikTokアフィリエイター向けDM専門のコピーライターです。
以下の情報をもとに、開封・返信率が高い日本語DMを生成してください。

【アフィリエイター情報】
名前: ${affiliator.name}（${affiliator.tiktokHandle}）
ジャンル: ${affiliator.niche}
フォロワー数: ${affiliator.followers.toLocaleString()}
平均再生数: ${affiliator.avgViews.toLocaleString()}
エンゲージメント率: ${affiliator.engageRate}%

【案件情報】
種別: ${campaignTypeLabel}
商品/サービス: ${product}
報酬条件: ${commission || "応相談"}

【トーン】
${toneLabel}

【生成ルール】
- 文字数: 150〜200字
- 最初に名前で呼びかける（さん付け）
- そのアフィリエイターのジャンルに紐づけた自然な導入文
- 商品の魅力を1文で端的に
- 次のアクション（詳細をDMでお送りします等）で締める
- 絵文字2〜3個
- 署名なし
- 売り込み感を出さない、コラボ提案のトーンで`;

  // Create DM record first
  const dm = await prisma.dM.create({
    data: {
      affiliatorId,
      campaignType,
      product,
      commission,
      content: "",
      status: "draft",
    },
  });

  // Stream response
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let fullContent = "";

      try {
        const messageStream = anthropic.messages.stream({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        });

        // Send dmId first
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ dmId: dm.id })}\n\n`)
        );

        for await (const event of messageStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            fullContent += event.delta.text;
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
              )
            );
          }
        }

        // Update DM with full content
        await prisma.dM.update({
          where: { id: dm.id },
          data: { content: fullContent },
        });

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
        );
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: error instanceof Error ? error.message : "Generation failed" })}\n\n`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
