"use client";

import Link from "next/link";
import { ShoppingCart, Star, Sparkles } from "lucide-react";
import { formatPrice, parseTags } from "@/lib/utils";
import { useCartStore, type CartProduct } from "@/lib/cart-store";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string;
  isNew: boolean;
  categoryName: string;
  rating?: number;
  reviewCount?: number;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  image,
  tags,
  isNew,
  categoryName,
  rating,
  reviewCount,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const tagList = parseTags(tags);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const product: CartProduct = { id, name, price, image, categoryName };
    addItem(product);
  };

  return (
    <Link href={`/products/${id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <span className="text-4xl">
            {categoryName === "贈り物" && "🎁"}
            {categoryName === "旅行・体験" && "✈️"}
            {categoryName === "住まい・リフォーム" && "🏠"}
            {categoryName === "食事・日常サポート" && "🍽️"}
            {categoryName === "健康・医療" && "💊"}
            {categoryName === "見守り・安心" && "👁️"}
            {categoryName === "終活・将来の備え" && "📋"}
          </span>
          {isNew && (
            <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> NEW
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <p className="text-xs text-orange-500 font-medium mb-1">{categoryName}</p>
          <h3 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {name}
          </h3>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {tagList.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-gray-600">
                {rating.toFixed(1)}
                {reviewCount && ` (${reviewCount}件)`}
              </span>
            </div>
          )}

          {/* Price + Cart */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
            <span className="font-bold text-lg text-gray-800">
              {formatPrice(price)}
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors"
              title="カートに入れる"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
