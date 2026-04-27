import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Target, Users, Heart, Rocket } from "lucide-react";

export const metadata = {
  title: "About - CastSG",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <section className="py-16 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              We believe in <span className="gradient-text">real creators</span>,
              <br />real stories, real results.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              CastSG was built to give Singapore brands and creators a fair, transparent, and friction-free
              way to work together. No inflated follower counts, no agency markups, no hidden fees.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl font-bold mb-4">Our story</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Singapore&apos;s creator economy is thriving, but finding the right match for a campaign
                  often still involves endless DMs, spreadsheets, and broken workflows.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We built CastSG to solve this — a single platform where brands discover verified creators,
                  manage briefs, approve deliverables, and pay securely.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Made in Singapore, for Singapore — with plans to expand across Southeast Asia.
                </p>
              </div>
              <div className="gradient-bg rounded-3xl aspect-square flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <div className="text-6xl font-bold mb-2">🇸🇬</div>
                  <div className="text-xl font-medium">Built in Singapore</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { icon: <Heart className="text-primary" size={24} />, title: "Transparent", desc: "Clear deliverables, honest communication, and verified creators." },
                { icon: <Users className="text-primary" size={24} />, title: "Verified", desc: "Every creator is manually vetted. No fake followers." },
                { icon: <Target className="text-primary" size={24} />, title: "Effective", desc: "Tools that actually save brands and creators time." },
                { icon: <Rocket className="text-primary" size={24} />, title: "Local-first", desc: "Built for SG culture, languages, and local creators." },
              ].map((v) => (
                <div key={v.title} className="bg-white border border-border rounded-2xl p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">{v.icon}</div>
                  <h3 className="font-bold mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 text-white rounded-3xl p-12 text-center">
              <h2 className="text-2xl font-bold mb-3">Join the movement</h2>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                Whether you&apos;re a brand or a creator, we&apos;d love to have you on the platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/register" className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100">
                  Get started — it&apos;s free
                </Link>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Learn more →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
