import CTAButton from "./CTAButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/translations";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="pt-10 md:pt-16 pb-14 md:pb-20 text-center px-4" aria-label={t(landingCopy.hero.title)}>
      <div className="inline-block border border-border rounded-full px-5 py-1.5 mb-8">
        <span className="text-sm text-muted-foreground">⚡ AI Cloud Base</span>
      </div>
      <h1 className="text-3xl md:text-6xl font-bold leading-tight mb-6 max-w-3xl mx-auto">
        {t(landingCopy.hero.title)}
      </h1>
      <p className="max-w-xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
        {t(landingCopy.hero.body, { count: 500 })}
      </p>
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-8">
        <span>{t(landingCopy.hero.trust.rating, { rating: "4.9/5" })}</span>
        <span className="text-border">|</span>
        <span>{t(landingCopy.hero.trust.buyers, { count: "1,200" })}</span>
        <span className="text-border">|</span>
        <span>{t(landingCopy.hero.trust.compatibility)}</span>
      </div>
      <div>
          <CTAButton>{t(landingCopy.hero.primaryCta)}</CTAButton>
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        {t(landingCopy.hero.helper)}
      </p>
    </section>
  );
};

export default HeroSection;
