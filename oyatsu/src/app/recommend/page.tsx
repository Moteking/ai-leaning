import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, parseTags, parseHobbies } from "@/lib/utils";
import {
  Sparkles,
  Heart,
  UserPlus,
  ShoppingCart,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const DEMO_EMAIL = "demo@oyatsu.jp";

interface ScoredProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string;
  targetAge: string;
  targetGender: string;
  healthNote: string | null;
  isNew: boolean;
  popularity: number;
  category: { name: string; emoji: string };
  reviews: { rating: number }[];
  score: number;
  reasons: string[];
}

function getAgeRange(age: number): string {
  if (age >= 85) return "85+";
  if (age >= 75) return "75-84";
  return "65-74";
}

function computeRecommendations(
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    tags: string;
    targetAge: string;
    targetGender: string;
    healthNote: string | null;
    isNew: boolean;
    popularity: number;
    category: { name: string; emoji: string };
    reviews: { rating: number }[];
  }>,
  parent: {
    relation: string;
    name: string;
    age: number;
    livingAlone: boolean;
    healthStatus: string;
    hobbies: string;
    notes: string | null;
  }
): ScoredProduct[] {
  const parentHobbies = parseHobbies(parent.hobbies);
  const parentAgeRange = getAgeRange(parent.age);
  const genderMatch = parent.relation === "mother" ? "mother" : "father";

  return products
    .map((product) => {
      let score = 0;
      const reasons: string[] = [];
      const productTags = parseTags(product.tags);

      // Gender match: +30 for exact match, +10 for "both"
      if (product.targetGender === genderMatch) {
        score += 30;
        reasons.push(
          `${parent.relation === "mother" ? "お母さん" : "お父さん"}向けの商品です`
        );
      } else if (product.targetGender === "both") {
        score += 10;
      } else {
        // Wrong gender - heavily penalize
        score -= 50;
      }

      // Age match: +25 for exact range
      if (product.targetAge === parentAgeRange) {
        score += 25;
        reasons.push(`${parent.age}歳の年齢層にぴったりです`);
      } else if (product.targetAge === "all") {
        score += 5;
      }

      // Health note match
      if (parent.healthStatus === "needs_care" && product.healthNote) {
        score += 20;
        reasons.push("介護が必要な方に配慮した商品です");
      }
      if (parent.healthStatus === "somewhat" && product.healthNote) {
        score += 15;
        reasons.push("健康面に配慮した商品です");
      }

      // Notes-based matching (simple keyword matching)
      if (parent.notes) {
        const notes = parent.notes.toLowerCase();
        if (product.healthNote) {
          const healthNote = product.healthNote.toLowerCase();
          // Check for keyword overlap
          const keywords = ["膝", "腰", "目", "耳", "血圧", "糖尿"];
          for (const keyword of keywords) {
            if (notes.includes(keyword) && healthNote.includes(keyword)) {
              score += 15;
              reasons.push(`${keyword}に関するお悩みに対応しています`);
              break;
            }
          }
        }
        if (notes.includes("甘いもの") && productTags.includes("スイーツ")) {
          score += 10;
          reasons.push("甘いものがお好きな方におすすめ");
        }
      }

      // Hobby matching: +10 per matching hobby
      if (parentHobbies.length > 0) {
        const hobbyTagMap: Record<string, string[]> = {
          園芸: ["園芸", "ガーデニング", "植物", "花"],
          料理: ["料理", "キッチン", "食", "グルメ"],
          散歩: ["散歩", "ウォーキング", "健康", "靴"],
          釣り: ["釣り", "アウトドア", "レジャー"],
          囲碁: ["囲碁", "将棋", "ゲーム", "趣味"],
          手芸: ["手芸", "クラフト", "手作り"],
          読書: ["読書", "本", "文学", "知的"],
          テレビ: ["テレビ", "映画", "エンタメ", "家電"],
          旅行: ["旅行", "温泉", "観光", "体験"],
          音楽: ["音楽", "コンサート", "楽器", "芸術"],
        };

        for (const hobby of parentHobbies) {
          const relatedTags = hobbyTagMap[hobby] || [hobby];
          const matched = productTags.some((tag) =>
            relatedTags.some((rt) => tag.includes(rt) || rt.includes(tag))
          );
          if (matched) {
            score += 10;
            reasons.push(`趣味の「${hobby}」に関連しています`);
          }
        }
      }

      // Living alone bonus for monitoring/care products
      if (parent.livingAlone) {
        if (
          productTags.some(
            (tag) =>
              tag.includes("見守り") ||
              tag.includes("安心") ||
              tag.includes("サポート")
          )
        ) {
          score += 15;
          reasons.push("一人暮らしの方に安心のサービスです");
        }
      }

      // Popularity bonus
      score += Math.min(product.popularity, 10);

      // New product slight bonus
      if (product.isNew) {
        score += 3;
      }

      return { ...product, score, reasons };
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

export default async function RecommendPage() {
  // Get demo user and their parents
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    include: { parents: true },
  });

  const parents = user?.parents || [];

  // Load all products
  const products = await prisma.product.findMany({
    where: { inStock: true },
    include: {
      category: true,
      reviews: { select: { rating: true } },
    },
  });

  // Compute recommendations for each parent
  const recommendations = parents.map((parent) => ({
    parent,
    products: computeRecommendations(products, parent),
  }));

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <Sparkles className="w-10 h-10 text-orange-500 mx-auto mb-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            AIおすすめ
          </h1>
          <p className="text-gray-600">
            親のプロフィールから、最適な贈り物を提案します
          </p>
        </div>

        {/* No parents registered */}
        {parents.length === 0 && (
          <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
            <Heart className="w-16 h-16 text-orange-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              まずは親のプロフィールを登録しましょう
            </h2>
            <p className="text-gray-600 mb-6">
              親の年齢、趣味、健康状態などを登録すると、
              AIがぴったりの贈り物を見つけます。
            </p>
            <Link
              href="/parent-profile"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              親を登録する
            </Link>
          </div>
        )}

        {/* Recommendations per parent */}
        {recommendations.map(({ parent, products: recommended }) => {
          const hobbies = parseHobbies(parent.hobbies);
          return (
            <div key={parent.id} className="mb-12">
              {/* Parent header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xl font-bold shrink-0">
                  {parent.relation === "mother" ? "母" : "父"}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {parent.name}さんへのおすすめ
                  </h2>
                  <p className="text-sm text-gray-500">
                    {parent.age}歳 / {parent.region}
                    {hobbies.length > 0 && ` / 趣味: ${hobbies.join("、")}`}
                  </p>
                </div>
              </div>

              {recommended.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                  <p className="text-gray-500">
                    おすすめの商品が見つかりませんでした。商品が追加されるまでお待ちください。
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {recommended.map((product) => {
                    const avgRating =
                      product.reviews.length > 0
                        ? product.reviews.reduce((s, r) => s + r.rating, 0) /
                          product.reviews.length
                        : null;

                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
                      >
                        {/* Image area */}
                        <Link href={`/products/${product.id}`}>
                          <div className="relative aspect-[4/3] bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                            <span className="text-4xl">
                              {product.category.emoji}
                            </span>
                            {product.isNew && (
                              <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> NEW
                              </span>
                            )}
                          </div>
                        </Link>

                        <div className="p-4">
                          <p className="text-xs text-orange-500 font-medium mb-1">
                            {product.category.name}
                          </p>
                          <Link href={`/products/${product.id}`}>
                            <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                            {product.description}
                          </p>

                          {/* Rating */}
                          {avgRating && (
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs text-gray-600">
                                {avgRating.toFixed(1)} ({product.reviews.length}
                                件)
                              </span>
                            </div>
                          )}

                          {/* Price */}
                          <p className="font-bold text-lg text-gray-800 mb-3">
                            {formatPrice(product.price)}
                          </p>

                          {/* Why we recommend */}
                          <div className="bg-orange-50 rounded-xl p-3 mb-3">
                            <p className="text-xs font-semibold text-orange-700 mb-1.5 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              おすすめの理由
                            </p>
                            <ul className="space-y-1">
                              {product.reasons.slice(0, 3).map((reason, i) => (
                                <li
                                  key={i}
                                  className="text-xs text-orange-600 flex items-start gap-1"
                                >
                                  <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Link
                              href={`/products/${product.id}`}
                              className="flex-1 text-center text-sm py-2 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              詳細を見る
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Edit profile CTA */}
        {parents.length > 0 && (
          <div className="text-center mt-8 pb-8">
            <Link
              href="/parent-profile"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              親のプロフィールを編集する
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
