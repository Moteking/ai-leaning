import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { Star, ArrowRight, Heart, Gift, Calendar, Sparkles } from "lucide-react";

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const popularProducts = await prisma.product.findMany({
    orderBy: { popularity: "desc" },
    take: 5,
    include: {
      category: true,
      reviews: true,
    },
  });

  const newProducts = await prisma.product.findMany({
    where: { isNew: true },
    take: 4,
    include: { category: true, reviews: true },
  });

  const recentReviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { product: true },
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 text-orange-500 fill-orange-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            親に、つながる。親に、届く。
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            ギフト、旅行、リフォーム、見守り、終活まで。
            <br />
            <strong>親孝行の、すべてがここに。</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/recommend"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              AIに相談する
            </Link>
            <Link
              href="/categories"
              className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-full font-semibold border border-gray-200 transition-colors"
            >
              カテゴリから探す
            </Link>
          </div>
        </div>
      </section>

      {/* Event Banner */}
      <section className="bg-pink-50 py-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Link
            href="/categories/gift"
            className="flex items-center justify-center gap-2 text-pink-700 hover:text-pink-800"
          >
            <Calendar className="w-5 h-5" />
            <span className="font-semibold">もうすぐ母の日（5月11日）</span>
            <span className="text-sm">母の日特集を見る</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Popular Ranking */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-orange-500">🏆</span> 人気ランキング
          </h2>
          <Link
            href="/categories"
            className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"
          >
            すべて見る <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {popularProducts.map((product, i) => {
            const avgRating =
              product.reviews.length > 0
                ? product.reviews.reduce((s, r) => s + r.rating, 0) /
                  product.reviews.length
                : undefined;
            return (
              <div key={product.id} className="relative">
                {i < 3 && (
                  <div className="absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {i + 1}
                  </div>
                )}
                <ProductCard
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  image={product.image}
                  tags={product.tags}
                  isNew={product.isNew}
                  categoryName={product.category.name}
                  rating={avgRating}
                  reviewCount={product.reviews.length}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-orange-500">📦</span> カテゴリから探す
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="bg-white rounded-xl p-5 border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all text-center group"
              >
                <span className="text-3xl block mb-2">{cat.emoji}</span>
                <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </Link>
            ))}
            <Link
              href="/recommend"
              className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-5 hover:shadow-md transition-all text-center group"
            >
              <span className="text-3xl block mb-2">🎯</span>
              <h3 className="font-semibold text-white">AIおすすめ</h3>
              <p className="text-xs text-orange-100 mt-1">
                親の情報から最適な贈り物を提案
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-orange-500" /> 新着商品
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
                tags={product.tags}
                isNew={product.isNew}
                categoryName={product.category.name}
              />
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="bg-orange-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-orange-500">💬</span> 贈った人の声
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-orange-100"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  「{review.comment}」
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    — {review.author}
                  </span>
                  <Link
                    href={`/products/${review.productId}`}
                    className="text-xs text-orange-500 hover:text-orange-600"
                  >
                    {review.product.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          親孝行、始めませんか？
        </h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          親のプロフィールを登録するだけで、AIがぴったりの贈り物を見つけます。
        </p>
        <Link
          href="/parent-profile"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors"
        >
          <Gift className="w-6 h-6" />
          親のプロフィールを登録する
        </Link>
      </section>
    </div>
  );
}
