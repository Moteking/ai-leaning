import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-xl text-white">
                Tik<span className="text-primary">Afi</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              TikTokアフィリエイトに特化した
              <br />
              マッチングプラットフォーム
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">サービス</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  機能紹介
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  料金プラン
                </a>
              </li>
              <li>
                <Link href="/dashboard/advertiser" className="hover:text-white transition-colors">
                  広告主ダッシュボード
                </Link>
              </li>
              <li>
                <Link href="/dashboard/affiliate" className="hover:text-white transition-colors">
                  アフィリエイターダッシュボード
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">サポート</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  よくある質問
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  お問い合わせ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  活用事例
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  コラム
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">会社情報</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  運営会社
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  利用規約
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  プライバシーポリシー
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  特定商取引法に基づく表記
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2026 TikAfi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
