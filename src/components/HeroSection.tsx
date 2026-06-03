import CTAButton from "./CTAButton";
import OfferCountdown from "./OfferCountdown";
import { useLanguage } from "@/contexts/LanguageContext";
import { salesCopy } from "@/i18n/salesCopy";
import { landingCopy } from "@/i18n/translations";
import { SALES_CONFIG } from "@/lib/sales";
import { CreditCard, Download, FileText, Mail, ShieldCheck } from "lucide-react";

const HeroSection = () => {
  const { t } = useLanguage();
  const platforms = ["Claude", "Claude Code", "Cowork"];
  const chipIcons = [FileText, FileText, Mail] as const;
  const trustIcons = [CreditCard, Download, ShieldCheck] as const;
  const titleParts = t(landingCopy.hero.title).split(/(500\+)/);

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-[#fff7f3] px-4 pb-10 pt-8 md:pb-12 md:pt-8"
      aria-label={t(landingCopy.hero.title)}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_28%,rgba(255,111,65,0.18),transparent_34%),radial-gradient(circle_at_35%_20%,rgba(255,132,94,0.1),transparent_28%),linear-gradient(180deg,rgba(255,250,247,0.98),rgba(255,246,241,0.96)_58%,rgba(255,244,238,0.96))]" />
      <div className="mx-auto max-w-6xl">
        <div className="relative z-20 mx-auto mb-8 max-w-[62rem] rounded-[18px] border border-[rgba(255,79,54,0.5)] bg-[linear-gradient(180deg,rgba(255,73,45,1),rgba(226,45,31,1))] px-5 py-3 text-center shadow-[inset_0_1px_0_rgba(255,226,209,0.34),0_18px_42px_rgba(214,49,33,0.28),0_0_48px_rgba(255,75,44,0.18)] md:px-7 md:py-4">
          <p className="text-sm font-black leading-relaxed tracking-normal text-primary-foreground drop-shadow-[0_1px_1px_rgba(93,24,18,0.34)] md:text-base">
            {t(salesCopy.hero.limitedOfferBanner, { count: SALES_CONFIG.skillsCount, price: SALES_CONFIG.bundlePrice })}
          </p>
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mx-auto max-w-4xl text-[2.35rem] font-black leading-[1.08] tracking-normal text-foreground md:text-[3.15rem] lg:text-[3.7rem]">
            {titleParts.map((part, index) => (
              part === "500+"
                ? <span key={`${part}-${index}`} className="text-[rgb(255,63,34)]">{part}</span>
                : <span key={`${part}-${index}`}>{part}</span>
            ))}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm font-medium leading-relaxed text-foreground/76 md:text-base">
            {t(landingCopy.hero.body, { count: 500 })}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {salesCopy.hero.outcomeChips.map((chip, index) => {
              const Icon = chipIcons[index] ?? FileText;
              return (
                <span key={chip.en} className="inline-flex items-center gap-2 rounded-full border border-[rgba(220,119,78,0.28)] bg-[rgba(255,250,245,0.72)] px-4 py-2 text-xs font-bold text-foreground/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_20px_rgba(126,58,36,0.12)] md:text-sm">
                  <Icon className="h-4 w-4 text-foreground/86" aria-hidden="true" />
                  {t(chip)}
                </span>
              );
            })}
          </div>

          <div className="mx-auto mt-6 max-w-[28rem]">
            <img
              src="/claude-skills-bundle-preview.png"
              alt="500+ Claude Skills Ultimate Bundle"
              className="w-full rounded-[18px] border border-[rgba(220,119,78,0.22)] bg-[rgba(255,250,246,0.76)] shadow-[0_16px_38px_rgba(126,58,36,0.13)]"
              loading="eager"
              decoding="async"
            />
          </div>

          <div className="mt-7">
            <CTAButton className="sales-cta min-w-[18rem] rounded-[18px] px-8 py-5 text-base tracking-[0.2em] md:min-w-[27rem] md:text-xl md:tracking-[0.24em]" analyticsLocation="hero">
              {t(landingCopy.hero.primaryCta)}
            </CTAButton>
          </div>

          <div className="mx-auto mt-6 max-w-[32rem]">
            <OfferCountdown variant="hero" className="hero-countdown-reference" />
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-semibold text-foreground/82">
            {salesCopy.hero.trustItems.map((item, index) => {
              const Icon = trustIcons[index] ?? ShieldCheck;
              return (
                <span key={item.en} className="inline-flex items-center gap-2">
                  <Icon className="h-5 w-5 text-foreground/88" aria-hidden="true" />
                  {t(item)}
                </span>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="font-bold text-foreground/88">{t(salesCopy.hero.platformsLabel)}</span>
            {platforms.map((platform) => (
              <span key={platform} className="rounded-full border border-border/80 bg-background/82 px-4 py-2 text-foreground/75 shadow-[0_6px_18px_rgba(54,42,31,0.08)]">
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
