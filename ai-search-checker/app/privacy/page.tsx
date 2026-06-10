import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import { COMPANY, LEGAL_DATES, PLACEHOLDERS } from "@/lib/company";

export const metadata: Metadata = {
  title: "プライバシーポリシー | AI検索対応診断",
  description:
    "株式会社KAAAYが運営するAI検索対応診断における個人情報の取り扱い方針(プライバシーポリシー)です。",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="プライバシーポリシー"
      lead={`${COMPANY.name}(以下「当社」といいます。)は、本サービス「AI検索対応診断」(以下「本サービス」といいます。)における利用者の個人情報を、個人情報の保護に関する法律(個人情報保護法)その他関係法令を遵守し、以下の方針に基づき適切に取り扱います。`}
    >
      <LegalSection heading="1. 取得する情報">
        <p>当社は、本サービスの提供にあたり、以下の情報を取得します。</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>会社名</li>
          <li>メールアドレス</li>
          <li>診断対象として入力されたURL</li>
          <li>診断結果(スコア・判定内容等)</li>
          <li>
            アクセス解析情報(Cookie、閲覧ログ等)。当社は本サービスの利用状況を把握するため、
            Cookie を利用した Google Analytics(Google LLC 提供)を使用する場合があります。
            これにより取得される情報は、同サービスのプライバシーポリシーに基づき管理されます。
            なお、ブラウザの設定により Cookie の利用を無効化することができます。
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="2. 利用目的">
        <p>当社は、取得した情報を以下の目的で利用します。</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>診断結果(詳細レポート・改善提案を含む)の提供のため</li>
          <li>本サービスの維持・改善、新機能の開発のため</li>
          <li>
            当社サービスのご案内(メールマガジン・営業上のご連絡を含む)の送付のため
          </li>
          <li>お問い合わせへの対応のため</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. 第三者提供">
        <p>
          当社は、法令に基づく場合を除き、あらかじめ利用者の同意を得ることなく、取得した個人情報を第三者に提供することはありません。
        </p>
      </LegalSection>

      <LegalSection heading="4. 委託">
        <p>
          当社は、利用目的の達成に必要な範囲において、個人情報の取り扱いの全部または一部を、
          サーバー・クラウドサービス等の外部事業者に委託する場合があります。
          この場合、当社は委託先に対して必要かつ適切な監督を行います。
        </p>
      </LegalSection>

      <LegalSection heading="5. 安全管理措置">
        <p>
          当社は、取り扱う個人情報の漏えい、滅失またはき損の防止その他の安全管理のために、
          アクセス制御、通信の暗号化、取り扱い者の制限など、必要かつ適切な措置を講じます。
        </p>
      </LegalSection>

      <LegalSection heading="6. 開示・訂正・利用停止等の請求">
        <p>
          利用者は、当社が保有する自己の個人情報について、開示・訂正・追加・削除・利用停止・消去・第三者提供の停止を請求することができます。
          ご請求の際は、下記のお問い合わせ窓口までご連絡ください。ご本人であることを確認のうえ、法令に従い合理的な期間内に対応いたします。
        </p>
      </LegalSection>

      <LegalSection heading="7. お問い合わせ窓口">
        <p>本ポリシーに関するお問い合わせ、および前項のご請求は、以下までご連絡ください。</p>
        <ul className="list-none space-y-1">
          <li>事業者名：{COMPANY.name}</li>
          <li>所在地：〒{COMPANY.postalCode} {COMPANY.address}</li>
          <li>メールアドレス：{PLACEHOLDERS.contactEmail}</li>
        </ul>
      </LegalSection>

      <LegalSection heading="8. 制定日・改定">
        <p>
          本ポリシーは、必要に応じて改定することがあります。改定後の内容は本ページに掲載した時点から効力を生じます。
        </p>
        <ul className="list-none space-y-1">
          <li>制定日：{LEGAL_DATES.established}</li>
          <li>最終改定日：{LEGAL_DATES.lastUpdated}</li>
        </ul>
      </LegalSection>
    </LegalPage>
  );
}
