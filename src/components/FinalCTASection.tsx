import CTAButton from "./CTAButton";
import GuaranteeBadge from "./GuaranteeBadge";
import OfferCountdown from "./OfferCountdown";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { salesCopy } from "@/i18n/salesCopy";
import { landingCopy } from "@/i18n/translations";

const FinalCTASection = () => {
  const { t } = useLanguage();

  return (
    <section id="final-cta" className="bg-card px-4 py-20 text-center" aria-label={t(landingCopy.finalCta.title)}>
      <ScrollReveal>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
          {landingCopy.finalCta.command}
        </p>
        <p className="text-sm text-primary font-semibold mb-6">
          {t(landingCopy.finalCta.eyebrow)}
        </p>
        <h2 className="text-2xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto">
          {t(landingCopy.finalCta.title)}
        </h2>
        <p className="max-w-xl mx-auto text-sm text-muted-foreground mb-10 leading-relaxed">
          {t(landingCopy.finalCta.body)}
        </p>
        <div className="mb-5">
          <OfferCountdown className="justify-center" />
        </div>
        <CTAButton analyticsLocation="final-cta">{t(landingCopy.finalCta.cta)}</CTAButton>
        <div className="mt-5">
          <GuaranteeBadge />
        </div>
        <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-muted-foreground">
          {t(salesCopy.finalCta.priceReason)}
        </p>
      </ScrollReveal>
    </section>
  );
};

export default FinalCTASection;
