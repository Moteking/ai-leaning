import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "利用規約 - TikAfi",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">利用規約</h1>
          <p className="text-sm text-gray-500 mb-10">最終更新日：2026年4月7日</p>

          <div className="prose prose-sm max-w-none space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">第1条（適用）</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>本規約は、TikAfi運営（以下「当社」といいます）が提供するTikTokアフィリエイトマッチングプラットフォーム「TikAfi」（以下「本サービス」といいます）の利用に関する条件を定めるものです。</li>
                <li>本サービスを利用するすべてのユーザー（以下「ユーザー」といいます）は、本規約に同意したものとみなします。</li>
                <li>当社が本サービス上で別途定める個別規約は、本規約の一部を構成します。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">第2条（定義）</h2>
              <p>本規約において、以下の用語は以下の意味を有します。</p>
              <ol className="list-decimal pl-5 space-y-2 mt-2">
                <li>「広告主」とは、本サービスを通じて商品・サービスのプロモーションを依頼する法人または個人をいいます。</li>
                <li>「アフィリエイター」とは、本サービスを通じてTikTok上でプロモーションコンテンツを制作・投稿する個人をいいます。</li>
                <li>「キャンペーン」とは、広告主がアフィリエイターに対して依頼するプロモーション案件をいいます。</li>
                <li>「成約」とは、アフィリエイターの投稿を経由して発生した、広告主が設定した成果条件を満たす取引をいいます。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">第3条（アカウント登録）</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>本サービスの利用にはアカウント登録が必要です。</li>
                <li>ユーザーは、登録情報が正確かつ最新であることを保証するものとします。</li>
                <li>当社は、以下の場合にアカウント登録を拒否または取り消すことができます。
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>虚偽の情報を登録した場合</li>
                    <li>過去に本規約違反によりアカウントを停止された場合</li>
                    <li>その他、当社が不適切と判断した場合</li>
                  </ul>
                </li>
                <li>アカウントの管理責任はユーザーに帰属します。第三者による不正利用について、当社は一切の責任を負いません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">第4条（サービス内容）</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>当社は、広告主とアフィリエイターのマッチング、キャンペーン管理、成果計測、報酬の収納代行等のサービスを提供します。</li>
                <li>当社は、本サービスの内容を予告なく変更・追加・廃止することができます。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">第5条（料金および支払い）</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>広告主は、当社が定める月額利用料および成約手数料を支払うものとします。</li>
                <li>料金は、当社が別途定める料金表に従います。</li>
                <li>広告主は、アフィリエイターへの報酬を含む金額を当社に支払い、当社がアフィリエイターへ報酬を支払う収納代行方式を採用します。</li>
                <li>アフィリエイターへの報酬は、成果確定後の翌月末に、当社からアフィリエイターの指定口座へ振り込むものとします。最低振込額は5,000円とし、未満の場合は翌月以降に繰り越します。</li>
                <li>振込手数料はアフィリエイターの負担とします。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">第6条（コンテンツに関する義務）</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>アフィリエイターは、投稿するコンテンツにおいて、景品表示法その他の法令を遵守するものとします。</li>
                <li>アフィリエイターは、広告・PRであることを明示するため、指定されたハッシュタグ（#PR等）を必ず付与するものとします。</li>
                <li>以下のコンテンツの投稿を禁止します。
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>虚偽または誇大な表現を含むもの</li>
                    <li>第三者の権利を侵害するもの</li>
                    <li>法令または公序良俗に反するもの</li>
                    <li>TikTokの利用規約に違反するもの</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">第7条（禁止事項）</h2>
              <p>ユーザーは、以下の行為を行ってはなりません。</p>
              <ol className="list-decimal pl-5 space-y-2 mt-2">
                <li>虚偽の情報を登録・提供する行為</li>
                <li>不正なクリック・成約を発生させる行為</li>
                <li>本サービスの運営を妨害する行為</li>
                <li>他のユーザーの個人情報を不正に取得・利用する行為</li>
                <li>本サービスを介さずに直接取引を行う行為</li>
                <li>その他、当社が不適切と判断する行為</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">第8条（知的財産権）</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>本サービスに関する知的財産権は、当社または正当な権利者に帰属します。</li>
                <li>アフィリエイターが制作したコンテンツの著作権はアフィリエイターに帰属しますが、広告主および当社に対し、プロモーション目的での利用を許諾するものとします。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">第9条（免責事項）</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>当社は、本サービスの完全性、正確性、有用性等について保証しません。</li>
                <li>当社は、ユーザー間の取引に関して一切の責任を負いません。</li>
                <li>当社は、天災、システム障害等の不可抗力による損害について責任を負いません。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">第10条（サービスの中断・終了）</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>当社は、メンテナンス、障害対応等の理由により、事前の通知なく本サービスを中断することがあります。</li>
                <li>当社は、30日前の通知をもって本サービスを終了することができます。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">第11条（規約の変更）</h2>
              <p>当社は、ユーザーへの通知をもって本規約を変更することができます。変更後の規約は、本サービス上に掲載した時点で効力を生じます。</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">第12条（準拠法・管轄裁判所）</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>本規約は日本法を準拠法とします。</li>
                <li>本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
              </ol>
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
