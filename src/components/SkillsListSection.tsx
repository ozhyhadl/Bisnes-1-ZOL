import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";
import SkillsDirectoryModal from "./SkillsDirectoryModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/translations";
import {
  skillsCategoryCount,
  skillsCount,
  skillsDirectoryEntries,
  skillsDirectoryPreview,
} from "@/data/skillsDirectory";

const categoryIcons: Record<string, string> = {
  "Content & Copywriting": "✍️",
  "Email Marketing & Automation": "✉️",
  "Sales & Funnels": "🚀",
  "Ads & Paid Media": "📈",
  "SEO & Search": "🔎",
  "Finance & Pricing": "💰",
  "Legal & Compliance": "⚖️",
  "Launch & Growth": "🚀",
  "Social Media": "📣",
  "Operations & Systems": "⚙️",
  "AI & Technology": "💻",
  "Branding & Design": "🎨",
  "Courses & Education": "🎓",
  "HR & Team": "👥",
  "Client & Consulting": "🤝",
  "Events & Speaking": "🎤",
  "E-commerce & Products": "🛒",
  "Nonprofit & Community": "🌱",
  "Analytics & Data": "📊",
  "Industry-Specific": "🏢",
};

const getShortCategoryLabel = (category: string) => category
  .replace(" & Copywriting", "")
  .replace(" Marketing & Automation", "")
  .replace(" & Funnels", "")
  .replace(" & Paid Media", "")
  .replace(" & Search", "")
  .replace(" & Pricing", "")
  .replace(" & Compliance", "")
  .replace(" & Growth", "")
  .replace(" Media", "")
  .replace(" & Systems", "")
  .replace("AI & ", "")
  .replace("Branding & ", "")
  .replace("Courses & ", "")
  .replace(" & Team", "")
  .replace(" & Consulting", "")
  .replace(" & Speaking", "")
  .replace("E-commerce & ", "")
  .replace(" & Community", "")
  .replace(" & Data", "")
  .replace("-Specific", "");

const SkillsListSection = () => {
  const { t } = useLanguage();
  const eyebrow = {
    en: "What's inside",
    es: "Qué incluye",
    fr: "Ce qu'il contient",
    de: "Was enthalten ist",
    it: "Cosa include",
    pt: "O que inclui",
    pl: "Co jest w środku",
    hi: "अंदर क्या है",
    uk: "Що всередині",
    ru: "Что внутри",
  };
  const departmentCards = skillsDirectoryPreview.map(({ category }) => {
    const skills = skillsDirectoryEntries.find(([categoryName]) => categoryName === category)?.[1] ?? [];

    return {
      category,
      count: skills.length,
      icon: categoryIcons[category] ?? "📁",
      label: getShortCategoryLabel(category),
    };
  });

  return (
    <section className="bg-card px-4 py-14 md:py-16" aria-label={t(landingCopy.skillsList.title)}>
      <ScrollReveal>
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.26em] text-[rgb(204,109,82)]">
            {t(eyebrow)}
          </p>
          <h2 className="text-2xl font-bold leading-tight text-foreground md:text-4xl">
            {t(landingCopy.skillsList.title)}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t(landingCopy.skillsList.body, { categoriesCount: skillsCategoryCount, skillsCount })}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-2 min-[520px]:grid-cols-4 md:gap-3">
            {departmentCards.map(({ category, count, icon, label }) => (
              <SkillsDirectoryModal
                key={category}
                initialCategory={category}
                trigger={(
                  <button
                    type="button"
                    className="group flex aspect-square w-full flex-col items-center justify-center rounded-lg border border-[rgba(99,69,51,0.13)] bg-[rgba(255,252,248,0.82)] px-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.86),0_8px_20px_rgba(73,50,36,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(204,109,82,0.42)] hover:bg-[rgba(255,250,245,0.96)] hover:shadow-[0_14px_28px_rgba(126,69,48,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:rounded-xl md:px-3"
                    aria-label={`${label}: ${count}+ skills`}
                  >
                    <span className="text-lg transition-transform duration-200 group-hover:scale-110 min-[520px]:text-xl md:text-3xl" aria-hidden="true">
                      {icon}
                    </span>
                    <span className="mt-2 max-w-full text-[10px] font-bold leading-tight text-foreground min-[520px]:text-xs md:mt-4 md:text-base">
                      {label}
                    </span>
                    <span className="mt-1 text-[10px] font-black text-[rgb(204,109,82)] min-[520px]:text-xs md:mt-2 md:text-base">
                      {count}+
                    </span>
                  </button>
                )}
              />
            ))}
          </div>

          <div className="mt-8 flex flex-col items-stretch gap-4 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[20rem] text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:text-xs">
              {t(landingCopy.skillsList.modalHint)}
            </p>
            <SkillsDirectoryModal />
          </div>
        </div>
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
