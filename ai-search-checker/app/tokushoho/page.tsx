import type { Metadata } from "next";
import LegalPage, { DefinitionTable } from "@/components/LegalPage";
import { COMPANY, PLACEHOLDERS } from "@/lib/company";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | AI検索対応診断",
  description:
    "株式会社KAAAYが提供する有料サービスに関する特定商取引法に基づく表記です。",
};

export default function TokushohoPage() {
  return (
    <LegalPage
      title="特定商取引法に基づく表記"
      lead="当社が提供する有料サービス(改善実装サポート、月額モニタリング等)に関する、特定商取引法に基づく表記です。無料診断のご利用には料金は発生しません。"
    >
      <DefinitionTable
        rows={[
          { label: "販売事業者", value: COMPANY.name },
          { label: "運営責任者", value: COMPANY.representativeName },
          {
            label: "所在地",
            value: (
              <>
                〒{COMPANY.postalCode}
                <br />
                {COMPANY.address}
              </>
            ),
          },
          {
            label: "電話番号",
            value: (
              <>
                {PLACEHOLDERS.phone}
                <br />
                <span className="text-ink-500">
                  ※お電話でのお問い合わせをご希望の場合、請求があれば遅滞なく開示いたします。
                </span>
              </>
            ),
          },
          { label: "メールアドレス", value: PLACEHOLDERS.contactEmail },
          {
            label: "販売価格",
            value: (
              <>
                各サービスの紹介ページに記載する金額(税込)によります。
                <br />
                本サイト上の「AI検索対応診断(無料診断)」のご利用料金は0円です。
              </>
            ),
          },
          {
            label: "商品代金以外の必要料金",
            value:
              "インターネット接続に必要な通信料金等は、利用者のご負担となります。",
          },
          {
            label: "支払方法",
            value: (
              <>
                銀行振込またはクレジットカード決済
                <br />
                {PLACEHOLDERS.paymentMethod}
              </>
            ),
          },
          {
            label: "支払時期",
            value: (
              <>
                銀行振込の場合：{PLACEHOLDERS.paymentTiming}
                <br />
                クレジットカードの場合：各カード会社の規定に基づきます。
              </>
            ),
          },
          {
            label: "サービスの提供時期",
            value:
              "契約成立後、当社と利用者の間で個別に定める日程に従って提供を開始します。",
          },
          {
            label: "返品・キャンセルについて",
            value:
              "サービスの性質上、提供開始後のお客様都合による返金・キャンセルは原則としてお受けできません。契約前に内容を十分にご確認ください。なお、当社の責に帰すべき事由による場合はこの限りではありません。",
          },
          {
            label: "動作環境",
            value: (
              <>
                本サービスは以下の最新版ブラウザでのご利用を推奨します。
                <br />
                Google Chrome / Safari / Microsoft Edge / Firefox(いずれも最新版)
              </>
            ),
          },
        ]}
      />
    </LegalPage>
  );
}
