import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/translations";

const FinalCTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 bg-card text-center" aria-label={t(landingCopy.finalCta.title)}>
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
        <CTAButton>{t(landingCopy.finalCta.cta)}</CTAButton>
      </ScrollReveal>
    </section>
  );
};

export default FinalCTASection;
