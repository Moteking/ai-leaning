import type { Metadata } from "next";
import LegalPage, { DefinitionTable } from "@/components/LegalPage";
import { COMPANY, PLACEHOLDERS } from "@/lib/company";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | AI検索対応診断",
  description:
    "株式会社KAAAYが運営するAI検索対応診断に関する表記です。本サービスは無料でご利用いただけます。",
};

export default function TokushohoPage() {
  return (
    <LegalPage
      title="特定商取引法に基づく表記"
      lead="本サービス「AI検索対応診断」は、どなたでも無料でご利用いただけます。料金が発生する有料サービスの販売は行っておりません。本ページは、運営者情報を開示する目的で掲載しています。"
    >
      <DefinitionTable
        rows={[
          { label: "運営事業者", value: COMPANY.name },
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
            value: "電話でのお問い合わせは承っておりません。お問い合わせはメールにて承ります。",
          },
          { label: "お問い合わせ", value: PLACEHOLDERS.contactEmail },
          {
            label: "利用料金",
            value: "無料(本サービスのご利用にあたり、料金は一切発生しません)。",
          },
          {
            label: "料金以外の必要費用",
            value: "インターネット接続に必要な通信料金等は、利用者のご負担となります。",
          },
          {
            label: "サービスの提供時期",
            value: "本サイト上で、いつでもご利用いただけます。",
          },
          {
            label: "動作環境",
            value: (
              <>
                以下の最新版ブラウザでのご利用を推奨します。
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
