import CTAButton from "./CTAButton";
import OfferCountdown from "./OfferCountdown";
import { useLanguage } from "@/contexts/LanguageContext";
import { salesCopy } from "@/i18n/salesCopy";
import { landingCopy } from "@/i18n/translations";

const HeroSection = () => {
  const { t } = useLanguage();
  const platforms = ["Claude", "Claude Code", "Cowork"];

  return (
    <section id="hero" className="px-4 pb-14 pt-10 text-center md:pb-20 md:pt-16" aria-label={t(landingCopy.hero.title)}>
      <h1 className="mx-auto mb-5 max-w-4xl text-3xl font-bold leading-tight md:mb-6 md:text-6xl">
        {t(landingCopy.hero.title)}
      </h1>
      <p className="mx-auto mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground md:mb-4 md:text-base">
        {t(landingCopy.hero.body, { count: 500 })}
      </p>
      <div className="mb-7 flex flex-wrap items-center justify-center gap-2 md:mb-8">
        {salesCopy.hero.outcomeChips.map((chip) => (
          <span key={chip.en} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-medium text-foreground md:text-xs">
            {t(chip)}
          </span>
        ))}
      </div>
      <div>
        <CTAButton className="min-w-[16rem]" analyticsLocation="hero">
          {t(landingCopy.hero.primaryCta)}
        </CTAButton>
      </div>
      <div className="mt-4">
        <OfferCountdown />
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        {t(landingCopy.hero.helper)}
      </p>
      <div className="mt-8 hidden items-center justify-center gap-3 text-xs text-muted-foreground md:flex">
        <span className="font-medium text-foreground/80">{t(salesCopy.hero.platformsLabel)}</span>
        {platforms.map((platform) => (
          <span key={platform} className="rounded-full border border-border/70 px-3 py-1 text-terminal-foreground/80">
            {platform}
          </span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
