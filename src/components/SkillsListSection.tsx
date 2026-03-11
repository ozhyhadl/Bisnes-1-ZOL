import { motion } from "framer-motion";
import TerminalWindow from "./TerminalWindow";
import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";

const categories = [
  "├── 📁 content-copy / blog-post, twitter-thread, tiktok-script, pillar-page …",
  "├── 📁 email-automation / email-sequence, abandoned-cart-email, black-friday-emails …",
  "├── 📁 sales-funnels / sales-funnel-builder, tripwire-offer, webinar-sales-script …",
  "├── 📁 ads-paid-media / facebook-ad-campaign, google-ads-campaign, tiktok-ad-script …",
  "├── 📁 seo-search / keyword-research, local-seo-plan, featured-snippet-optimizer …",
  "├── 📁 finance-pricing / financial-model, revenue-forecast, unit-economics …",
  "├── 📁 legal-compliance / contract-writer, saas-agreement, gdpr-compliance-checklist …",
  "├── 📁 launch-growth / product-hunt-launch, beta-launch-plan, waitlist-builder …",
  "├── 📁 social-media / viral-content-formula, instagram-carousel, youtube-strategy …",
  "├── 📁 client-consulting / discovery-call-script, scope-of-work, service-productization …",
  "├── 📁 operations-systems / sop-builder, automation-workflow, okr-builder …",
  "├── 📁 ai-automation / ai-use-case-finder, prompt-library, tool-stack-audit …",
  "├── 📁 courses-education / course-outline, cohort-program, certification-program …",
  "├── 📁 personal-brand / personal-brand-strategy, ted-talk-outline, book-proposal …",
  "├── 📁 analytics-data / ab-test-plan, customer-lifetime-value, conversion-funnel-analysis …",
  "└── 📁 industry-specific / property-listing, menu-design-brief, fitness-program-outline …",
];

const SkillsListSection = () => {
  return (
    <section className="py-16 px-4 bg-card">
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % ls -la skills/">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-3">
            500+ Skills. Every Part of Your Business.
          </h2>
          <p className="text-sm text-terminal-foreground/70 mb-8">
            Each skill asks the right questions and delivers polished, ready-to-use output. Here's a taste.
          </p>
          <div className="space-y-2 overflow-x-auto">
            {categories.map((cat, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="text-[10px] md:text-xs text-terminal-green leading-relaxed whitespace-nowrap md:whitespace-normal"
              >
                {cat}
              </motion.p>
            ))}
          </div>
        </TerminalWindow>
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <div className="text-center mt-10">
          <CTAButton>Get the Bundle — $15</CTAButton>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default SkillsListSection;
