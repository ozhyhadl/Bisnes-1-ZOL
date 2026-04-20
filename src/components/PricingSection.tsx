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
          <div className="bg-terminal/80 border border-terminal-foreground/10 rounded-lg p-6 md:p-8">
            <h3 className="text-terminal-foreground font-bold text-lg mb-6">{landingCopy.pricing.bundleName}</h3>
            <div className="space-y-3 mb-8">
              {landingCopy.pricing.items.map((item) => (
                <div
                  key={item.price}
                  className="flex justify-between items-start gap-2 text-xs md:text-sm"
                >
                  <span className="text-terminal-foreground/70 flex-1">{t(item.label)}</span>
                  <span className="text-[#ff5c5c] line-through decoration-2 decoration-[#ff5c5c] font-medium shrink-0">{item.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-terminal-foreground/10 pt-5 mb-6">
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-terminal-foreground/70">{t(landingCopy.pricing.totalValue)}</span>
                <span className="text-[#ff6a6a] line-through decoration-2 decoration-[#ff6a6a] font-semibold">$707</span>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex flex-col items-center rounded-2xl border border-primary/20 bg-primary/10 px-6 py-5 mb-3 shadow-[0_18px_44px_rgba(193,98,58,0.14)]">
                <span className="text-[10px] uppercase tracking-[0.26em] text-terminal-foreground/60 mb-2">
                  {t(landingCopy.pricing.todayOnly)}
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
              <p className="text-xs text-terminal-foreground/72 mb-6">{t(landingCopy.pricing.helper)}</p>
              <CTAButton
                onClick={handlePricingCheckoutClick}
                disabled={isCheckoutLoading}
                className="px-10 py-4 text-sm shadow-[0_0_0_1px_rgba(211,121,74,0.18),0_12px_32px_rgba(193,98,58,0.24)] hover:shadow-[0_0_0_1px_rgba(211,121,74,0.24),0_16px_36px_rgba(193,98,58,0.3)]"
              >
                {t(landingCopy.pricing.cta)}
              </CTAButton>
              <p className="text-[10px] text-terminal-foreground/70 mt-4">{t(landingCopy.pricing.secureHelper)}</p>
            </div>
          </div>
        </TerminalWindow>
      </ScrollReveal>
    </section>
  );
};

export default PricingSection;
