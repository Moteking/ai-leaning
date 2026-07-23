import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search,
  Users,
  Target,
  Shield,
  MessageSquare,
  ClipboardList,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Star,
  Camera as Instagram,
  Film as Youtube,
} from "lucide-react";
import Link from "next/link";

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-pink-50" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            🇸🇬 Built for Singapore
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Singapore&apos;s
            <br />
            <span className="gradient-text">Influencer Campaign</span>
            <br />
            Management Platform
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with top creators across Instagram, TikTok, and YouTube.
            Manage your entire influencer campaign workflow in one place —
            from discovery to delivery.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto gradient-bg text-white px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Start free
              <ArrowRight size={20} />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg hover:border-primary hover:text-primary transition-colors"
            >
              See how it works
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <CheckCircle2 size={16} className="text-green-500" /> No credit card required
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 size={16} className="text-green-500" /> Free forever plan
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 size={16} className="text-green-500" /> 14-day Pro trial
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "2,500+", label: "Verified Creators" },
            { value: "450+", label: "Active Brands" },
            { value: "5,000+", label: "Campaigns Run" },
            { value: "96%", label: "Satisfaction Rate" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-border">
              <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Platform support */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-6">Works with all major social platforms</p>
          <div className="flex items-center justify-center gap-8 text-gray-400">
            <Instagram size={28} />
            <div className="font-bold text-2xl tracking-tight">TikTok</div>
            <Youtube size={28} />
            <div className="font-bold text-xl text-red-500/60">小红书</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <Search className="text-primary" size={28} />,
      title: "Creator Discovery",
      description:
        "Browse verified creators by category, platform, follower count, and niche. Find the right match for your brand.",
    },
    {
      icon: <ClipboardList className="text-primary" size={28} />,
      title: "Campaign Briefs",
      description:
        "Create detailed campaign briefs with deliverables, requirements, and timelines. Templates for every industry.",
    },
    {
      icon: <MessageSquare className="text-primary" size={28} />,
      title: "Built-in Messaging",
      description:
        "Chat with creators directly. Negotiate rates, share references, and manage deliverables — all in one place.",
    },
    {
      icon: <Target className="text-primary" size={28} />,
      title: "Deliverable Tracking",
      description:
        "Track every deliverable from draft to publication. Approve content before it goes live.",
    },
    {
      icon: <Users className="text-primary" size={28} />,
      title: "Multi-platform",
      description:
        "Instagram, TikTok, YouTube, Xiaohongshu — manage creators across all major platforms from one dashboard.",
    },
    {
      icon: <Shield className="text-primary" size={28} />,
      title: "Verified Profiles",
      description:
        "Every creator is manually verified. See past campaigns, audience data, and genuine reviews.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
            Everything you need to run
            <br />
            influencer campaigns in Singapore
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From creator discovery to content approval, we&apos;ve got every step covered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="card-hover p-8 rounded-2xl border border-border bg-white">
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
      title: "Create your account",
      description: "Sign up as a brand or creator in under a minute. No credit card needed.",
      forBrand: "Set up brand profile",
      forCreator: "Link your social handles",
    },
    {
      step: "02",
      title: "Post or discover campaigns",
      description: "Brands post campaign briefs. Creators browse and apply to opportunities that fit.",
      forBrand: "Post campaign brief with deliverables",
      forCreator: "Browse and apply to relevant campaigns",
    },
    {
      step: "03",
      title: "Collaborate & deliver",
      description: "Chat, negotiate, and track deliverables in the platform.",
      forBrand: "Review applications & shortlist creators",
      forCreator: "Get accepted, create content, submit for review",
    },
    {
      step: "04",
      title: "Complete & review",
      description: "Approve the delivered content and leave a review for the creator.",
      forBrand: "Approve content and complete campaign",
      forCreator: "Content goes live, receive brand review",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">How it works</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">Simple, 4-step workflow</h2>
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
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <span className="text-xs font-semibold text-primary block mb-1">For Brands</span>
                    <span className="text-sm text-gray-700">{step.forBrand}</span>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-3">
                    <span className="text-xs font-semibold text-secondary block mb-1">For Creators</span>
                    <span className="text-sm text-gray-700">{step.forCreator}</span>
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

function FAQSection() {
  const faqs = [
    {
      q: "What is CastSG?",
      a: "CastSG is Singapore's dedicated influencer campaign management platform. Brands post campaigns, creators apply, and the platform handles the entire workflow from brief to content delivery.",
    },
    {
      q: "Which platforms are supported?",
      a: "Instagram, TikTok, YouTube, and Xiaohongshu (小红书). You can run multi-platform campaigns where creators deliver content across multiple channels.",
    },
    {
      q: "Is CastSG only for big brands?",
      a: "Not at all. Many of our brands are SMEs and D2C startups in Singapore. Anyone can sign up and start posting campaigns.",
    },
    {
      q: "How are creators verified?",
      a: "Every creator submits platform handles and goes through a manual verification process. We check audience authenticity, past content, and require ID verification.",
    },
    {
      q: "Can I run campaigns across Southeast Asia?",
      a: "Right now CastSG focuses on creators based in Singapore. Regional expansion (MY, ID, TH) is on our roadmap for late 2026.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-surface">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">Frequently asked questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="group bg-white rounded-xl border border-border overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer p-6 font-medium hover:text-primary transition-colors">
                {faq.q}
                <ChevronDown size={20} className="flex-shrink-0 ml-4 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed">{faq.a}</div>
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
            Ready to run better campaigns?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Join 450+ Singapore brands already using CastSG.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2">
              I&apos;m a brand <ArrowRight size={20} />
            </Link>
            <Link href="/auth/register" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors flex items-center gap-2">
              I&apos;m a creator <ArrowRight size={20} />
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
      name: "Cheryl Ng",
      role: "Head of Marketing",
      company: "SG Beauty Brand",
      text: "CastSG cut our campaign planning time in half. Finally a platform that understands the Singapore influencer scene.",
    },
    {
      name: "@marcustan_eats",
      role: "Food Creator",
      company: "220K TikTok followers",
      text: "Way less back-and-forth than DMs. I can focus on creating instead of chasing invoices.",
    },
    {
      name: "Daniel Koh",
      role: "Founder",
      company: "D2C Home Brand",
      text: "As a small brand, we couldn't afford an agency. CastSG gave us the tools without the markup.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">Loved by brands and creators</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="p-8 rounded-2xl border border-border bg-white card-hover">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-gray-500">{t.role} · {t.company}</div>
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
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
