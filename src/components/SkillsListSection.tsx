import { useState } from "react";

import TerminalWindow from "./TerminalWindow";
import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";
import SkillsDirectoryModal from "./SkillsDirectoryModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/translations";
import {
  skillsCategoryCount,
  skillsCount,
  skillsDirectoryCategorySlugs,
  skillsDirectoryPreview,
} from "@/data/skillsDirectory";

const SkillsListSection = () => {
  const { t } = useLanguage();
  const [showAllMobile, setShowAllMobile] = useState(false);
  const mobilePreview = showAllMobile ? skillsDirectoryPreview : skillsDirectoryPreview.slice(0, 10);

  return (
    <section className="py-16 px-4 bg-card" aria-label={t(landingCopy.skillsList.title)}>
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % ls -la skills/">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-3">
            {t(landingCopy.skillsList.title)}
          </h2>
          <p className="text-sm text-terminal-foreground/70 mb-8 max-w-2xl">
            {t(landingCopy.skillsList.body, { categoriesCount: skillsCategoryCount, skillsCount })}
          </p>
          <div className="hidden gap-2 overflow-x-auto lg:grid lg:grid-cols-2 lg:gap-x-6">
            {skillsDirectoryPreview.map(({ category, samples }, index) => (
              <p
                key={category}
                className="text-[10px] md:text-xs text-terminal-green leading-relaxed whitespace-nowrap md:whitespace-normal"
              >
                <span className="text-terminal-foreground/35">{index === skillsDirectoryPreview.length - 1 ? "└──" : "├──"}</span>{" "}
                <span>📁 {skillsDirectoryCategorySlugs[category]} / {samples.join(", ")} …</span>
              </p>
            ))}
          </div>
          <div className="space-y-2 lg:hidden">
            {mobilePreview.map(({ category, samples }, index) => (
              <p key={category} className="text-[10px] leading-relaxed text-terminal-green">
                <span className="text-terminal-foreground/35">{index === mobilePreview.length - 1 ? "└──" : "├──"}</span>{" "}
                <span>📁 {skillsDirectoryCategorySlugs[category]} / {samples.join(", ")} …</span>
              </p>
            ))}
            {skillsDirectoryPreview.length > 10 ? (
              <button
                type="button"
                onClick={() => setShowAllMobile((current) => !current)}
                className="mt-2 text-xs font-semibold text-primary underline-offset-4 hover:underline"
              >
                {showAllMobile ? "Show fewer skills" : "Show full directory (501)"}
              </button>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col items-stretch gap-4 border-t border-terminal-foreground/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[20rem] text-[10px] uppercase tracking-[0.26em] text-terminal-foreground/45 sm:text-xs">
              {t(landingCopy.skillsList.modalHint)}
            </p>
            <SkillsDirectoryModal />
          </div>
        </TerminalWindow>
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <div className="mt-8 text-center md:mt-9">
          <CTAButton analyticsLocation="skills-list">{t(landingCopy.skillsList.cta)}</CTAButton>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default SkillsListSection;
