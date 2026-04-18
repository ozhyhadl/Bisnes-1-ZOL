import { Suspense, lazy, useEffect, useState } from "react";

import { useCheckout } from "@/contexts/CheckoutContext";
import { runWhenBrowserIdle } from "@/lib/browser-idle";

import TerminalWindow from "./TerminalWindow";
import ScrollReveal from "./ScrollReveal";
import CTAButton from "./CTAButton";

const loadPricingUpsellDialog = () => import("./PricingUpsellDialog");
const PricingUpsellDialog = lazy(loadPricingUpsellDialog);

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
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const { isCheckoutLoading, isN8nAdded, openCheckout } = useCheckout();

  useEffect(() => {
    return runWhenBrowserIdle(() => {
      void loadPricingUpsellDialog();
    }, 2500);
  }, []);

  function warmUpsellDialog() {
    void loadPricingUpsellDialog();
  }

  function handlePricingCheckoutClick() {
    if (isN8nAdded) {
      void openCheckout();
      return;
    }

    setIsUpsellOpen(true);
  }

  function handleUpsellChoice(includeN8n: boolean) {
    setIsUpsellOpen(false);
    void openCheckout({
      includeN8n,
      persistN8nSelection: includeN8n,
    });
  }

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
                  <span className="text-[#ff5c5c] line-through decoration-2 decoration-[#ff5c5c] font-medium shrink-0">{item.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-terminal-foreground/10 pt-5 mb-6">
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-terminal-foreground/70">Total Value</span>
                <span className="text-[#ff6a6a] line-through decoration-2 decoration-[#ff6a6a] font-semibold">$707</span>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex flex-col items-center rounded-2xl border border-primary/20 bg-primary/10 px-6 py-5 mb-3 shadow-[0_18px_44px_rgba(193,98,58,0.14)]">
                <span className="text-[10px] uppercase tracking-[0.26em] text-terminal-foreground/60 mb-2">
                  Today Only
                </span>
                <div className="flex items-end justify-center gap-3">
                  <span className="text-base md:text-lg font-semibold text-[#ff6a6a] line-through decoration-2 decoration-[#ff6a6a]">
                    $707
                  </span>
                  <span className="text-4xl md:text-5xl font-bold text-[#4fa878] drop-shadow-[0_8px_24px_rgba(60,138,97,0.24)]">
                    $15
                  </span>
                </div>
              </div>
              <p className="text-xs text-terminal-foreground/72 mb-6">One-time payment · Lifetime access · Instant digital delivery</p>
              <CTAButton
                onClick={handlePricingCheckoutClick}
                disabled={isCheckoutLoading}
                onMouseEnter={warmUpsellDialog}
                onFocus={warmUpsellDialog}
                className="px-10 py-4 text-sm shadow-[0_0_0_1px_rgba(211,121,74,0.18),0_12px_32px_rgba(193,98,58,0.24)] hover:shadow-[0_0_0_1px_rgba(211,121,74,0.24),0_16px_36px_rgba(193,98,58,0.3)]"
              >
                Get Instant Access — $15
              </CTAButton>
              <p className="text-[10px] text-terminal-foreground/70 mt-4">Secure checkout · Instant delivery to your email</p>
            </div>
          </div>
        </TerminalWindow>
      </ScrollReveal>

      <Suspense fallback={null}>
        <PricingUpsellDialog
          open={isUpsellOpen}
          isCheckoutLoading={isCheckoutLoading}
          isN8nAdded={isN8nAdded}
          onOpenChange={setIsUpsellOpen}
          onUpsellChoice={handleUpsellChoice}
        />
      </Suspense>
    </section>
  );
};

export default PricingSection;
