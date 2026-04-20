import { landingCopy } from "@/i18n/landingCopy";

export type SupportedLanguage = "en" | "es" | "fr" | "de" | "it" | "pt" | "pl" | "hi" | "uk" | "ru";

export type LocalizedText = Record<SupportedLanguage, string>;

export const supportedLanguages: SupportedLanguage[] = ["en", "es", "fr", "de", "it", "pt", "pl", "hi", "uk", "ru"];

export const languageOptions: Array<{ code: SupportedLanguage; nativeLabel: string }> = [
  { code: "en", nativeLabel: "English" },
  { code: "es", nativeLabel: "Español" },
  { code: "fr", nativeLabel: "Français" },
  { code: "de", nativeLabel: "Deutsch" },
  { code: "it", nativeLabel: "Italiano" },
  { code: "pt", nativeLabel: "Português" },
  { code: "pl", nativeLabel: "Polski" },
  { code: "hi", nativeLabel: "हिन्दी" },
  { code: "uk", nativeLabel: "Українська" },
  { code: "ru", nativeLabel: "Русский" },
];

export function translate(localized: LocalizedText, language: SupportedLanguage, vars?: Record<string, string | number>): string {
  const template = localized[language] ?? localized.en;

  if (!vars) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = vars[key];
    return value === undefined ? `{${key}}` : String(value);
  });
}

export { landingCopy };
