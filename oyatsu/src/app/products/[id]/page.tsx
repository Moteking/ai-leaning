import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, parseTags, getTargetAgeLabel, getGenderLabel } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "./AddToCartButton";
import {
  ArrowLeft,
  Star,
  Heart,
  Shield,
  Truck,
  Gift,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { title: "商品が見つかりません" };
  return {
    title: `${product.name} | おやつ（OyaTsu）`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  const tagList = parseTags(product.tags);

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) /
        product.reviews.length
      : null;

  // Related products from same category (excluding current)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    orderBy: { popularity: "desc" },
    take: 4,
    include: {
      category: true,
      reviews: true,
    },
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-orange-500">
              トップ
            </Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-orange-500">
              カテゴリ
            </Link>
            <span>/</span>
            <Link
              href={`/categories/${product.category.slug}`}
              className="hover:text-orange-500"
            >
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-800 truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Main */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl aspect-square flex items-center justify-center relative">
            <span className="text-8xl">{product.category.emoji}</span>
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-orange-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> NEW
              </span>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                <span className="bg-white text-gray-800 font-bold px-6 py-3 rounded-full">
                  在庫切れ
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <Link
              href={`/categories/${product.category.slug}`}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              {product.category.emoji} {product.category.name}
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2 mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            {avgRating !== null && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(avgRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {avgRating.toFixed(1)} ({product.reviews.length}件のレビュー)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-800">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500 ml-2">（税込）</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.longDescription || product.description}
            </p>

            {/* Health Note */}
            {product.healthNote && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-800 mb-1">
                      健康への配慮
                    </p>
                    <p className="text-sm text-green-700">{product.healthNote}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tagList.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-orange-50 text-orange-600 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Target Info */}
            <div className="flex flex-wrap gap-3 mb-6 text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {getGenderLabel(product.targetGender)}
              </span>
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {getTargetAgeLabel(product.targetAge)}
              </span>
            </div>

            {/* Add to Cart */}
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                categoryName: product.category.name,
              }}
              inStock={product.inStock}
            />

            {/* Perks */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Gift className="w-4 h-4 text-orange-400" />
                ギフトラッピング対応
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4 text-orange-400" />
                送料無料
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Heart className="w-4 h-4 text-orange-400" />
                メッセージカード付き
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-orange-400" />
                安心の品質保証
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-orange-500">💬</span>
            レビュー
            {product.reviews.length > 0 && (
              <span className="text-base font-normal text-gray-500">
                ({product.reviews.length}件)
              </span>
            )}
          </h2>

          {product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {review.author}
                          {review.age && (
                            <span className="text-sm text-gray-400 ml-1">
                              ({review.age}歳)
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-10 border border-gray-100 text-center">
              <p className="text-gray-400">
                まだレビューがありません。購入後にぜひ感想をお聞かせください。
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-orange-500">🔗</span>
            関連する商品
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((rp) => {
              const rpAvg =
                rp.reviews.length > 0
                  ? rp.reviews.reduce((s, r) => s + r.rating, 0) /
                    rp.reviews.length
                  : undefined;
              return (
                <ProductCard
                  key={rp.id}
                  id={rp.id}
                  name={rp.name}
                  description={rp.description}
                  price={rp.price}
                  image={rp.image}
                  tags={rp.tags}
                  isNew={rp.isNew}
                  categoryName={rp.category.name}
                  rating={rpAvg}
                  reviewCount={rp.reviews.length}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Back Link */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <Link
          href={`/categories/${product.category.slug}`}
          className="inline-flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600"
        >
          <ArrowLeft className="w-4 h-4" />
          {product.category.name}の商品一覧に戻る
        </Link>
      </div>
    </div>
  );
}
