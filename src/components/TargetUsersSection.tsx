import TerminalWindow from "./TerminalWindow";
import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/translations";

const TargetUsersSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4" aria-label={t(landingCopy.targetUsers.title)}>
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % cat target-users.md">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-4">
            {t(landingCopy.targetUsers.title)}
          </h2>
          <p className="text-sm text-terminal-foreground/70 mb-8">
            {t(landingCopy.targetUsers.body)}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {landingCopy.targetUsers.users.slice(0, 3).map((user) => (
              <div
                key={user.icon}
                className="border border-terminal-foreground/10 rounded-lg p-5"
              >
                <div className="text-2xl mb-3">{user.icon}</div>
                <h3 className="text-terminal-foreground font-semibold mb-2 text-sm">{t(user.title)}</h3>
                <p className="text-xs text-terminal-foreground/70 leading-relaxed">{t(user.desc)}</p>
              </div>
            ))}
          </div>
        </TerminalWindow>
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <div className="text-center mt-10">
          <CTAButton analyticsLocation="target-users">{t(landingCopy.targetUsers.cta)}</CTAButton>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default TargetUsersSection;
