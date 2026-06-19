import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/config";

/**
 * Google Analytics 4。
 * 環境変数 NEXT_PUBLIC_GA_ID が設定されている場合のみタグを読み込む。
 * (プライバシーポリシーに記載のGA利用と整合)
 */
export default function Analytics() {
  if (!GA_MEASUREMENT_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
