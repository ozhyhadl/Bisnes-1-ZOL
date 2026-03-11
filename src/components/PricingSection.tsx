import TerminalWindow from "./TerminalWindow";
import ScrollReveal from "./ScrollReveal";
import { CHECKOUT_URL } from "@/config/links";

const pricingItems = [
  { name: "Content, Copy & Social Media (75+)", price: "$97" },
  { name: "Marketing, Sales & Ads (90+)", price: "$127" },
  { name: "Finance, Legal & Compliance (60+)", price: "$89" },
  { name: "Operations, HR & Systems (80+)", price: "$109" },
  { name: "SEO, Analytics & Data (40+)", price: "$67" },
  { name: "Launch, SaaS & E-commerce (60+)", price: "$89" },
  { name: "Personal Brand, Education & Industry (100+)", price: "$129" },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-16 px-4 bg-card" aria-label="Pricing">
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % cat pricing.conf">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-8">
            Everything. One Price.
          </h2>
          <div className="bg-terminal/80 border border-terminal-foreground/10 rounded-lg p-6 md:p-8">
            <h3 className="text-terminal-foreground font-bold text-lg mb-6">Claude Skills Ultimate Bundle</h3>
            <div className="space-y-3 mb-8">
              {pricingItems.map((item, i) => (
                <div
                  key={item.name}
                  className="flex justify-between items-start gap-2 text-xs md:text-sm"
                >
                  <span className="text-terminal-foreground/70 flex-1">{item.name}</span>
                  <span className="text-terminal-foreground/40 line-through shrink-0">{item.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-terminal-foreground/10 pt-5 mb-6">
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-terminal-foreground/70">Total Value</span>
                <span className="text-terminal-foreground/40 line-through">$707</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">$15</div>
              <p className="text-xs text-terminal-foreground/50 mb-6">One-time payment · Lifetime access · 7-day money-back guarantee</p>
              <a
                href={CHECKOUT_URL}
                className="inline-block bg-primary text-primary-foreground px-10 py-4 text-sm uppercase tracking-widest font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Get Instant Access — $15
              </a>
              <p className="text-[10px] text-terminal-foreground/40 mt-4">Secure checkout · Instant delivery to your email</p>
            </div>
          </div>
        </TerminalWindow>
      </ScrollReveal>
    </section>
  );
};

export default PricingSection;
