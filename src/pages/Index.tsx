import DeferredSection from "@/components/DeferredSection";
import DemoVideoSection from "@/components/DemoVideoSection";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import ForceSalePopup from "@/components/ForceSalePopup";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import StepsSection from "@/components/StepsSection";
import WhatAreSkillsSection from "@/components/WhatAreSkillsSection";
import TargetUsersSection from "@/components/TargetUsersSection";
import PricingSection from "@/components/PricingSection";
import LanguageSuggestionBanner from "@/components/LanguageSuggestionBanner";
import SampleOutputSection from "@/components/SampleOutputSection";
import SiteFooter from "@/components/SiteFooter";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import TestimonialsSection from "@/components/TestimonialsSection";
import { CheckoutProvider } from "@/contexts/CheckoutContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { runWhenBrowserIdle } from "@/lib/browser-idle";
import { lazy, useEffect } from "react";
import { trackViewContent } from "@/lib/meta-events";

const SkillsListSection = lazy(() => import("@/components/SkillsListSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const FinalCTASection = lazy(() => import("@/components/FinalCTASection"));

const skillsListFallback = (
  <section className="bg-card px-4 py-16" aria-hidden="true">
    <div className="mx-auto h-[29rem] max-w-3xl rounded-xl border border-border/60 bg-card/35 shadow-sm" />
  </section>
);

const faqFallback = (
  <section className="px-4 py-16" aria-hidden="true">
    <div className="mx-auto h-[30rem] max-w-3xl rounded-xl border border-border/60 bg-card/35 shadow-sm" />
  </section>
);

const finalCtaFallback = (
  <section className="bg-card px-4 py-20" aria-hidden="true">
    <div className="mx-auto h-[20rem] max-w-4xl rounded-2xl border border-border/60 bg-card/35 shadow-sm" />
  </section>
);

const Index = () => {
  usePageMeta({
    title: "500+ Claude AI Skills Bundle — Automate Your Business",
    description: "Get 500+ pre-built Claude AI skills that handle content, marketing, finance, legal, and operations. One-time $15 purchase. Instant digital delivery.",
    canonical: "https://aicldbase.com/",
  });

  useEffect(() => {
    return runWhenBrowserIdle(() => {
      trackViewContent();
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <LanguageSuggestionBanner />
      <CheckoutProvider>
        <SiteHeader />
        <main>
          <HeroSection />
          <WhatAreSkillsSection />
          <StepsSection />
          <TargetUsersSection />
          <DeferredSection
            component={SkillsListSection}
            fallback={skillsListFallback}
            rootMargin="900px 0px"
            idleTimeout={2200}
          />
          <SampleOutputSection />
          <DemoVideoSection />
          <TestimonialsSection />
          <PricingSection />
          <DeferredSection
            component={FAQSection}
            fallback={faqFallback}
            rootMargin="900px 0px"
            idleTimeout={2600}
          />
          <DeferredSection
            component={FinalCTASection}
            fallback={finalCtaFallback}
            rootMargin="900px 0px"
            idleTimeout={3000}
          />
        </main>
        <StickyMobileCTA />
        <ForceSalePopup />
        <ExitIntentPopup />
      </CheckoutProvider>
      <SiteFooter />
    </div>
  );
};

export default Index;
