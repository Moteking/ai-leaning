"use client";

import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  CreditCard,
  Gift,
  Mail,
  MapPin,
  Phone,
  User,
  CheckCircle,
  Lock,
  ShoppingBag,
  ArrowLeft,
  Pen,
} from "lucide-react";

export default function CheckoutPage() {
  const { items, totalAmount, totalItems, clearCart } = useCartStore();

  const [form, setForm] = useState({
    recipientName: "",
    address: "",
    phone: "",
  });
  const [giftWrapping, setGiftWrapping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.recipientName.trim()) {
      newErrors.recipientName = "お届け先のお名前を入力してください";
    }
    if (!form.address.trim()) {
      newErrors.address = "住所を入力してください";
    }
    if (!form.phone.trim()) {
      newErrors.phone = "電話番号を入力してください";
    } else if (!/^[\d-]+$/.test(form.phone.trim())) {
      newErrors.phone = "有効な電話番号を入力してください";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearCart();
    setIsSubmitting(false);
    setOrderComplete(true);
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            ご注文ありがとうございます！
          </h1>
          <p className="text-gray-500 max-w-md">
            ご注文を受け付けました。親御さんへの素敵な贈り物を、
            心を込めてお届けいたします。
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-sm text-orange-700 max-w-sm">
            <p className="font-medium mb-1">注文確認メール</p>
            <p>ご登録のメールアドレスに確認メールをお送りしました。</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-6">
          <ShoppingBag className="w-12 h-12 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-800">
            カートが空です
          </h1>
          <p className="text-gray-500">
            チェックアウトするにはカートに商品を追加してください。
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            商品を探す
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <CreditCard className="w-7 h-7 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-800">お支払い</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Shipping Info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                お届け先情報
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      お届け先のお名前
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.recipientName}
                    onChange={(e) =>
                      setForm({ ...form, recipientName: e.target.value })
                    }
                    placeholder="例：山田 花子"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 ${
                      errors.recipientName
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  {errors.recipientName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.recipientName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      住所
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder="例：東京都渋谷区神宮前1-2-3"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 ${
                      errors.address
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      電話番号
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="例：090-1234-5678"
                    className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 ${
                      errors.phone
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Gift Wrapping & Letter */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-orange-500" />
                ギフトオプション
              </h2>

              <div className="space-y-4">
                {/* Gift Wrapping Toggle */}
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        ギフトラッピング
                      </p>
                      <p className="text-xs text-gray-500">
                        心を込めた包装でお届けします（無料）
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGiftWrapping(!giftWrapping)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      giftWrapping ? "bg-orange-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        giftWrapping ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Write a Letter Link */}
                <Link
                  href="/letter"
                  className="flex items-center justify-between p-3 border border-dashed border-orange-300 rounded-lg hover:bg-orange-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Pen className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        手紙を書く
                      </p>
                      <p className="text-xs text-gray-500">
                        AIが親御さんへの手紙作成をお手伝いします
                      </p>
                    </div>
                  </div>
                  <Mail className="w-4 h-4 text-orange-400 group-hover:text-orange-500 transition-colors" />
                </Link>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                お支払い方法
              </h2>

              {/* Stripe-like Card UI Mockup */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    カード番号
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4242 4242 4242 4242"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 pr-12"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-[6px] flex items-center justify-center font-bold">
                        VISA
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      有効期限
                    </label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      セキュリティコード
                    </label>
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Lock className="w-3 h-3" />
                  <span>
                    お支払い情報はSSL暗号化で安全に保護されています
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm sticky top-24">
              <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                注文内容（{totalItems()}点）
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {items.map((entry) => (
                  <div
                    key={entry.product.id}
                    className="flex gap-3 pb-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={entry.product.image}
                        alt={entry.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {entry.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        数量: {entry.quantity}
                      </p>
                      {entry.message && (
                        <p className="text-xs text-orange-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          メッセージ付き
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
                      {formatPrice(entry.product.price * entry.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>商品小計</span>
                  <span>{formatPrice(totalAmount())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>送料</span>
                  <span className="text-green-600">無料</span>
                </div>
                {giftWrapping && (
                  <div className="flex justify-between text-gray-600">
                    <span>ギフトラッピング</span>
                    <span className="text-green-600">無料</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg text-gray-800">
                  <span>合計</span>
                  <span className="text-orange-600">
                    {formatPrice(totalAmount())}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    処理中...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    注文を確定する
                  </>
                )}
              </button>

              <Link
                href="/cart"
                className="mt-3 w-full border border-gray-300 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                カートに戻る
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
