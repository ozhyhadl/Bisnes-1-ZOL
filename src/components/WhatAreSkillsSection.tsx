import TerminalWindow from "./TerminalWindow";
import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/translations";

const WhatAreSkillsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4" aria-label={t(landingCopy.whatAreSkills.title)}>
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % cat basics.md">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-6">
            {t(landingCopy.whatAreSkills.title)}
          </h2>
          <p className="text-sm text-terminal-foreground/70 mb-6 leading-relaxed">
            {t(landingCopy.whatAreSkills.body)}
          </p>
          <div className="space-y-5">
            {landingCopy.whatAreSkills.items.map((item) => (
              <div key={item.title}>
                <h3 className="text-terminal-foreground font-semibold text-sm mb-1">{t(item.title)}</h3>
                <p className="text-xs text-terminal-foreground/70 leading-relaxed">{t(item.desc)}</p>
              </div>
            ))}
          </div>
        </TerminalWindow>
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <div className="text-center mt-10">
          <CTAButton>{t(landingCopy.whatAreSkills.cta)}</CTAButton>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default WhatAreSkillsSection;
