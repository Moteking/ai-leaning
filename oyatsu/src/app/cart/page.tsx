"use client";

import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Package,
} from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, updateMessage, totalAmount, totalItems } =
    useCartStore();
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  const toggleMessage = (productId: string) => {
    setExpandedMessages((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-orange-300" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            カートは空です
          </h1>
          <p className="text-gray-500 max-w-md">
            親御さんへの素敵なギフトを探してみませんか？
            カテゴリーから商品をお選びください。
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            カテゴリーを見る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-7 h-7 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-800">
          ショッピングカート
        </h1>
        <span className="bg-orange-100 text-orange-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {totalItems()}点
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((entry) => (
            <div
              key={entry.product.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={entry.product.image}
                    alt={entry.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-orange-500 font-medium mb-0.5">
                        {entry.product.categoryName}
                      </p>
                      <h3 className="font-semibold text-gray-800 truncate">
                        {entry.product.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => removeItem(entry.product.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      aria-label="削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateQuantity(entry.product.id, entry.quantity - 1)
                        }
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label="数量を減らす"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-medium text-gray-700">
                        {entry.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(entry.product.id, entry.quantity + 1)
                        }
                        className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label="数量を増やす"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <p className="font-bold text-gray-800">
                      {formatPrice(entry.product.price * entry.quantity)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Toggle & Field */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => toggleMessage(entry.product.id)}
                  className="flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {expandedMessages.has(entry.product.id)
                    ? "メッセージを閉じる"
                    : entry.message
                      ? "メッセージを編集する"
                      : "親御さんへメッセージを添える"}
                </button>
                {expandedMessages.has(entry.product.id) && (
                  <div className="mt-2">
                    <textarea
                      value={entry.message || ""}
                      onChange={(e) =>
                        updateMessage(entry.product.id, e.target.value)
                      }
                      placeholder="例：お母さん、いつもありがとう。体に気をつけてね。"
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                      rows={3}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      ギフトに手書き風メッセージカードを同封します
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm sticky top-24">
            <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-500" />
              注文サマリー
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>商品小計（{totalItems()}点）</span>
                <span>{formatPrice(totalAmount())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>送料</span>
                <span className="text-green-600 font-medium">無料</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>ギフトラッピング</span>
                <span className="text-green-600 font-medium">無料</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-gray-800">
                <span>合計</span>
                <span className="text-orange-600">
                  {formatPrice(totalAmount())}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              レジに進む
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/categories"
              className="mt-3 w-full border border-gray-300 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              買い物を続ける
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
