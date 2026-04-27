import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy - CastSG",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-10">Last updated: 7 April 2026</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <p>CastSG (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your personal data in accordance with the Singapore Personal Data Protection Act 2012 (PDPA). This Privacy Policy explains how we collect, use, and disclose your personal data when you use our Platform.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">1. Information we collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Account data</strong>: name, email, password (hashed), company (for brands), phone number.</li>
                <li><strong>Profile data</strong>: bio, categories, languages, city, social media handles, profile picture.</li>
                <li><strong>Platform data</strong>: follower counts and public metrics you choose to share.</li>
                <li><strong>Campaign data</strong>: briefs, messages, deliverables, and ratings.</li>
                <li><strong>Usage data</strong>: IP address, device information, access logs, and cookies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">2. How we use your information</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>To provide, operate, and improve the Platform.</li>
                <li>To verify identity and prevent fraud.</li>
                <li>To match Brands with relevant Creators.</li>
                <li>To communicate campaign updates, messages, and notifications.</li>
                <li>To respond to inquiries and provide customer support.</li>
                <li>To comply with legal obligations.</li>
                <li>For marketing communications (with opt-out option).</li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">3. Disclosure of personal data</h2>
              <p>We may disclose your personal data to:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Other users on the Platform (e.g. Brand/Creator profile information relevant to matching).</li>
                <li>Service providers (email delivery, cloud hosting).</li>
                <li>Law enforcement or regulators when required by law.</li>
                <li>Successors in interest in the event of a business transaction.</li>
              </ul>
              <p className="mt-2">We do not sell your personal data to third parties.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">4. Third-party services</h2>
              <p>We integrate with the following third-party services:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Google Analytics</strong> — usage analytics.</li>
                <li><strong>SendGrid</strong> — transactional email.</li>
              </ul>
              <p className="mt-2">Please review their respective privacy policies.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">5. Cookies</h2>
              <p>We use cookies to maintain sessions, remember preferences, and analyze usage. You can disable cookies in your browser settings; some features may not function correctly as a result.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">6. Security</h2>
              <p>We implement appropriate technical and organizational measures to safeguard your personal data, including encryption in transit (TLS/SSL), encrypted password storage, access controls, and regular security reviews.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">7. Your rights under PDPA</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Access the personal data we hold about you.</li>
                <li>Correct inaccurate personal data.</li>
                <li>Withdraw consent to the collection, use, or disclosure of your personal data.</li>
                <li>Request deletion of your account and associated data (subject to legal retention requirements).</li>
              </ul>
              <p className="mt-2">Send requests to privacy@castsg.com.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">8. Retention</h2>
              <p>We retain personal data for as long as necessary to fulfil the purposes outlined in this policy, or longer if required by law (e.g. tax records kept for 5 years).</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">9. Cross-border transfers</h2>
              <p>Your data may be processed outside Singapore (e.g. AWS regions in SEA). We ensure safeguards comparable to the PDPA are in place for any such transfers.</p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3">10. Contact our Data Protection Officer</h2>
              <div className="mt-2 p-4 bg-surface rounded-xl">
                <p>Email: dpo@castsg.com</p>
                <p>Postal: (Singapore address to be provided)</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
