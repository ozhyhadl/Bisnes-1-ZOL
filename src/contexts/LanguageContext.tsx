import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { skillsDirectoryCategorySlugs } from "@/data/skillsDirectory";
import { languageOptions, landingCopy, supportedLanguages, translate, type LocalizedText, type SupportedLanguage } from "@/i18n/translations";

type LanguageDecision = "switch" | "stay" | "manual";

type StoredPreference = {
  language: SupportedLanguage;
  decision: LanguageDecision;
};

type LanguageContextValue = {
  currentLanguage: SupportedLanguage;
  suggestedLanguage: SupportedLanguage | null;
  showSuggestionBanner: boolean;
  setLanguage: (language: SupportedLanguage, decision?: LanguageDecision) => void;
  stayInEnglish: () => void;
  t: (localized: LocalizedText, vars?: Record<string, string | number>) => string;
  translateFor: (localized: LocalizedText, language: SupportedLanguage, vars?: Record<string, string | number>) => string;
  getCategoryLabel: (categoryName: string) => string;
  languageOptions: Array<{ code: SupportedLanguage; nativeLabel: string }>;
};

const STORAGE_KEY = "aicldbase.languagePreference";

const languageMap: Record<string, SupportedLanguage> = {
  en: "en",
  "en-us": "en",
  "en-gb": "en",
  es: "es",
  "es-es": "es",
  "es-mx": "es",
  fr: "fr",
  "fr-fr": "fr",
  de: "de",
  "de-de": "de",
  it: "it",
  "it-it": "it",
  pt: "pt",
  "pt-pt": "pt",
  "pt-br": "pt",
  pl: "pl",
  "pl-pl": "pl",
  hi: "hi",
  "hi-in": "hi",
  uk: "uk",
  "uk-ua": "uk",
  ru: "ru",
  "ru-ru": "ru",
};

function resolveLanguageCode(locale: string | undefined | null): SupportedLanguage | null {
  if (!locale) return null;
  const normalized = locale.toLowerCase();
  return languageMap[normalized] ?? languageMap[normalized.split("-")[0]] ?? null;
}

export function detectPreferredLanguage(locales: readonly string[]): SupportedLanguage | null {
  for (const locale of locales) {
    const matched = resolveLanguageCode(locale);
    if (matched) {
      return matched;
    }
  }

  return null;
}

function readStoredPreference(): StoredPreference | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPreference;

    if (!supportedLanguages.includes(parsed.language)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeStoredPreference(preference: StoredPreference): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
}

const defaultContext: LanguageContextValue = {
  currentLanguage: "en",
  suggestedLanguage: null,
  showSuggestionBanner: false,
  setLanguage: () => {},
  stayInEnglish: () => {},
  t: (localized, vars) => translate(localized, "en", vars),
  translateFor: (localized, language, vars) => translate(localized, language, vars),
  getCategoryLabel: (categoryName) => categoryName,
  languageOptions,
};

const LanguageContext = createContext<LanguageContextValue>(defaultContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("en");
  const [suggestedLanguage, setSuggestedLanguage] = useState<SupportedLanguage | null>(null);
  const [showSuggestionBanner, setShowSuggestionBanner] = useState(false);

  useEffect(() => {
    const stored = readStoredPreference();

    if (stored) {
      setCurrentLanguage(stored.language);
      setSuggestedLanguage(null);
      setShowSuggestionBanner(false);
      return;
    }

    const preferred = detectPreferredLanguage([
      ...(typeof navigator !== "undefined" ? navigator.languages ?? [] : []),
      typeof navigator !== "undefined" ? navigator.language : "",
    ]);

    if (preferred && preferred !== "en") {
      setSuggestedLanguage(preferred);
      setShowSuggestionBanner(true);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  const setLanguage = (language: SupportedLanguage, decision: LanguageDecision = "manual") => {
    setCurrentLanguage(language);
    setSuggestedLanguage(null);
    setShowSuggestionBanner(false);
    writeStoredPreference({ language, decision });
  };

  const stayInEnglish = () => {
    setLanguage("en", "stay");
  };

  const value: LanguageContextValue = {
    currentLanguage,
    suggestedLanguage,
    showSuggestionBanner,
    setLanguage,
    stayInEnglish,
    t: (localized, vars) => translate(localized, currentLanguage, vars),
    translateFor: (localized, language, vars) => translate(localized, language, vars),
    getCategoryLabel: (categoryName) => {
      const slug = skillsDirectoryCategorySlugs[categoryName as keyof typeof skillsDirectoryCategorySlugs];
      const localized = landingCopy.categories?.items?.[slug as keyof typeof landingCopy.categories.items];
      return localized ? translate(localized as LocalizedText, currentLanguage) : categoryName;
    },
    languageOptions,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);

export { landingCopy };