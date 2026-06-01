import { useEffect, useState } from "react";

import CTAButton from "@/components/CTAButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { salesCopy } from "@/i18n/salesCopy";

const StickyMobileCTA = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleScroll = () => {
      const pricingRect = document.getElementById("pricing")?.getBoundingClientRect();
      const finalRect = document.getElementById("final-cta")?.getBoundingClientRect();
      const heroBottom = document.getElementById("hero")?.getBoundingClientRect().bottom ?? 0;
      const viewportHeight = window.innerHeight;

      const pricingVisible = pricingRect ? pricingRect.top < viewportHeight && pricingRect.bottom > 0 : false;
      const finalVisible = finalRect ? finalRect.top < viewportHeight && finalRect.bottom > 0 : false;
      const heroGone = heroBottom < 80;

      setIsVisible(heroGone && !pricingVisible && !finalVisible);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
      <div className="rounded-2xl border border-border/70 bg-background/95 p-3 shadow-[0_16px_44px_rgba(15,23,42,0.22)] backdrop-blur">
        <CTAButton className="w-full py-3 text-[11px]" analyticsLocation="sticky-mobile">
          {t(salesCopy.hero.stickyCta)}
        </CTAButton>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
