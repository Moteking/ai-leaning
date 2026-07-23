import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search,
  BarChart3,
  Users,
  Zap,
  Shield,
  Target,
  MessageSquare,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Star,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { pricingPlans } from "@/lib/mock-data";

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-cyan-50" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Zap size={14} />
            TikTokアフィリエイト特化プラットフォーム
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            見つかる、売れる
            <br />
            <span className="gradient-text">TikTokアフィリエイター。</span>
            <br />
            変わる、広告成果。
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            TikTokアフィリエイトで成果を出しているクリエイターが一目でわかる。
            <br />
            売上実績・エンゲージメント・コンバージョン率で最適なアフィリエイターをマッチング。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto gradient-bg text-white px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              無料で始める
              <ArrowRight size={20} />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
            >
              <PlayCircle size={20} />
              使い方を見る
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <CheckCircle2 size={16} className="text-green-500" />
              初期費用無料
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 size={16} className="text-green-500" />
              最短即日開始
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 size={16} className="text-green-500" />
              成果報酬型対応
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "5,000+", label: "登録アフィリエイター" },
            { value: "850+", label: "導入企業数" },
            { value: "98%", label: "継続率" },
            { value: "3.2億円", label: "月間流通額" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-border">
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <Search className="text-primary" size={28} />,
      title: "AIアフィリエイター検索",
      description:
        "カテゴリ・フォロワー数・エンゲージメント率・売上実績で最適なアフィリエイターを瞬時に発見。AIが最適なマッチングを提案。",
    },
    {
      icon: <BarChart3 className="text-primary" size={28} />,
      title: "リアルタイム売上分析",
      description:
        "アフィリエイターごとの売上・コンバージョン・ROIをリアルタイムで確認。データドリブンな意思決定を支援。",
    },
    {
      icon: <Users className="text-primary" size={28} />,
      title: "アフィリエイタースコア",
      description:
        "独自アルゴリズムで算出したアフィリエイタースコアで、売上貢献度が一目で分かる。過去実績に基づく信頼性評価。",
    },
    {
      icon: <Target className="text-primary" size={28} />,
      title: "キャンペーン管理",
      description:
        "案件の作成・アフィリエイター募集・承認・レポートまでをワンストップで管理。効率的なアフィリエイト運用を実現。",
    },
    {
      icon: <Shield className="text-primary" size={28} />,
      title: "安全な報酬管理",
      description:
        "エスクロー方式で安全な報酬支払い。売上確定後に自動で報酬を計算・支払い。トラブルのない取引を実現。",
    },
    {
      icon: <MessageSquare className="text-primary" size={28} />,
      title: "ダイレクトメッセージ",
      description:
        "プラットフォーム内でアフィリエイターと直接やり取り。案件の詳細確認や素材共有がスムーズに行える。",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            TikTokアフィリエイトに必要な
            <br />
            すべてが揃う
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            アフィリエイター検索から売上管理まで、TikTokアフィリエイトに特化した機能を提供します。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card-hover p-8 rounded-2xl border border-border bg-white"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg mb-3">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "無料アカウント登録",
      description: "企業またはアフィリエイターとしてアカウントを作成。最短30秒で完了。",
      forAdvertiser: "企業情報を入力してアカウント作成",
      forAffiliate: "TikTokアカウントと連携して登録",
    },
    {
      step: "02",
      title: "キャンペーン作成 / 案件検索",
      description: "広告主はキャンペーンを作成、アフィリエイターは案件を検索して応募。",
      forAdvertiser: "商品・報酬・条件を設定してキャンペーン公開",
      forAffiliate: "カテゴリや報酬で案件を検索して応募",
    },
    {
      step: "03",
      title: "マッチング & コンテンツ制作",
      description: "AIが最適なマッチングを提案。承認後、アフィリエイターがコンテンツを制作。",
      forAdvertiser: "AIレコメンドから最適なアフィリエイターを選定",
      forAffiliate: "商品を受け取り、TikTok動画を制作・投稿",
    },
    {
      step: "04",
      title: "成果確認 & 報酬支払い",
      description: "売上・コンバージョンをリアルタイムで確認。成果に応じた報酬を自動支払い。",
      forAdvertiser: "ダッシュボードで売上・ROIを確認",
      forAffiliate: "確定した売上に応じて報酬を受け取り",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">かんたん4ステップ</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            アカウント登録から成果報酬の受け取りまで、シンプルなフローで完結します。
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className={`flex flex-col md:flex-row items-center gap-8 p-8 rounded-2xl bg-white border border-border ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-shrink-0">
                <div className="w-20 h-20 gradient-bg rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">{step.step}</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-pink-50 rounded-lg p-3">
                    <span className="text-xs font-semibold text-primary block mb-1">広告主</span>
                    <span className="text-sm text-gray-700">{step.forAdvertiser}</span>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-3">
                    <span className="text-xs font-semibold text-cyan-600 block mb-1">アフィリエイター</span>
                    <span className="text-sm text-gray-700">{step.forAffiliate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            ビジネスの規模に合わせた
            <br />
            最適なプラン
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            フリープランで気軽にお試し。ビジネスの成長に合わせてアップグレードできます。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 border-2 transition-all ${
                plan.recommended
                  ? "border-primary bg-primary/5 shadow-xl scale-105"
                  : "border-border bg-white hover:border-primary/30"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-bg text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                  <Star size={12} />
                  おすすめ
                </div>
              )}

              <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

              <div className="mb-6">
                {plan.price === -1 ? (
                  <div className="text-3xl font-bold">要相談</div>
                ) : plan.price === 0 ? (
                  <div className="text-3xl font-bold">
                    ¥0<span className="text-base font-normal text-gray-500">/{plan.period}</span>
                  </div>
                ) : (
                  <div className="text-3xl font-bold">
                    ¥{plan.price.toLocaleString()}
                    <span className="text-base font-normal text-gray-500">/{plan.period}</span>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/register"
                className={`block text-center py-3 rounded-full font-medium text-sm transition-colors ${
                  plan.recommended
                    ? "gradient-bg text-white hover:opacity-90"
                    : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {plan.price === -1 ? "お問い合わせ" : "無料で始める"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      question: "TikAfiとは何ですか？",
      answer:
        "TikAfiは、TikTokアフィリエイトに特化したマッチングプラットフォームです。売上実績のあるTikTokアフィリエイターと広告主を最適にマッチングし、成果報酬型のプロモーションを実現します。",
    },
    {
      question: "初期費用はかかりますか？",
      answer:
        "フリープランは完全無料でご利用いただけます。有料プランも初期費用は一切かかりません。月額制で、いつでもプラン変更・解約が可能です。",
    },
    {
      question: "アフィリエイターの審査基準は？",
      answer:
        "TikTokフォロワー1,000人以上、過去のアフィリエイト実績、アカウントの健全性などを基準に審査しています。審査通過後、独自のアフィリエイタースコアが付与されます。",
    },
    {
      question: "報酬の支払いサイクルは？",
      answer:
        "売上確定後、翌月末にアフィリエイターへ報酬をお支払いします。最低支払額は5,000円からです。銀行振込に対応しています。",
    },
    {
      question: "TikTok Shop以外の商品も扱えますか？",
      answer:
        "はい、TikTok Shopに限らず、自社ECサイト・Amazon・楽天など、アフィリエイトリンクを設定できる商品であれば利用可能です。独自のトラッキングシステムで成果を計測します。",
    },
    {
      question: "どのようなカテゴリに対応していますか？",
      answer:
        "美容・コスメ、ファッション、ガジェット、フィットネス、料理、ペットなど、TikTokで人気の幅広いカテゴリに対応しています。登録アフィリエイターのカテゴリは随時拡大中です。",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">よくある質問</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group bg-white rounded-xl border border-border overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6 font-medium hover:text-primary transition-colors">
                {faq.question}
                <ChevronDown
                  size={20}
                  className="flex-shrink-0 ml-4 text-gray-400 group-open:rotate-180 transition-transform"
                />
              </summary>
              <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed">{faq.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gradient-bg rounded-3xl p-12 md:p-16 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            TikTokアフィリエイトを
            <br />
            今すぐ始めよう
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            5,000人以上の実績あるアフィリエイターが待っています。
            <br />
            無料アカウントを作成して、最適なパートナーを見つけましょう。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              広告主として登録
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/auth/register"
              className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              アフィリエイターとして登録
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "田中 マーケティング部長",
      company: "化粧品メーカー A社",
      text: "従来のインフルエンサーマーケティングと違い、売上実績ベースでアフィリエイターを選べるのが画期的。ROIが3倍に改善しました。",
      rating: 5,
    },
    {
      name: "@beauty_mika",
      company: "TikTokアフィリエイター",
      text: "案件の質が高く、報酬もしっかり支払われるので安心。ダッシュボードで自分の成果が見えるのもモチベーションになります。",
      rating: 5,
    },
    {
      name: "鈴木 EC事業責任者",
      company: "D2Cブランド B社",
      text: "TikTokアフィリエイトは始めたかったけど、信頼できるアフィリエイターを見つけるのが大変でした。TikAfiのおかげで効率的に運用できています。",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">導入企業の声</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="p-8 rounded-2xl border border-border bg-white card-hover">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-gray-500">{t.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
