import { useEffect, useRef } from "react";

import { useCheckout } from "@/contexts/CheckoutContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { salesCopy } from "@/i18n/salesCopy";
import { landingCopy } from "@/i18n/translations";
import { SALES_COPY, formatUsd, getBundlePlusUpsellTotal } from "@/lib/sales";
import { Checkbox } from "@/components/ui/checkbox";

import TerminalWindow from "./TerminalWindow";
import ScrollReveal from "./ScrollReveal";
import CTAButton from "./CTAButton";
import GuaranteeBadge from "./GuaranteeBadge";
import OfferCountdown from "./OfferCountdown";

const PricingSection = () => {
  const { isCheckoutLoading, isN8nAdded, openCheckout, toggleN8nInOrder, warmCheckout } = useCheckout();
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          warmCheckout();
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [warmCheckout]);

  function handlePricingCheckoutClick() {
    void openCheckout();
  }

  const orderTotal = formatUsd(getBundlePlusUpsellTotal(isN8nAdded));

  return (
    <section ref={sectionRef} id="pricing" className="py-16 px-4 bg-card" aria-label={t(landingCopy.pricing.title)}>
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % cat pricing.conf">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-8">
            {t(landingCopy.pricing.title)}
          </h2>
          <div className="bg-terminal/80 border border-terminal-foreground/10 rounded-lg p-5 sm:p-6 md:p-8">
            <h3 className="mb-5 text-base font-semibold tracking-[0.04em] text-terminal-foreground/92 md:text-lg">
              {landingCopy.pricing.bundleName}
            </h3>
            <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-4 text-center">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-terminal-foreground/60">{t(landingCopy.pricing.todayOnly)}</p>
              <p className="mt-3 text-sm leading-relaxed text-terminal-foreground/80">{t(salesCopy.pricing.anchor)}</p>
            </div>
            <div className="hidden rounded-xl border border-terminal-foreground/8 bg-black/10 px-4 py-2 md:block md:px-5">
              {salesCopy.pricing.highlights.map((item) => (
                <div key={item.en} className="flex items-start gap-3 border-b border-terminal-foreground/8 py-3 text-sm last:border-b-0 last:pb-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span className="flex-1 leading-relaxed text-terminal-foreground/74">{t(item)}</span>
                </div>
              ))}
            </div>
            <details className="mb-6 rounded-xl border border-terminal-foreground/8 bg-black/10 p-4 md:hidden">
              <summary className="cursor-pointer text-sm font-semibold text-terminal-foreground">{t(salesCopy.pricing.includedLabel)}</summary>
              <div className="mt-4 space-y-3">
                {salesCopy.pricing.highlights.map((item) => (
                  <p key={item.en} className="text-xs leading-relaxed text-terminal-foreground/74">{t(item)}</p>
                ))}
              </div>
            </details>
            <div className="mx-auto max-w-md text-center">
              <div className="mb-4">
                <OfferCountdown className="justify-center" />
              </div>
              <div className="mb-3 flex w-full flex-col items-center rounded-2xl border border-primary/20 bg-primary/10 px-6 py-5 shadow-[0_18px_44px_rgba(193,98,58,0.14)]">
                <span className="text-[10px] uppercase tracking-[0.26em] text-terminal-foreground/60 mb-2">
                  {t(landingCopy.pricing.todayOnly)}
                </span>
                <div className="flex items-end justify-center gap-3 sm:gap-4">
                  <span className="text-base md:text-lg font-semibold text-[#ff6a6a] line-through decoration-2 decoration-[#ff6a6a]">
                    {SALES_COPY.anchorRange}
                  </span>
                  <span className="text-4xl md:text-5xl font-bold text-[#4fa878] drop-shadow-[0_8px_24px_rgba(60,138,97,0.24)]">
                    {SALES_COPY.bundlePriceLabel}
                  </span>
                </div>
              </div>
              <div className="mb-5 rounded-2xl border border-terminal-foreground/10 bg-black/10 p-4 text-left">
                <label className="flex cursor-pointer items-start gap-3">
                  <Checkbox checked={isN8nAdded} onCheckedChange={() => toggleN8nInOrder()} className="mt-1 h-5 w-5" />
                  <div>
                    <p className="text-sm font-semibold text-terminal-foreground">{t(salesCopy.pricing.upsellLabel)}</p>
                    <p className="mt-2 text-xs leading-relaxed text-terminal-foreground/70">{t(salesCopy.pricing.upsellHelper)}</p>
                  </div>
                </label>
              </div>
              <div className="mb-4 flex items-center justify-between rounded-xl border border-terminal-foreground/10 bg-black/10 px-4 py-3 text-sm text-terminal-foreground/80">
                <span>{t(salesCopy.pricing.totalLabel)}</span>
                <span className="text-lg font-semibold text-terminal-foreground">{orderTotal}</span>
              </div>
              <p className="mx-auto mb-6 max-w-[24rem] text-xs leading-relaxed text-terminal-foreground/72">
                {t(landingCopy.pricing.helper)}
              </p>
              <CTAButton
                onClick={handlePricingCheckoutClick}
                analyticsLocation="pricing"
                onPointerEnter={warmCheckout}
                onFocus={warmCheckout}
                onTouchStart={warmCheckout}
                disabled={isCheckoutLoading}
                className="w-full px-10 py-4 text-sm shadow-[0_0_0_1px_rgba(211,121,74,0.18),0_12px_32px_rgba(193,98,58,0.24)] hover:shadow-[0_0_0_1px_rgba(211,121,74,0.24),0_16px_36px_rgba(193,98,58,0.3)] sm:w-auto sm:min-w-[18rem]"
              >
                {t(landingCopy.pricing.cta)}
              </CTAButton>
              <div className="mt-4">
                <GuaranteeBadge />
              </div>
              <p className="mx-auto mt-4 max-w-[22rem] text-[10px] leading-relaxed text-terminal-foreground/70">
                {t(landingCopy.pricing.secureHelper)}
              </p>
            </div>
          </div>
        </TerminalWindow>
      </ScrollReveal>
    </section>
  );
};

export default PricingSection;
