import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";

import heroUpsellImage from "@/assets/n8n-workflows-upsell.svg";
import { useCheckout } from "@/contexts/CheckoutContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CTAButton from "./CTAButton";

const HeroSection = () => {
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const { isCheckoutLoading, isN8nAdded, openCheckout } = useCheckout();

  function handleHeroCheckoutClick() {
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
    <section className="pt-10 md:pt-16 pb-14 md:pb-20 text-center px-4" aria-label="Hero">
      <div className="inline-block border border-border rounded-full px-5 py-1.5 mb-8">
        <span className="text-sm text-muted-foreground">⚡ AI Cloud Base</span>
      </div>
      <h1 className="text-3xl md:text-6xl font-bold leading-tight mb-6 max-w-3xl mx-auto">
        Stop Prompting. Start Running Your Business.
      </h1>
      <p className="max-w-xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
        500+ ready-made Claude skill files that turn a blank chat into a finished blog post, a signed contract, or a 90-day marketing plan — before your coffee gets cold.
      </p>
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-8">
        <span>★★★★★ 4.9/5</span>
        <span className="text-border">|</span>
        <span>1,200+ buyers</span>
        <span className="text-border">|</span>
        <span>Works in Claude.ai, Code &amp; Cowork</span>
      </div>
      <div>
        <CTAButton onClick={handleHeroCheckoutClick} disabled={isCheckoutLoading}>
          Get Instant Access — $15
        </CTAButton>
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        One-time purchase · Instant download · Lifetime access
      </p>

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
                src={heroUpsellImage}
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

export default HeroSection;
