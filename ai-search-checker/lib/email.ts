import { CONSULT_CTA_URL, PROVIDER_NAME, SERVICE_NAME, SITE_URL } from "./config";

interface LeadEmailInput {
  company: string;
  email: string;
  url: string;
  score: number;
  grade: string;
}

/**
 * リード獲得時の自動サンクスメールを送信する。
 *
 * 外部メール配信(Brevo / Sendinblue の無料枠 300通/日)を利用。
 * 環境変数 BREVO_API_KEY が無い場合は何もしない(no-op)＝キー設定だけで自動化が有効になる。
 *
 * 別プロバイダ(Resend 等)に差し替える場合は、この関数の中身だけ変更すればよい。
 */
export async function sendThankYouEmail(lead: LeadEmailInput): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return; // 未設定なら自動メールは無効

  const fromEmail = process.env.EMAIL_FROM || "info@kaaay.co.jp";
  const fromName = process.env.EMAIL_FROM_NAME || SERVICE_NAME;

  const html = `
  <div style="font-family:Hiragino Sans,Meiryo,sans-serif;line-height:1.7;color:#0f172a">
    <p>${escapeHtml(lead.company)} 御中</p>
    <p>このたびは「${SERVICE_NAME}」をご利用いただきありがとうございます。<br>
    診断結果は以下のとおりです。</p>
    <table style="border-collapse:collapse;margin:16px 0">
      <tr><td style="padding:6px 12px;background:#f1f5f9;font-weight:bold">診断対象</td><td style="padding:6px 12px">${escapeHtml(lead.url)}</td></tr>
      <tr><td style="padding:6px 12px;background:#f1f5f9;font-weight:bold">総合スコア</td><td style="padding:6px 12px">${lead.score}点(グレード${escapeHtml(lead.grade)})</td></tr>
    </table>
    <p>項目別の詳細レポートと改善アドバイスは、診断結果ページでご確認いただけます。</p>
    <p style="margin:24px 0">
      <a href="${CONSULT_CTA_URL}" style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">専門家による無料相談を申し込む</a>
    </p>
    <p>AI検索(ChatGPT検索・Perplexity・Google AI Overview)への対応は、早く着手するほど有利です。
    改善方法でご不明な点があれば、お気軽にこのメールにご返信ください。</p>
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
    <p style="font-size:12px;color:#64748b">
      ${PROVIDER_NAME}<br>
      ${SITE_URL}<br>
      ※本メールは診断のお申し込みに基づきお送りしています。今後の配信を希望されない場合は、本メールにご返信ください。
    </p>
  </div>`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: lead.email, name: lead.company }],
        subject: `【${SERVICE_NAME}】診断のお申し込みありがとうございます(${lead.score}点)`,
        htmlContent: html,
        replyTo: { email: fromEmail, name: fromName },
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error("[email] Brevo送信失敗:", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("[email] 送信エラー:", err instanceof Error ? err.message : err);
  } finally {
    clearTimeout(timer);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[<>&"']/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}
