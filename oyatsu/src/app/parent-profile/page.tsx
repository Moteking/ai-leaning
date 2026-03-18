"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  User,
  MapPin,
  Cake,
  Activity,
  Home,
  FileText,
  ChevronDown,
  Check,
  Plus,
  Loader2,
} from "lucide-react";

const HOBBIES = [
  "園芸",
  "料理",
  "散歩",
  "釣り",
  "囲碁",
  "手芸",
  "読書",
  "テレビ",
  "旅行",
  "音楽",
];

const PREFECTURES = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

const HEALTH_OPTIONS = [
  { value: "healthy", label: "元気" },
  { value: "somewhat", label: "少し心配" },
  { value: "needs_care", label: "介護が必要" },
];

interface ParentForm {
  relation: "mother" | "father";
  name: string;
  age: string;
  livingAlone: boolean;
  healthStatus: string;
  hobbies: string[];
  region: string;
  birthday: string;
  notes: string;
}

const emptyForm = (relation: "mother" | "father"): ParentForm => ({
  relation,
  name: "",
  age: "",
  livingAlone: false,
  healthStatus: "healthy",
  hobbies: [],
  region: "",
  birthday: "",
  notes: "",
});

interface ExistingParent {
  id: string;
  relation: string;
  name: string;
  age: number;
  livingAlone: boolean;
  healthStatus: string;
  hobbies: string;
  region: string;
  birthday: string | null;
  notes: string | null;
}

