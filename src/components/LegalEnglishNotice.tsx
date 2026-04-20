import { useLanguage } from "@/contexts/LanguageContext";
import { siteCopy } from "@/i18n/siteCopy";

const LegalEnglishNotice = () => {
  const { currentLanguage } = useLanguage();
  const copy = siteCopy[currentLanguage];

  return (
    <div className="mb-10 rounded-xl border border-border/80 bg-card/70 px-4 py-4 text-sm text-muted-foreground">
      <p className="font-semibold text-foreground">{copy.legal.englishNoticeTitle}</p>
      <p className="mt-1 leading-relaxed">{copy.legal.englishNoticeBody}</p>
    </div>
  );
};

export default LegalEnglishNotice;