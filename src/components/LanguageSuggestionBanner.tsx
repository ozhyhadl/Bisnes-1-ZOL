import { X } from "lucide-react";

import { useLanguage, landingCopy } from "@/contexts/LanguageContext";

const LanguageSuggestionBanner = () => {
  const {
    showSuggestionBanner,
    suggestedLanguage,
    translateFor,
    setLanguage,
    stayInEnglish,
  } = useLanguage();

  if (!showSuggestionBanner || !suggestedLanguage) {
    return null;
  }

  return (
    <div className="border-b border-primary/15 bg-[linear-gradient(180deg,rgba(255,251,247,0.98),rgba(247,239,231,0.95))] px-4 py-3 shadow-[0_10px_28px_rgba(191,101,61,0.08)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 pr-6 sm:pr-0">
          <p className="text-sm font-semibold text-foreground">
            {translateFor(landingCopy.banner.title, suggestedLanguage)}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {translateFor(landingCopy.banner.description, suggestedLanguage)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguage(suggestedLanguage, "switch")}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            {translateFor(landingCopy.banner.switchAction, suggestedLanguage)}
          </button>
          <button
            type="button"
            onClick={stayInEnglish}
            className="rounded-lg border border-border bg-background/70 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-background"
          >
            {translateFor(landingCopy.banner.stayInEnglish, suggestedLanguage)}
          </button>
        </div>

        <button
          type="button"
          onClick={stayInEnglish}
          className="absolute right-4 top-3 rounded-md p-2 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground sm:static"
          aria-label={translateFor(landingCopy.banner.dismissAriaLabel, suggestedLanguage)}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default LanguageSuggestionBanner;