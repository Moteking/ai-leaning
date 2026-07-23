import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "プライバシーポリシー - TikAfi",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">プライバシーポリシー</h1>
          <p className="text-sm text-gray-500 mb-10">最終更新日：2026年4月7日</p>

          <div className="prose prose-sm max-w-none space-y-8 text-gray-700 leading-relaxed">
            <section>
              <p>TikAfi運営（以下「当社」といいます）は、本サービスにおけるユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシーを定めます。</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">1. 収集する情報</h2>
              <p>当社は、本サービスの提供にあたり、以下の情報を収集します。</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>アカウント情報</strong>：氏名、メールアドレス、パスワード、会社名（広告主の場合）、TikTokアカウント情報</li>
                <li><strong>プロフィール情報</strong>：プロフィール画像、自己紹介、カテゴリ、地域</li>
                <li><strong>TikTokアカウントデータ</strong>：フォロワー数、動画の再生数・いいね数・コメント数等のパフォーマンスデータ（TikTok APIを通じて取得）</li>
                <li><strong>取引情報</strong>：キャンペーンへの参加履歴、成約データ、報酬情報</li>
                <li><strong>決済情報</strong>：クレジットカード情報（Stripe社にて安全に管理）、銀行口座情報</li>
                <li><strong>利用情報</strong>：アクセスログ、IPアドレス、ブラウザ情報、Cookie</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">2. 情報の利用目的</h2>
              <p>収集した情報は、以下の目的で利用します。</p>
              <ol className="list-decimal pl-5 space-y-2 mt-2">
                <li>本サービスの提供・運営・改善</li>
                <li>ユーザーの本人確認・認証</li>
                <li>広告主とアフィリエイターのマッチング</li>
                <li>成果の計測・レポートの生成</li>
                <li>報酬の計算・支払い処理</li>
                <li>ユーザーへの通知・連絡</li>
                <li>利用料金の請求</li>
                <li>不正利用の検知・防止</li>
                <li>サービスに関するお知らせ・マーケティング（オプトアウト可能）</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">3. 情報の第三者提供</h2>
              <p>当社は、以下の場合を除き、ユーザーの同意なく個人情報を第三者に提供しません。</p>
              <ol className="list-decimal pl-5 space-y-2 mt-2">
                <li>法令に基づく場合</li>
                <li>人の生命・身体・財産の保護のために必要な場合</li>
                <li>本サービスの運営に必要な範囲で業務委託先に提供する場合</li>
                <li>マッチングのため、広告主とアフィリエイター間で必要な情報を共有する場合（公開プロフィール情報に限る）</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">4. 外部サービスとの連携</h2>
              <p>本サービスは以下の外部サービスと連携しています。</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>TikTok API</strong>：アカウント認証およびパフォーマンスデータの取得</li>
                <li><strong>Stripe</strong>：決済処理（クレジットカード情報はStripe社が管理）</li>
                <li><strong>Google Analytics</strong>：サービスの利用状況分析</li>
              </ul>
              <p className="mt-2">各サービスの個人情報の取扱いについては、各サービスのプライバシーポリシーをご確認ください。</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">5. Cookieの利用</h2>
              <p>当社は、サービスの利便性向上、利用状況の分析、広告配信のためにCookieを使用します。ブラウザの設定によりCookieを無効にすることが可能ですが、一部の機能が利用できなくなる場合があります。</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">6. 情報の安全管理</h2>
              <p>当社は、個人情報の漏洩・紛失・毀損を防止するため、以下の安全管理措置を講じます。</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>SSL/TLSによる通信の暗号化</li>
                <li>パスワードのハッシュ化</li>
                <li>アクセス権限の適切な管理</li>
                <li>定期的なセキュリティ監査</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">7. ユーザーの権利</h2>
              <p>ユーザーは、以下の権利を有します。</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>自身の個人情報の開示・訂正・削除を請求する権利</li>
                <li>個人情報の利用停止を請求する権利</li>
                <li>マーケティングメールの受信を停止する権利</li>
                <li>アカウントを削除し、関連する個人情報の消去を請求する権利</li>
              </ul>
              <p className="mt-2">上記の請求は、お問い合わせフォームまたはメールにてご連絡ください。</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">8. 保有期間</h2>
              <p>個人情報は、利用目的の達成に必要な期間保有します。アカウント削除後は、法令で定められた期間を除き、速やかに削除します。取引に関するデータは、税務上の要件により最大7年間保持する場合があります。</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">9. 未成年者の利用</h2>
              <p>18歳未満の方が本サービスを利用する場合は、保護者の同意が必要です。</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">10. ポリシーの変更</h2>
              <p>当社は、必要に応じて本プライバシーポリシーを変更することがあります。重要な変更を行う場合は、本サービス上での通知またはメールにてお知らせします。</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">11. お問い合わせ</h2>
              <p>個人情報の取扱いに関するお問い合わせは、以下までご連絡ください。</p>
              <div className="mt-2 p-4 bg-surface rounded-xl">
                <p>TikAfi運営</p>
                <p>メール：privacy@tikafi.jp</p>
              </div>
            </section>

            <section className="border-t border-border pt-6">
              <p className="text-sm text-gray-500">
                制定日：2026年4月7日<br />
                TikAfi運営
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
