import TerminalWindow from "./TerminalWindow";
import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";
import SkillsDirectoryModal from "./SkillsDirectoryModal";
import {
  skillsCategoryCount,
  skillsCount,
  skillsDirectoryCategorySlugs,
  skillsDirectoryPreview,
} from "@/data/skillsDirectory";

const SkillsListSection = () => {
  return (
    <section className="py-16 px-4 bg-card" aria-label="Skills catalog">
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % ls -la skills/">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-3">
            Every Department. One Bundle.
          </h2>
          <p className="text-sm text-terminal-foreground/70 mb-8 max-w-2xl">
            {skillsCategoryCount} categories. {skillsCount} skills. Pick a folder, run a skill, get a deliverable. Browse the full directory below.
          </p>
          <div className="grid gap-2 overflow-x-auto lg:grid-cols-2 lg:gap-x-6">
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

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs uppercase tracking-[0.24em] text-terminal-foreground/45">
              Full catalog available in modal directory
            </p>
            <SkillsDirectoryModal />
          </div>
        </TerminalWindow>
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <div className="text-center mt-10">
          <CTAButton>Unlock All 501 Skills — $15</CTAButton>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default SkillsListSection;
