import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SUPPORT_EMAIL } from "@/config/links";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground mb-10">Last updated: March 11, 2026</p>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Who We Are</h2>
            <p>
              AI Cloud Base ("we," "us," or "our") operates the website{" "}
              <a href="https://aicldbase.com" className="text-primary hover:underline">aicldbase.com</a>.
              This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or purchase our products.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect only the information necessary to process your purchase and deliver your product:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-foreground">Email address</strong> — to deliver your purchase and provide customer support.</li>
              <li><strong className="text-foreground">Payment information</strong> — processed securely by our third-party payment processor. We do not store your credit card details.</li>
              <li><strong className="text-foreground">Usage data</strong> — anonymous analytics data such as page views, device type, and referral source, collected to improve our website.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To process and deliver your digital product purchase.</li>
              <li>To send purchase confirmations and download links.</li>
              <li>To provide customer support and process refund requests.</li>
              <li>To improve our website and product offerings.</li>
            </ul>
            <p className="mt-3">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Payment Processing</h2>
            <p>
              All payments are processed by our third-party payment provider. Your payment information is transmitted directly to the payment processor using industry-standard encryption. We never have access to your full credit card number.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Cookies & Analytics</h2>
            <p>
              We may use cookies and similar technologies for website analytics and to improve user experience. Analytics tools collect anonymous, aggregated data about how visitors use our site. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Data Retention</h2>
            <p>
              We retain your email address and purchase records for as long as needed to provide customer support and comply with legal obligations. You may request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction or deletion of your data.</li>
              <li>Opt out of marketing communications at any time.</li>
              <li>Request a copy of your data in a portable format.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Third-Party Services</h2>
            <p>
              Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of the website after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or your personal data, contact us at{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default PrivacyPolicy;
