import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; gender?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "カテゴリが見つかりません" };
  return {
    title: `${category.name} | おやつ（OyaTsu）`,
    description: category.description,
  };
}

export default async function CategoryDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { sort = "popularity", gender } = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) notFound();

  // Build product query
  const where: Record<string, unknown> = { categoryId: category.id };
  if (gender && ["mother", "father", "both"].includes(gender)) {
    where.targetGender = gender;
  }

  // Determine sort order
  let orderBy: Record<string, string>;
  switch (sort) {
    case "price_asc":
      orderBy = { price: "asc" };
      break;
    case "price_desc":
      orderBy = { price: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "popularity":
    default:
      orderBy = { popularity: "desc" };
      break;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      reviews: true,
    },
  });

  const sortOptions = [
    { value: "popularity", label: "人気順" },
    { value: "price_asc", label: "価格が安い順" },
    { value: "price_desc", label: "価格が高い順" },
    { value: "newest", label: "新着順" },
  ];

  const genderOptions = [
    { value: "", label: "すべて" },
    { value: "mother", label: "お母さん向け" },
    { value: "father", label: "お父さん向け" },
    { value: "both", label: "両親向け" },
  ];

  function buildUrl(newSort?: string, newGender?: string) {
    const s = newSort ?? sort;
    const g = newGender ?? gender ?? "";
    const params = new URLSearchParams();
    if (s && s !== "popularity") params.set("sort", s);
    if (g) params.set("gender", g);
    const qs = params.toString();
    return `/categories/${slug}${qs ? `?${qs}` : ""}`;
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            カテゴリ一覧
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{category.emoji}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {category.name}
              </h1>
              <p className="text-gray-600 mt-1">{category.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Sort */}
      <section className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">並び替え:</span>
              <div className="flex gap-1">
                {sortOptions.map((opt) => (
                  <Link
                    key={opt.value}
                    href={buildUrl(opt.value, gender)}
                    className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                      sort === opt.value
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-500">対象:</span>
              <div className="flex gap-1">
                {genderOptions.map((opt) => (
                  <Link
                    key={opt.value}
                    href={buildUrl(sort, opt.value)}
                    className={`text-sm px-3 py-1.5 rounded-full transition-colors ${
                      (gender ?? "") === opt.value
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-sm text-gray-500 mb-6">
          {products.length}件の商品が見つかりました
        </p>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product) => {
              const avgRating =
                product.reviews.length > 0
                  ? product.reviews.reduce((s, r) => s + r.rating, 0) /
                    product.reviews.length
                  : undefined;
              return (
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
                  rating={avgRating}
                  reviewCount={product.reviews.length}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-2">
              該当する商品が見つかりませんでした
            </p>
            <Link
              href={`/categories/${slug}`}
              className="text-orange-500 hover:text-orange-600 text-sm"
            >
              フィルターをリセット
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
