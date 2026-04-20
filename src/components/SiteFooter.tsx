import { SUPPORT_EMAIL } from "@/config/links";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/translations";

const SiteFooter = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-terminal text-terminal-foreground/70 py-10 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-terminal-foreground font-bold text-sm">
          <span className="text-primary text-lg">⚡</span>
          <span>AI Cloud Base</span>
        </div>
        <p className="text-xs leading-relaxed max-w-md mx-auto">
          {t(landingCopy.footer.body)}
        </p>
        <div className="flex items-center justify-center gap-6 text-xs">
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-terminal-foreground transition-colors">
            {t(landingCopy.footer.contact)}
          </a>
          <span className="text-terminal-foreground/20">|</span>
          <span>{t(landingCopy.footer.delivery)}</span>
          <span className="text-terminal-foreground/20">|</span>
          <a href="/privacy" className="hover:text-terminal-foreground transition-colors">
            {t(landingCopy.footer.privacy)}
          </a>
          <span className="text-terminal-foreground/20">|</span>
          <a href="/terms" className="hover:text-terminal-foreground transition-colors">
            {t(landingCopy.footer.terms)}
          </a>
        </div>
        <p className="text-[10px] text-terminal-foreground/70 pt-2">
          {t(landingCopy.footer.rights, { year: currentYear })}
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
