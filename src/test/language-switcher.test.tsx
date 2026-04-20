import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import SiteHeader from "@/components/SiteHeader";
import LanguageSuggestionBanner from "@/components/LanguageSuggestionBanner";
import { LanguageProvider, detectPreferredLanguage, useLanguage } from "@/contexts/LanguageContext";
import { landingCopy, translate } from "@/i18n/translations";

const STORAGE_KEY = "aicldbase.languagePreference";

function LanguageProbe() {
  const { currentLanguage } = useLanguage();

  return <div data-testid="current-language">{currentLanguage}</div>;
}

function renderLanguageUi() {
  return render(
    <LanguageProvider>
      <LanguageSuggestionBanner />
      <LanguageProbe />
    </LanguageProvider>,
  );
}

describe("language switcher", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = "en";
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      value: "en-US",
    });
    Object.defineProperty(window.navigator, "languages", {
      configurable: true,
      value: ["en-US", "en"],
    });
  });

  it("detects the first supported preferred browser language", () => {
    expect(detectPreferredLanguage(["zh-CN", "ru-RU", "en-US"])).toBe("ru");
    expect(detectPreferredLanguage(["zh-CN", "ja-JP"])).toBeNull();
  });

  it("suggests a localized switch without auto-switching and persists stay-in-english", async () => {
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      value: "es-ES",
    });
    Object.defineProperty(window.navigator, "languages", {
      configurable: true,
      value: ["es-ES", "en-US"],
    });

    renderLanguageUi();

    expect(screen.getByTestId("current-language")).toHaveTextContent("en");
    expect(screen.getByText(translate(landingCopy.banner.title, "es"))).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: translate(landingCopy.banner.stayInEnglish, "es") }));

    await waitFor(() => {
      expect(screen.queryByText(translate(landingCopy.banner.title, "es"))).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("current-language")).toHaveTextContent("en");
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify({ language: "en", decision: "stay" }));
    expect(document.documentElement.lang).toBe("en");
  });

  it("switches to the suggested language and respects a stored preference on reload", async () => {
    Object.defineProperty(window.navigator, "language", {
      configurable: true,
      value: "ru-RU",
    });
    Object.defineProperty(window.navigator, "languages", {
      configurable: true,
      value: ["ru-RU", "en-US"],
    });

    const { unmount } = renderLanguageUi();

    fireEvent.click(screen.getByRole("button", { name: translate(landingCopy.banner.switchAction, "ru") }));

    await waitFor(() => {
      expect(screen.getByTestId("current-language")).toHaveTextContent("ru");
    });

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify({ language: "ru", decision: "switch" }));
    expect(document.documentElement.lang).toBe("ru");

    unmount();

    renderLanguageUi();

    expect(screen.queryByText(translate(landingCopy.banner.title, "ru"))).not.toBeInTheDocument();
    expect(screen.getByTestId("current-language")).toHaveTextContent("ru");
  });

  it("shows the stored language in the top header selector", () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ language: "ru", decision: "manual" }));

    render(
      <LanguageProvider>
        <SiteHeader />
        <LanguageProbe />
      </LanguageProvider>,
    );

    const selector = screen.getByRole("combobox", {
      name: translate(landingCopy.header.languageAriaLabel, "ru"),
    });

    expect(selector).toHaveTextContent("Русский");
    expect(screen.getByTestId("current-language")).toHaveTextContent("ru");
  });
});