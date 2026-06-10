import type { Metadata } from "next";
import LegalPage, { DefinitionTable } from "@/components/LegalPage";
import { COMPANY, PLACEHOLDERS } from "@/lib/company";

export const metadata: Metadata = {
  title: "運営会社情報 | AI検索対応診断",
  description: "AI検索対応診断を運営する株式会社KAAAYの会社情報です。",
};

export default function CompanyPage() {
  return (
    <LegalPage title="運営会社情報" lead="本サービス「AI検索対応診断」の運営会社情報です。">
      <DefinitionTable
        rows={[
          { label: "会社名", value: COMPANY.name },
          { label: "代表者", value: COMPANY.representative },
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
            label: "事業内容",
            value: (
              <ul className="list-disc space-y-1 pl-5">
                {COMPANY.business.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ),
          },
          {
            label: "コーポレートサイト",
            value: (
              <a
                href={COMPANY.corporateSite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 hover:underline"
              >
                {COMPANY.corporateSite}
              </a>
            ),
          },
          { label: "お問い合わせ", value: PLACEHOLDERS.contactEmail },
        ]}
      />
    </LegalPage>
  );
}
