import { Globe } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { type SupportedLanguage, landingCopy } from "@/i18n/translations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguageSelector = () => {
  const { currentLanguage, languageOptions, setLanguage, t } = useLanguage();

  return (
    <div className="w-[9.5rem] sm:w-[10.75rem]">
      <Select
        value={currentLanguage}
        onValueChange={(language) => setLanguage(language as SupportedLanguage, "manual")}
      >
        <SelectTrigger
          aria-label={t(landingCopy.header.languageAriaLabel)}
          className="h-10 border-border bg-background/80 px-3 text-xs font-semibold text-foreground shadow-none ring-offset-background transition-colors hover:bg-background"
        >
          <div className="flex min-w-0 items-center gap-2">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">{t(landingCopy.header.languageLabel)}</span>
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent className="border-border bg-popover/95 backdrop-blur">
          {languageOptions.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              {language.nativeLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;