import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";

import pricingUpsellImage from "@/assets/n8n-workflows-upsell.png";
import { useCheckout } from "@/contexts/CheckoutContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import TerminalWindow from "./TerminalWindow";
import ScrollReveal from "./ScrollReveal";
import CTAButton from "./CTAButton";

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
                className="px-10 py-4 text-sm shadow-[0_0_0_1px_rgba(211,121,74,0.18),0_12px_32px_rgba(193,98,58,0.24)] hover:shadow-[0_0_0_1px_rgba(211,121,74,0.24),0_16px_36px_rgba(193,98,58,0.3)]"
              >
                Get Instant Access — $15
              </CTAButton>
              <p className="text-[10px] text-terminal-foreground/70 mt-4">Secure checkout · Instant delivery to your email</p>
            </div>
          </div>
        </TerminalWindow>
      </ScrollReveal>

      <Dialog open={isUpsellOpen} onOpenChange={setIsUpsellOpen}>
        <DialogContent className="max-w-md border-border/80 bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(249,245,238,0.98))] p-0 shadow-[0_28px_90px_rgba(30,24,18,0.24)]">
          <div className="rounded-[inherit] p-6 sm:p-7">
            <DialogHeader className="space-y-3 text-left">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Exclusive Offer
              </div>
              <DialogTitle className="text-2xl font-bold leading-tight text-foreground">
                Add 1,800+ N8N workflows to this order for $10
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                Get the ready-made automation bundle as a one-click add-on before secure checkout.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 flex gap-4 rounded-2xl border border-border/70 bg-background/80 p-4">
              <img
                src={pricingUpsellImage}
                alt="1,800 plus N8N workflows bundle artwork"
                className="h-24 w-24 shrink-0 rounded-xl object-cover ring-1 ring-border/70"
                loading="lazy"
              />
              <div className="min-w-0 text-left">
                <p className="text-sm font-semibold text-foreground">N8N Integration Automation Bundle</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Add the discounted bundle now and receive it with the same secure delivery flow.
                </p>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-sm font-semibold text-[#ff6a6a] line-through decoration-2 decoration-[#ff6a6a]">$15</span>
                  <span className="text-3xl font-bold text-[#4fa878]">$10</span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => handleUpsellChoice(true)}
                disabled={isCheckoutLoading}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/70 bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isN8nAdded ? <Check className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                {isCheckoutLoading ? "Opening Checkout..." : "Add to Order"}
              </button>
              <button
                type="button"
                onClick={() => handleUpsellChoice(false)}
                disabled={isCheckoutLoading}
                className="flex min-h-11 w-full items-center justify-center rounded-xl border border-border bg-background/92 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
              >
                Continue Without Add-On
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PricingSection;
