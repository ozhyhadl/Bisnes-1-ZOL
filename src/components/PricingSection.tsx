import { useCheckout } from "@/contexts/CheckoutContext";

import TerminalWindow from "./TerminalWindow";
import ScrollReveal from "./ScrollReveal";
import CTAButton from "./CTAButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/translations";

const PricingSection = () => {
  const { isCheckoutLoading, openCheckout } = useCheckout();
  const { t } = useLanguage();

  function handlePricingCheckoutClick() {
    void openCheckout();
  }

  return (
    <section id="pricing" className="py-16 px-4 bg-card" aria-label={t(landingCopy.pricing.title)}>
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % cat pricing.conf">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-8">
            {t(landingCopy.pricing.title)}
          </h2>
          <div className="bg-terminal/80 border border-terminal-foreground/10 rounded-lg p-5 sm:p-6 md:p-8">
            <h3 className="mb-5 text-base font-semibold tracking-[0.04em] text-terminal-foreground/92 md:text-lg">
              {landingCopy.pricing.bundleName}
            </h3>
            <div className="mb-8 rounded-xl border border-terminal-foreground/8 bg-black/10 px-4 py-2 md:px-5">
              {landingCopy.pricing.items.map((item) => (
                <div
                  key={item.price}
                  className="flex items-start justify-between gap-4 border-b border-terminal-foreground/8 py-3 text-xs last:border-b-0 last:pb-2 md:text-sm"
                >
                  <span className="flex-1 leading-relaxed text-terminal-foreground/70">{t(item.label)}</span>
                  <span className="shrink-0 pt-0.5 font-medium text-[#ff5c5c] line-through decoration-2 decoration-[#ff5c5c]">{item.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-terminal-foreground/10 pt-5 mb-6">
              <div className="mb-4 flex items-center justify-between gap-4 text-sm md:text-base">
                <span className="text-terminal-foreground/70">{t(landingCopy.pricing.totalValue)}</span>
                <span className="text-[#ff6a6a] line-through decoration-2 decoration-[#ff6a6a] font-semibold">$707</span>
              </div>
            </div>
            <div className="mx-auto max-w-md text-center">
              <div className="mb-3 flex w-full flex-col items-center rounded-2xl border border-primary/20 bg-primary/10 px-6 py-5 shadow-[0_18px_44px_rgba(193,98,58,0.14)]">
                <span className="text-[10px] uppercase tracking-[0.26em] text-terminal-foreground/60 mb-2">
                  {t(landingCopy.pricing.todayOnly)}
                </span>
                <div className="flex items-end justify-center gap-3 sm:gap-4">
                  <span className="text-base md:text-lg font-semibold text-[#ff6a6a] line-through decoration-2 decoration-[#ff6a6a]">
                    $707
                  </span>
                  <span className="text-4xl md:text-5xl font-bold text-[#4fa878] drop-shadow-[0_8px_24px_rgba(60,138,97,0.24)]">
                    $15
                  </span>
                </div>
              </div>
              <p className="mx-auto mb-6 max-w-[24rem] text-xs leading-relaxed text-terminal-foreground/72">
                {t(landingCopy.pricing.helper)}
              </p>
              <CTAButton
                onClick={handlePricingCheckoutClick}
                disabled={isCheckoutLoading}
                className="w-full px-10 py-4 text-sm shadow-[0_0_0_1px_rgba(211,121,74,0.18),0_12px_32px_rgba(193,98,58,0.24)] hover:shadow-[0_0_0_1px_rgba(211,121,74,0.24),0_16px_36px_rgba(193,98,58,0.3)] sm:w-auto sm:min-w-[18rem]"
              >
                {t(landingCopy.pricing.cta)}
              </CTAButton>
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