export default function ParentProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"mother" | "father">("mother");
  const [forms, setForms] = useState<Record<string, ParentForm>>({
    mother: emptyForm("mother"),
    father: emptyForm("father"),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingParents, setExistingParents] = useState<ExistingParent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/parent-profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.parents && data.parents.length > 0) {
          setExistingParents(data.parents);
          const newForms = { ...forms };
          data.parents.forEach((p: ExistingParent) => {
            const rel = p.relation as "mother" | "father";
            let hobbies: string[] = [];
            try {
              hobbies = JSON.parse(p.hobbies);
            } catch {
              hobbies = [];
            }
            newForms[rel] = {
              relation: rel,
              name: p.name,
              age: String(p.age),
              livingAlone: p.livingAlone,
              healthStatus: p.healthStatus,
              hobbies,
              region: p.region,
              birthday: p.birthday || "",
              notes: p.notes || "",
            };
          });
          setForms(newForms);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentForm = forms[activeTab];

  const updateField = (field: keyof ParentForm, value: unknown) => {
    setForms((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [field]: value },
    }));
  };

  const toggleHobby = (hobby: string) => {
    const current = currentForm.hobbies;
    if (current.includes(hobby)) {
      updateField(
        "hobbies",
        current.filter((h) => h !== hobby)
      );
    } else {
      updateField("hobbies", [...current, hobby]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/parent-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentForm,
          age: Number(currentForm.age),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "保存に失敗しました");
        return;
      }

      setSuccess(
        data.updated
          ? `${activeTab === "mother" ? "お母さん" : "お父さん"}の情報を更新しました`
          : `${activeTab === "mother" ? "お母さん" : "お父さん"}の情報を登録しました`
      );

      // Redirect to recommend after a brief delay
      setTimeout(() => {
        router.push("/recommend");
      }, 1500);
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  const isExisting = (relation: string) =>
    existingParents.some((p) => p.relation === relation);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Heart className="w-10 h-10 text-orange-500 mx-auto mb-3 fill-orange-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            親のプロフィール登録
          </h1>
          <p className="text-gray-600">
            親の情報を登録すると、AIがぴったりの贈り物を提案します
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["mother", "father"] as const).map((rel) => (
            <button
              key={rel}
              onClick={() => setActiveTab(rel)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === rel
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-200"
              }`}
            >
              {rel === "mother" ? "お母さん" : "お父さん"}
              {isExisting(rel) && (
                <Check className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6"
        >
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 text-orange-500" />
              お名前
              <span className="text-red-400 text-xs">*必須</span>
            </label>
            <input
              type="text"
              value={currentForm.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder={activeTab === "mother" ? "例: 花子" : "例: 太郎"}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
              required
            />
          </div>

          {/* Age */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Cake className="w-4 h-4 text-orange-500" />
              年齢
              <span className="text-red-400 text-xs">*必須</span>
            </label>
            <input
              type="number"
              value={currentForm.age}
              onChange={(e) => updateField("age", e.target.value)}
              placeholder="例: 72"
              min={40}
              max={120}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
              required
            />
          </div>

          {/* Living Alone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Home className="w-4 h-4 text-orange-500" />
              一人暮らし
            </label>
            <button
              type="button"
              onClick={() => updateField("livingAlone", !currentForm.livingAlone)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                currentForm.livingAlone ? "bg-orange-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  currentForm.livingAlone ? "translate-x-7" : ""
                }`}
              />
            </button>
            <p className="text-xs text-gray-500 mt-1">
              {currentForm.livingAlone
                ? "はい、一人暮らしです"
                : "いいえ、同居しています"}
            </p>
          </div>

          {/* Health Status */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Activity className="w-4 h-4 text-orange-500" />
              健康状態
              <span className="text-red-400 text-xs">*必須</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {HEALTH_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateField("healthStatus", opt.value)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all border ${
                    currentForm.healthStatus === opt.value
                      ? "bg-orange-50 border-orange-300 text-orange-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hobbies */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Heart className="w-4 h-4 text-orange-500" />
              趣味・興味
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {HOBBIES.map((hobby) => {
                const selected = currentForm.hobbies.includes(hobby);
                return (
                  <button
                    key={hobby}
                    type="button"
                    onClick={() => toggleHobby(hobby)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 ${
                      selected
                        ? "bg-orange-50 border-orange-300 text-orange-700"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5" />}
                    {hobby}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              お住まいの地域
              <span className="text-red-400 text-xs">*必須</span>
            </label>
            <div className="relative">
              <select
                value={currentForm.region}
                onChange={(e) => updateField("region", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 appearance-none bg-white transition-colors"
                required
              >
                <option value="">都道府県を選択</option>
                {PREFECTURES.map((pref) => (
                  <option key={pref} value={pref}>
                    {pref}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Birthday */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Cake className="w-4 h-4 text-orange-500" />
              誕生日 (月-日)
            </label>
            <input
              type="text"
              value={currentForm.birthday}
              onChange={(e) => updateField("birthday", e.target.value)}
              placeholder="例: 03-15"
              pattern="\d{2}-\d{2}"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              MM-DD形式で入力（例: 03-15 = 3月15日）
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 text-orange-500" />
              メモ・備考
            </label>
            <textarea
              value={currentForm.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="例: 膝が悪い、甘いものが好き、花粉症がある..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 resize-none transition-colors"
            />
          </div>

          {/* Error / Success */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm">
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-4 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                {isExisting(activeTab) ? "更新する" : "登録する"}
              </>
            )}
          </button>
        </form>

        {/* Registered parents summary */}
        {existingParents.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              登録済みの親
            </h2>
            <div className="space-y-3">
              {existingParents.map((parent) => {
                let hobbies: string[] = [];
                try {
                  hobbies = JSON.parse(parent.hobbies);
                } catch {
                  hobbies = [];
                }
                return (
                  <div
                    key={parent.id}
                    className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold shrink-0">
                      {parent.relation === "mother" ? "母" : "父"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800">
                        {parent.name}（{parent.age}歳）
                      </p>
                      <p className="text-sm text-gray-600">
                        {parent.region} /{" "}
                        {parent.healthStatus === "healthy"
                          ? "元気"
                          : parent.healthStatus === "somewhat"
                            ? "少し心配"
                            : "介護が必要"}
                      </p>
                      {hobbies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {hobbies.map((h) => (
                            <span
                              key={h}
                              className="text-xs bg-white text-orange-600 px-2 py-0.5 rounded-full"
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
