import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/translations";
import LanguageSelector from "./LanguageSelector";
import CTAButton from "./CTAButton";

const SiteHeader = () => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <a href="/" className="flex items-center gap-2 font-bold text-sm tracking-tight" aria-label={t(landingCopy.header.homeAriaLabel)}>
          <span className="text-primary text-lg">⚡</span>
          <span>AI Cloud Base</span>
        </a>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSelector />
          <CTAButton variant="subtle" className="hidden px-4 py-2 text-[11px] md:inline-flex md:px-4 md:py-2 md:text-xs" analyticsLocation="header">
            {t(landingCopy.header.primaryCta)}
          </CTAButton>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
