import HeroSection from "@/components/HeroSection";
import StepsSection from "@/components/StepsSection";
import TargetUsersSection from "@/components/TargetUsersSection";
import SkillsListSection from "@/components/SkillsListSection";
import WhatAreSkillsSection from "@/components/WhatAreSkillsSection";
import PricingSection from "@/components/PricingSection";
import UpsellOfferSection from "@/components/UpsellOfferSection";
import FAQSection from "@/components/FAQSection";
import FinalCTASection from "@/components/FinalCTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <StepsSection />
      <TargetUsersSection />
      <SkillsListSection />
      <WhatAreSkillsSection />
      <PricingSection />
      <UpsellOfferSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
};

export default Index;
