import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span className="font-bold text-gray-800">おやつ</span>
            </div>
            <p className="text-sm text-gray-500">
              親に、つながる。親に、届く。
              <br />
              親孝行の、すべてがここに。
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">カテゴリ</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/categories/gift" className="hover:text-orange-600">贈り物</Link></li>
              <li><Link href="/categories/travel" className="hover:text-orange-600">旅行・体験</Link></li>
              <li><Link href="/categories/home" className="hover:text-orange-600">住まい・リフォーム</Link></li>
              <li><Link href="/categories/health" className="hover:text-orange-600">健康・医療</Link></li>
              <li><Link href="/categories/watch" className="hover:text-orange-600">見守り・安心</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">機能</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/recommend" className="hover:text-orange-600">AIおすすめ</Link></li>
              <li><Link href="/letter" className="hover:text-orange-600">手紙ジェネレーター</Link></li>
              <li><Link href="/calendar" className="hover:text-orange-600">親孝行カレンダー</Link></li>
              <li><Link href="/parent-profile" className="hover:text-orange-600">親プロフィール</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">サポート</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><span className="cursor-pointer hover:text-orange-600">お問い合わせ</span></li>
              <li><span className="cursor-pointer hover:text-orange-600">よくある質問</span></li>
              <li><span className="cursor-pointer hover:text-orange-600">配送について</span></li>
              <li><span className="cursor-pointer hover:text-orange-600">返品・交換</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-xs text-gray-400">
          &copy; 2026 おやつ（OyaTsu） All rights reserved.
        </div>
      </div>
    </footer>
  );
}
