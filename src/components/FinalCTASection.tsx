import CTAButton from "./CTAButton";
import GuaranteeBadge from "./GuaranteeBadge";
import OfferCountdown from "./OfferCountdown";
import PricingSection from "./PricingSection";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { salesCopy } from "@/i18n/salesCopy";
import { landingCopy } from "@/i18n/translations";

const FinalCTASection = () => {
  const { t } = useLanguage();

  return (
    <section id="final-cta" className="bg-card px-4 py-16 text-center md:py-18" aria-label={t(landingCopy.finalCta.title)}>
      <ScrollReveal>
        <div className="mx-auto max-w-4xl rounded-[24px] border border-border/80 bg-[linear-gradient(180deg,rgba(255,250,245,0.96),rgba(243,235,226,0.92))] px-3 py-8 shadow-[0_24px_60px_rgba(68,46,33,0.08)] sm:px-6 md:rounded-[30px] md:px-10 md:py-12">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {landingCopy.finalCta.command}
          </p>
          <p className="mb-6 text-sm font-semibold text-primary">
            {t(landingCopy.finalCta.eyebrow)}
          </p>
          <h2 className="mx-auto mb-6 max-w-4xl text-2xl font-bold md:text-5xl">
            {t(landingCopy.finalCta.title)}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {t(landingCopy.finalCta.body)}
          </p>
          <div className="mb-8">
            <PricingSection
              cardOnly
              sectionId="final-pricing"
              className="bg-transparent !px-0 !py-0 md:!py-0"
            />
          </div>
          <div className="mb-5">
            <OfferCountdown className="justify-center" />
          </div>
          <CTAButton className="sales-cta" analyticsLocation="final-cta">{t(landingCopy.finalCta.cta)}</CTAButton>
          <div className="mt-5">
            <GuaranteeBadge />
          </div>
          <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-muted-foreground">
            {t(salesCopy.finalCta.priceReason)}
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default FinalCTASection;
