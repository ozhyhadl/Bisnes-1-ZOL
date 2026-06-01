import { useState } from "react";

import TerminalWindow from "./TerminalWindow";
import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/translations";

const FAQSection = () => {
  const [openItem, setOpenItem] = useState<number | null>(0);
  const { t } = useLanguage();

  function toggleItem(index: number) {
    setOpenItem((currentItem) => currentItem === index ? null : index);
  }

  return (
    <section className="py-16 px-4" aria-label={t(landingCopy.faq.title)}>
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % man claude-skills">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-8">
            {t(landingCopy.faq.title)}
          </h2>
          <div className="w-full">
            {landingCopy.faq.items.map((faq, i) => (
              <div key={faq.q} className="border-b border-terminal-foreground/10">
                <button
                  type="button"
                  onClick={() => toggleItem(i)}
                  aria-expanded={openItem === i}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm text-terminal-foreground"
                >
                  <span>{t(faq.q)}</span>
                  <span
                    aria-hidden="true"
                    className={`shrink-0 text-terminal-foreground/60 transition-transform duration-300 ${openItem === i ? "rotate-45" : "rotate-0"}`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${openItem === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-4 text-xs text-terminal-foreground/70 leading-relaxed">
                      {t(faq.a)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TerminalWindow>
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <div className="text-center mt-10">
          <CTAButton analyticsLocation="faq">{t(landingCopy.faq.cta)}</CTAButton>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default FAQSection;
