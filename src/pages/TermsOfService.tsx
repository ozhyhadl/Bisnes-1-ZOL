import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SUPPORT_EMAIL } from "@/config/links";
import { usePageMeta } from "@/hooks/usePageMeta";

const TermsOfService = () => {
  usePageMeta({
    title: "Terms of Service — AI Cloud Base",
    description: "Terms and conditions for purchasing and using AI Cloud Base digital products. Read our full terms of service.",
    canonical: "https://aicldbase.com/terms",
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-xs text-muted-foreground mb-10">Last updated: March 14, 2026</p>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Agreement</h2>
            <p>
              By accessing or purchasing from{" "}
              <a href="https://aicldbase.com" className="text-primary hover:underline">aicldbase.com</a>{" "}
              ("the Website"), operated by AI Cloud Base ("we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Website or purchase our products.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Product Description</h2>
            <p>
              We sell digital products, including but not limited to collections of structured AI skill files ("Skills") designed for use with Claude AI. All products are delivered digitally via download link after purchase.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Pricing & Payment</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>All prices are listed in US dollars (USD) and are inclusive of applicable taxes unless stated otherwise.</li>
              <li>Payment is processed securely through our third-party payment provider at the time of purchase.</li>
              <li>You will receive a download link immediately after successful payment.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Delivery</h2>
            <p>
              All products are digital and delivered electronically. After successful payment, you will receive an email with a download link. Delivery is typically instant. If you do not receive your download link within 1 hour, contact us at{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Refund Policy</h2>
            <p>
              Refund requests for one-time purchases may be submitted within <strong className="text-foreground">7 days of purchase</strong>. Refund requests are reviewed and processed through Paddle in accordance with Paddle&apos;s checkout terms, applicable consumer protection laws, and the circumstances of the order. If you experience a technical issue with delivery, contact us at{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a>{" "}
              and we will ensure you receive your files.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. License & Permitted Use</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Upon purchase, you receive a <strong className="text-foreground">personal, non-exclusive, non-transferable license</strong> to use the digital products for your own personal or business purposes.</li>
              <li>You may use the skills across your own projects, businesses, and client work.</li>
              <li>You <strong className="text-foreground">may not</strong> redistribute, resell, or share the skill files as a standalone product or bundle.</li>
              <li>You <strong className="text-foreground">may not</strong> claim authorship of the skill files.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Intellectual Property</h2>
            <p>
              All content on this Website, including text, graphics, logos, and digital products, is the property of AI Cloud Base or its content suppliers and is protected by applicable intellectual property laws. Unauthorized reproduction or distribution is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Disclaimer</h2>
            <p>
              Our products are provided "as is" without warranties of any kind, either express or implied. We do not guarantee specific results from using our products. Results depend on your individual use case, business context, and how you apply the skills. AI Cloud Base is not liable for any indirect, incidental, or consequential damages arising from the use of our products.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, our total liability for any claim arising from these Terms or your use of our products shall not exceed the amount you paid for the product in question.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">10. Changes to These Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated date. Continued use of the Website after changes constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">11. Contact</h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">{SUPPORT_EMAIL}</a>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default TermsOfService;
