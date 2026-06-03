import TerminalWindow from "./TerminalWindow";
import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";
import SkillInstallAnimation from "./SkillInstallAnimation";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/translations";

const StepsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 bg-card" aria-label={t(landingCopy.steps.title)}>
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % ./install.sh">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-4">
            {t(landingCopy.steps.title)}
          </h2>
          <p className="text-sm text-terminal-foreground/70 mb-8 max-w-xl">
            {t(landingCopy.steps.body)}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {landingCopy.steps.items.map((step) => (
              <div
                key={step.num}
                className="bg-terminal/80 border border-terminal-foreground/10 rounded-lg p-5"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold mb-3">
                  {step.num}
                </div>
                <h3 className="text-terminal-foreground font-semibold mb-2">{t(step.title)}</h3>
                <p className="text-xs text-terminal-foreground/70 leading-relaxed">{t(step.desc)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <CTAButton analyticsLocation="steps">{t(landingCopy.steps.cta)}</CTAButton>
          </div>
        </TerminalWindow>
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <div className="text-center mt-10">
          <p className="skill-install-divider">{t(landingCopy.steps.divider)}</p>

          <div className="mt-8">
            <SkillInstallAnimation />
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default StepsSection;
