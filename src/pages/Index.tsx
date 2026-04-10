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

const Index = () => {
  usePageMeta({
    title: "500+ Claude AI Skills Bundle — Automate Your Business",
    description: "Get 500+ pre-built Claude AI skills that handle content, marketing, finance, legal, and operations. One-time $15 purchase. Instant digital delivery.",
    canonical: "https://aicldbase.com/",
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <CheckoutProvider>
        <main>
          <HeroSection />
          <StepsSection />
          <WhatAreSkillsSection />
          <TargetUsersSection />
          <SkillsListSection />
          <PricingSection />
          <UpsellOfferSection />
          <FAQSection />
          <FinalCTASection />
        </main>
      </CheckoutProvider>
      <SiteFooter />
    </div>
  );
};

export default Index;
