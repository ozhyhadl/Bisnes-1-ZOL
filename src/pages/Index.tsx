import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import StepsSection from "@/components/StepsSection";
import WhatAreSkillsSection from "@/components/WhatAreSkillsSection";
import TargetUsersSection from "@/components/TargetUsersSection";
import SkillsListSection from "@/components/SkillsListSection";
import PricingSection from "@/components/PricingSection";
import UpsellOfferSection from "@/components/UpsellOfferSection";
import FAQSection from "@/components/FAQSection";
import FinalCTASection from "@/components/FinalCTASection";
import SiteFooter from "@/components/SiteFooter";
import { CheckoutProvider } from "@/contexts/CheckoutContext";
import { usePageMeta } from "@/hooks/usePageMeta";
import { runWhenBrowserIdle } from "@/lib/browser-idle";
import { useEffect } from "react";
import { trackViewContent } from "@/lib/meta-events";

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
      <SiteHeader />
      <main>
        <HeroSection />
        <StepsSection />
        <WhatAreSkillsSection />
        <TargetUsersSection />
        <SkillsListSection />
        <CheckoutProvider>
          <PricingSection />
          <UpsellOfferSection />
        </CheckoutProvider>
        <FAQSection />
        <FinalCTASection />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
