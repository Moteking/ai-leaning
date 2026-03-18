"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import Link from "next/link";
import {
  Pen,
  Heart,
  Copy,
  ShoppingCart,
  Sparkles,
  ArrowLeft,
  Check,
  User,
  Calendar,
} from "lucide-react";

type Recipient = "mother" | "father" | "both";
type Occasion = "birthday" | "mothers_day" | "fathers_day" | "respect_day" | "none";

const recipientOptions: { value: Recipient; label: string }[] = [
  { value: "mother", label: "お母さん" },
  { value: "father", label: "お父さん" },
  { value: "both", label: "両親" },
];

const occasionOptions: { value: Occasion; label: string }[] = [
  { value: "birthday", label: "誕生日" },
  { value: "mothers_day", label: "母の日" },
  { value: "fathers_day", label: "父の日" },
  { value: "respect_day", label: "敬老の日" },
  { value: "none", label: "特になし" },
];

export default function LetterPage() {
  const { items, updateMessage } = useCartStore();
  const [feelings, setFeelings] = useState("");
  const [recipient, setRecipient] = useState<Recipient>("mother");
  const [occasion, setOccasion] = useState<Occasion>("none");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [appliedToCart, setAppliedToCart] = useState(false);

  const handleGenerate = async () => {
    if (!feelings.trim()) return;

    setIsGenerating(true);
    setGeneratedLetter("");

    try {
      const res = await fetch("/api/letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feelings, recipient, occasion }),
      });

      if (!res.ok) throw new Error("生成に失敗しました");

      const data = await res.json();
      setGeneratedLetter(data.letter);
    } catch {
      setGeneratedLetter(
        "申し訳ございません。手紙の生成中にエラーが発生しました。もう一度お試しください。"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseInCart = () => {
    items.forEach((entry) => {
      updateMessage(entry.product.id, generatedLetter);
    });
    setAppliedToCart(true);
    setTimeout(() => setAppliedToCart(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/checkout"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        チェックアウトに戻る
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <Pen className="w-7 h-7 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-800">
          手紙ジェネレーター
        </h1>
      </div>
      <p className="text-gray-500 mb-8">
        あなたの気持ちを伝える手紙を作成しましょう。
        想いを入力するだけで、心のこもった手紙が完成します。
      </p>

      <div className="space-y-6">
        {/* Input Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="space-y-5">
            {/* Feelings Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-orange-500" />
                あなたの気持ち・伝えたいこと
              </label>
              <textarea
                value={feelings}
                onChange={(e) => setFeelings(e.target.value)}
                placeholder="例：最近帰省できてなくて申し訳ない、いつも心配してくれてありがとう、体に気をつけてほしい..."
                className="w-full border border-gray-200 rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                rows={4}
              />
            </div>

            {/* Selectors Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-orange-500" />
                  誰に宛てますか？
                </label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value as Recipient)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 bg-white"
                >
                  {recipientOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  お送りするきっかけ
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value as Occasion)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 bg-white"
                >
                  {occasionOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !feelings.trim()}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  手紙を作成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  手紙を生成する
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Letter Display */}
        {generatedLetter && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              <Pen className="w-5 h-5 text-orange-500" />
              生成された手紙
            </h2>

            {/* Handwritten-style Card */}
            <div className="relative bg-amber-50 border border-amber-200 rounded-xl p-8 shadow-sm">
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-300 via-red-300 to-orange-300 rounded-t-xl" />

              <div
                className="whitespace-pre-wrap leading-relaxed text-gray-700"
                style={{
                  fontFamily:
                    '"Hiragino Mincho ProN", "Yu Mincho", "MS Mincho", serif',
                  fontSize: "15px",
                  lineHeight: "2",
                }}
              >
                {generatedLetter}
              </div>

              {/* Decorative bottom */}
              <div className="mt-6 flex justify-end">
                <Heart className="w-4 h-4 text-red-300" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    コピーしました！
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    テキストをコピー
                  </>
                )}
              </button>

              {items.length > 0 && (
                <button
                  onClick={handleUseInCart}
                  className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  {appliedToCart ? (
                    <>
                      <Check className="w-4 h-4" />
                      カートに反映しました！
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      カートのメッセージに使う
                    </>
                  )}
                </button>
              )}
            </div>

            {items.length === 0 && (
              <p className="text-sm text-gray-400 text-center">
                カートに商品を追加すると、この手紙をメッセージとして添えられます。
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
