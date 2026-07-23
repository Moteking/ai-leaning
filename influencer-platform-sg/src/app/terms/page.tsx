import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service - CastSG",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated: 7 April 2026</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p>These Terms of Service (&ldquo;Terms&rdquo;) govern your use of CastSG (&ldquo;Platform&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), an influencer campaign management platform operated from Singapore. By accessing or using CastSG, you agree to be bound by these Terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">2. Definitions</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Brand</strong> means a business user who posts campaigns on the Platform.</li>
                <li><strong>Creator</strong> means an individual user who applies to and delivers content for campaigns.</li>
                <li><strong>Campaign</strong> means a promotion initiated by a Brand on the Platform.</li>
                <li><strong>Content</strong> means any material created and submitted by a Creator for a Campaign.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">3. Account registration</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>You must be at least 18 years old to use CastSG.</li>
                <li>You agree to provide accurate information and keep it up to date.</li>
                <li>You are responsible for all activity under your account. Keep your password confidential.</li>
                <li>We may suspend or terminate accounts that breach these Terms.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">4. Platform services</h2>
              <p>CastSG provides tools for Brand-Creator matching, campaign management, communication, and deliverable tracking. We do not employ Creators; they are independent contractors.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">6. Content & advertising rules</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Creators must disclose paid partnerships clearly (e.g. #ad, #sponsored) in accordance with Singapore ASAS/ACCS guidelines.</li>
                <li>Content must comply with all applicable laws, including the Singapore Code of Advertising Practice.</li>
                <li>Brands are responsible for the accuracy of product claims and must provide truthful materials.</li>
                <li>Prohibited content includes: illegal products, misleading claims, harassment, discrimination, and adult content.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">7. Prohibited conduct</h2>
              <p>Users shall not:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Submit false information or fake engagement metrics.</li>
                <li>Circumvent the Platform to transact directly, avoiding fees.</li>
                <li>Scrape or harvest data from the Platform.</li>
                <li>Use the Platform for any illegal or unauthorized purpose.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">8. Intellectual property</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>The Platform and its technology are owned by CastSG.</li>
                <li>Content created by Creators remains their property. Creators grant Brands a license to use submitted Content for the agreed campaign scope.</li>
                <li>Creators grant CastSG a worldwide, royalty-free license to display their public profile and portfolio on the Platform.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">9. Disclaimers & limitation of liability</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>The Platform is provided &ldquo;as is&rdquo; without warranties of any kind.</li>
                <li>We are not responsible for the conduct of Brands or Creators, or the quality of Content delivered.</li>
                <li>To the maximum extent permitted by law, our total liability is limited to the fees paid to us in the past 12 months.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">10. Termination</h2>
              <p>You may close your account anytime. We may suspend or terminate your account for breach of these Terms. On termination, your right to use the Platform ends immediately.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">11. Governing law</h2>
              <p>These Terms are governed by the laws of Singapore. Any dispute will be resolved in the Singapore International Commercial Court or the Courts of the Republic of Singapore.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">12. Changes to these Terms</h2>
              <p>We may update these Terms from time to time. We will notify you of material changes via email or in-app notice at least 14 days before they take effect.</p>
            </section>

            <section className="border-t border-border pt-6 text-sm text-gray-500">
              <p>CastSG &middot; Operating from Singapore</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
