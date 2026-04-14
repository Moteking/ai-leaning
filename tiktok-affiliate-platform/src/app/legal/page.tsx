import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "特定商取引法に基づく表記 - TikAfi",
};

export default function LegalPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">特定商取引法に基づく表記</h1>
          <p className="text-sm text-gray-500 mb-10">最終更新日：2026年4月7日</p>

          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  { label: "販売事業者", value: "TikAfi運営（※正式な法人名・個人名に変更してください）" },
                  { label: "運営責任者", value: "（※責任者名を記入してください）" },
                  { label: "所在地", value: "（※住所を記入してください）" },
                  { label: "電話番号", value: "（※電話番号を記入してください）※お問い合わせはメールにてお願いいたします" },
                  { label: "メールアドレス", value: "info@tikafi.jp" },
                  { label: "販売価格", value: "各プランの料金ページに記載\n・フリープラン：¥0/月\n・スタータープラン：¥29,800/月\n・プロプラン：¥79,800/月\n・エンタープライズプラン：個別見積もり\n上記に加え、成約1件あたり¥100〜¥10,000の成果手数料" },
                  { label: "販売価格以外に必要な費用", value: "インターネット接続料金、通信料金等はお客様のご負担となります" },
                  { label: "支払い方法", value: "クレジットカード（Visa, Mastercard, American Express, JCB）" },
                  { label: "支払い時期", value: "月額利用料：毎月1日に自動決済\n成果手数料：月次で集計し翌月に請求" },
                  { label: "サービス提供時期", value: "お申し込み手続き完了後、直ちにご利用いただけます" },
                  { label: "キャンセル・解約", value: "マイページからいつでも解約可能です。解約した場合、当月末までサービスをご利用いただけます。日割り返金は行いません。" },
                  { label: "返金ポリシー", value: "デジタルサービスの性質上、原則として返金はいたしません。ただし、サービスの重大な瑕疵がある場合は個別に対応いたします。" },
                  { label: "動作環境", value: "・Google Chrome（最新版）\n・Safari（最新版）\n・Firefox（最新版）\n・Microsoft Edge（最新版）" },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <th className="text-left py-4 px-6 bg-surface font-medium w-48 align-top whitespace-nowrap">
                      {row.label}
                    </th>
                    <td className="py-4 px-6 whitespace-pre-line">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
