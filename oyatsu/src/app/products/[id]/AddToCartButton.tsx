"use client";

import { useState } from "react";
import { ShoppingCart, Gift, MessageSquare, Check, Minus, Plus } from "lucide-react";
import { useCartStore, type CartProduct } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

interface AddToCartButtonProps {
  product: CartProduct;
  inStock: boolean;
}

export default function AddToCartButton({ product, inStock }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [giftWrapping, setGiftWrapping] = useState(true);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 font-medium">数量:</span>
        <div className="flex items-center border border-gray-200 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-gray-50 rounded-l-lg transition-colors"
            aria-label="数量を減らす"
          >
            <Minus className="w-4 h-4 text-gray-500" />
          </button>
          <span className="px-4 py-2 font-medium text-gray-800 min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 hover:bg-gray-50 rounded-r-lg transition-colors"
            aria-label="数量を増やす"
          >
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <span className="text-sm text-gray-500">
          小計: {formatPrice(product.price * quantity)}
        </span>
      </div>

      {/* Gift Wrapping */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={giftWrapping}
          onChange={(e) => setGiftWrapping(e.target.checked)}
          className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
        />
        <Gift className="w-4 h-4 text-orange-400" />
        <span className="text-sm text-gray-700">ギフトラッピングを追加（無料）</span>
      </label>

      {/* Letter Message Toggle */}
      <button
        onClick={() => setShowMessage(!showMessage)}
        className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 transition-colors"
      >
        <MessageSquare className="w-4 h-4" />
        {showMessage ? "メッセージを閉じる" : "メッセージカードを添える"}
      </button>

      {/* Message Input */}
      {showMessage && (
        <div className="space-y-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="お母さん・お父さんへのメッセージを入力してください..."
            className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray-400 text-right">{message.length}/500文字</p>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAdd}
        disabled={!inStock || added}
        className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-200 ${
          added
            ? "bg-green-500 text-white"
            : inStock
            ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {added ? (
          <>
            <Check className="w-5 h-5" />
            カートに追加しました
          </>
        ) : inStock ? (
          <>
            <ShoppingCart className="w-5 h-5" />
            カートに入れる
          </>
        ) : (
          "在庫切れ"
        )}
      </button>
    </div>
  );
}
