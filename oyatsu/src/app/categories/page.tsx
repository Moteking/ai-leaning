import Link from "next/link";
import { prisma } from "@/lib/db";
import { Sparkles, ArrowRight, Package } from "lucide-react";

export const metadata = {
  title: "カテゴリ一覧 | おやつ（OyaTsu）",
  description: "親孝行のためのカテゴリ一覧。ギフト、旅行、リフォーム、見守り、終活まで。",
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-3">
            <Package className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            カテゴリから探す
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            親孝行のジャンルごとに、最適なサービス・商品をお探しいただけます。
          </p>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 text-center">
                <span className="text-5xl block mb-3">{cat.emoji}</span>
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {cat.name}
                </h2>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {cat.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {cat._count.products}件の商品
                  </span>
                  <span className="text-orange-500 group-hover:text-orange-600 flex items-center gap-1 text-sm font-medium">
                    詳しく見る
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* AI Recommend Card */}
          <Link
            href="/recommend"
            className="group bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            <div className="p-8 text-center">
              <span className="text-5xl block mb-3">
                <Sparkles className="w-12 h-12 text-white mx-auto" />
              </span>
              <h2 className="text-xl font-bold text-white">
                AIおすすめ
              </h2>
            </div>
            <div className="px-5 pb-5">
              <p className="text-sm text-orange-100 mb-4 leading-relaxed">
                親の年齢、健康状態、趣味などの情報をもとに、AIがぴったりの親孝行を提案します。何を選べばいいか迷ったらこちら。
              </p>
              <div className="flex items-center justify-end">
                <span className="text-white flex items-center gap-1 text-sm font-medium">
                  AIに相談する
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
