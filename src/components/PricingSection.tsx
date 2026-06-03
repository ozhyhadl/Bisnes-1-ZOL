import { useEffect, useRef } from "react";

import { useCheckout } from "@/contexts/CheckoutContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { salesCopy } from "@/i18n/salesCopy";
import { landingCopy } from "@/i18n/translations";
import { SALES_COPY, formatUsd, getBundlePlusUpsellTotal } from "@/lib/sales";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Ban, CircleCheck, CreditCard, Download, Infinity as InfinityIcon, ShieldCheck, Star } from "lucide-react";

import TerminalWindow from "./TerminalWindow";
import ScrollReveal from "./ScrollReveal";
import CTAButton from "./CTAButton";
import OfferCountdown from "./OfferCountdown";

type PricingSectionProps = {
  cardOnly?: boolean;
  className?: string;
  sectionId?: string;
  terminalClassName?: string;
};

const PricingSection = ({ cardOnly = false, className, sectionId = "pricing", terminalClassName }: PricingSectionProps) => {
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
  const trustIcons = [CreditCard, InfinityIcon, Download, Ban] as const;
  const pricingCard = (
    <div
      className={cn(
        "rounded-[18px] border border-[rgba(255,245,230,0.16)] bg-[radial-gradient(circle_at_top_left,rgba(111,69,48,0.18),transparent_36%),linear-gradient(180deg,rgba(23,20,18,0.96),rgba(14,12,11,0.98))] p-4 text-left text-[rgb(229,225,216)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_22px_52px_rgba(0,0,0,0.24)] sm:p-6 md:rounded-[20px] md:p-9 md:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_28px_70px_rgba(0,0,0,0.28)]",
        cardOnly && "mx-auto w-full",
      )}
    >
      <h3 className="text-xl font-black leading-snug text-terminal-foreground sm:text-2xl md:text-4xl">
        {landingCopy.pricing.bundleName}
      </h3>

      <div className="mt-4 flex items-center gap-3 rounded-[16px] border border-[rgba(238,76,54,0.68)] bg-[radial-gradient(circle_at_12%_35%,rgba(255,141,82,0.36),transparent_18%),linear-gradient(180deg,rgba(188,42,30,0.96),rgba(105,22,19,0.96))] px-4 py-3 text-center shadow-[inset_0_1px_0_rgba(255,214,185,0.3),0_0_30px_rgba(224,68,44,0.2)] md:mt-6 md:gap-4 md:rounded-[18px] md:px-8 md:py-5">
        <Star className="h-8 w-8 flex-none fill-[rgb(255,177,91)] text-[rgb(255,177,91)] drop-shadow-[0_0_18px_rgba(255,122,75,0.46)] md:h-14 md:w-14" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase leading-relaxed tracking-[0.12em] text-[rgb(255,236,224)] drop-shadow-[0_2px_2px_rgba(38,12,10,0.6)] sm:tracking-[0.18em] md:text-lg md:tracking-[0.28em]">
            {t(salesCopy.pricing.priceLine)}
          </p>
          <p className="mt-1 text-xs font-semibold text-[rgb(255,232,218)] md:mt-2 md:text-xl">
            {t(salesCopy.pricing.regularLabel)}: <span className="line-through decoration-2">{SALES_COPY.anchorRange}</span>
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-[16px] border border-[rgba(255,245,230,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:mt-5 md:rounded-[18px] md:px-7 md:py-6">
        <div className="space-y-3 md:space-y-4">
          {salesCopy.pricing.highlights.map((item) => (
            <div key={item.en} className="flex items-start gap-3 text-left text-sm font-semibold leading-relaxed text-[rgba(229,225,216,0.9)] md:gap-4 md:text-xl">
              <CircleCheck className="mt-0.5 h-5 w-5 flex-none text-[rgb(233,107,75)] md:h-7 md:w-7" aria-hidden="true" />
              <span>{t(item)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 md:mt-5">
        <OfferCountdown variant="pricing" className="pricing-countdown-reference" />
      </div>

      <div className="mt-4 rounded-[16px] border border-[rgba(255,245,230,0.12)] bg-[linear-gradient(180deg,rgba(91,48,34,0.46),rgba(48,30,24,0.58))] px-4 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:mt-5 md:rounded-[18px] md:px-8 md:py-6">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[rgb(255,203,184)] md:text-base md:tracking-[0.28em]">
          {t(landingCopy.pricing.todayOnly)}
        </p>
        <div className="mt-3 grid items-center gap-3 md:mt-4 md:grid-cols-[1fr_auto_1fr] md:gap-4">
          <div className="mx-auto w-full max-w-[13rem] rounded-[14px] border border-[rgba(255,245,230,0.13)] bg-[rgba(20,14,12,0.28)] px-3 py-3 text-center md:max-w-[15rem] md:rounded-[16px] md:px-4 md:py-4">
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[rgba(229,225,216,0.48)] md:text-xs md:tracking-[0.24em]">
              {t(salesCopy.pricing.regularLabel)}
            </p>
            <p className="mt-1 text-2xl font-black text-[rgb(183,159,150)] line-through decoration-2 decoration-[rgb(183,159,150)] md:mt-2 md:text-4xl">
              {SALES_COPY.anchorRange}
            </p>
          </div>
          <ArrowRight className="mx-auto hidden h-10 w-10 text-[rgb(152,93,72)] md:block" aria-hidden="true" />
          <div className="mx-auto w-full max-w-[13rem] rounded-[14px] border border-[rgba(255,73,54,0.78)] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(245,239,232,0.96))] px-3 py-3 text-center shadow-[0_0_30px_rgba(239,72,50,0.34),inset_0_1px_0_rgba(255,255,255,0.7)] md:max-w-[15rem] md:rounded-[16px] md:px-4 md:py-4 md:shadow-[0_0_34px_rgba(239,72,50,0.42),inset_0_1px_0_rgba(255,255,255,0.7)]">
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[rgb(204,43,31)] md:text-xs md:tracking-[0.24em]">
              {t(salesCopy.pricing.todayLabel)}
            </p>
            <p className="mt-1 text-4xl font-black leading-none text-[rgb(204,43,31)] drop-shadow-[0_3px_0_rgba(127,28,21,0.18)] md:text-6xl">
              {SALES_COPY.bundlePriceLabel}
            </p>
          </div>
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-[14px] border border-[rgba(255,245,230,0.18)] bg-[rgba(255,255,255,0.045)] px-4 py-3 transition-colors hover:bg-[rgba(255,255,255,0.065)] md:mt-5 md:gap-4 md:rounded-[16px] md:px-6 md:py-4">
        <Checkbox checked={isN8nAdded} onCheckedChange={() => toggleN8nInOrder()} className="mt-1 h-5 w-5 border-[rgb(232,94,61)] data-[state=checked]:bg-[rgb(232,94,61)] md:h-6 md:w-6" />
        <span className="flex-1 text-left">
          <span className="block text-sm font-black leading-relaxed text-terminal-foreground md:text-xl">{t(salesCopy.pricing.upsellLabel)}</span>
          <span className="mt-1 block text-xs leading-relaxed text-[rgba(229,225,216,0.76)] md:text-base">{t(salesCopy.pricing.upsellHelper)}</span>
        </span>
      </label>

      <div className="mt-4 flex items-center justify-between rounded-[14px] border border-[rgba(255,245,230,0.14)] bg-[rgba(255,255,255,0.045)] px-4 py-3 text-sm text-[rgba(229,225,216,0.86)] md:mt-5 md:px-6 md:py-4 md:text-xl">
        <span>{t(salesCopy.pricing.totalLabel)}</span>
        <span className="text-2xl font-black text-terminal-foreground md:text-4xl">{orderTotal}</span>
      </div>

      <div className="mx-auto mt-5 grid max-w-[18rem] gap-2 text-center text-[rgba(229,225,216,0.86)] sm:max-w-none sm:grid-cols-2 md:mt-7 md:grid-cols-4 md:items-center md:gap-0">
        {salesCopy.pricing.trustItems.map((item, index) => {
          const Icon = trustIcons[index] ?? ShieldCheck;
          return (
            <div key={item.en} className="flex items-center justify-center gap-2 rounded-lg border border-[rgba(255,245,230,0.1)] bg-[rgba(255,255,255,0.035)] px-3 py-2 text-xs md:gap-3 md:rounded-none md:border-y-0 md:border-r-0 md:bg-transparent md:text-sm md:justify-center md:border-l md:px-3 md:first:border-l-0">
              <Icon className="h-4 w-4 flex-none text-[rgb(241,107,76)] md:h-7 md:w-7" aria-hidden="true" />
              <span>{t(item)}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 text-center md:mt-7">
        <CTAButton
          data-buy-now-cta="true"
          onClick={handlePricingCheckoutClick}
          analyticsLocation="pricing"
          onPointerEnter={warmCheckout}
          onFocus={warmCheckout}
          onTouchStart={warmCheckout}
          disabled={isCheckoutLoading}
          className="sales-cta w-full rounded-[16px] px-4 py-4 text-sm tracking-[0.08em] shadow-[inset_0_1px_0_rgba(255,221,201,0.46),0_0_0_1px_rgba(176,66,47,0.34),0_18px_42px_rgba(163,42,30,0.34),0_0_40px_rgba(223,87,56,0.2)] sm:text-base sm:tracking-[0.12em] md:px-8 md:py-5 md:text-2xl md:tracking-[0.28em]"
        >
          {t(salesCopy.pricing.cta, { total: orderTotal })}
        </CTAButton>
        <div className="mx-auto mt-4 flex max-w-[18rem] flex-col items-center justify-center gap-2 rounded-[14px] border border-[rgba(255,245,230,0.14)] bg-[rgba(255,255,255,0.035)] px-4 py-3 text-center text-xs font-semibold leading-relaxed text-[rgba(229,225,216,0.84)] sm:max-w-none sm:flex-row md:mt-5 md:gap-3 md:text-xl">
          <ShieldCheck className="h-5 w-5 flex-none text-[rgba(229,225,216,0.82)] md:h-6 md:w-6" aria-hidden="true" />
          <span>{t(salesCopy.pricing.trustLine)}</span>
        </div>
      </div>
    </div>
  );

  if (cardOnly) {
    return (
      <section ref={sectionRef} id={sectionId} className={`bg-card px-4 py-10 md:py-16 ${className ?? ""}`} aria-label={t(landingCopy.pricing.bundleName)}>
        <ScrollReveal>{pricingCard}</ScrollReveal>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id={sectionId} className={`bg-card px-4 py-10 md:py-16 ${className ?? ""}`} aria-label={t(landingCopy.pricing.title)}>
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % cat pricing.conf" className={terminalClassName}>
          <h2 className="mb-5 text-2xl font-black leading-tight text-terminal-foreground sm:text-3xl md:mb-9 md:text-5xl">
            {t(landingCopy.pricing.title)}
          </h2>
          {pricingCard}
        </TerminalWindow>
      </ScrollReveal>
    </section>
  );
};

export default PricingSection;
