import { Suspense, lazy, useEffect, useId, useMemo, useState } from "react";
import { Search, X } from "lucide-react";

import {
  skillsCategoryCount,
  skillsCount,
  skillsDirectoryCategorySlugs,
  skillsDirectoryEntries,
} from "@/data/skillsDirectory";
import type { SkillSlug } from "@/data/skillsMetadata";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/translations";

const SkillDetailPopup = lazy(() => import("./SkillDetailPopup"));

type SkillsMetadataMap = typeof import("@/data/skillsMetadata").skillsMetadata;

const INITIAL_EXPANDED_CATEGORIES: string[] = [];

function filterDirectory(query: string, getCategoryLabel: (categoryName: string) => string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return skillsDirectoryEntries.map(([categoryName, skills]) => ({
      categoryName,
      categorySlug: skillsDirectoryCategorySlugs[categoryName],
      skills,
    }));
  }

  return skillsDirectoryEntries.flatMap(([categoryName, skills]) => {
    const categoryLabel = getCategoryLabel(categoryName);
    const categoryMatch = categoryName.toLowerCase().includes(normalizedQuery) || categoryLabel.toLowerCase().includes(normalizedQuery);
    const matchedSkills = skills.filter((skill) => skill.toLowerCase().includes(normalizedQuery));

    if (categoryMatch) {
      return [{
        categoryName,
        categorySlug: skillsDirectoryCategorySlugs[categoryName],
        skills,
      }];
    }

    if (matchedSkills.length > 0) {
      return [{
        categoryName,
        categorySlug: skillsDirectoryCategorySlugs[categoryName],
        skills: matchedSkills,
      }];
    }

    return [];
  });
}

const SkillsDirectoryModal = () => {
  const { t, getCategoryLabel } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(INITIAL_EXPANDED_CATEGORIES);
  const [selectedSkillSlug, setSelectedSkillSlug] = useState<SkillSlug | null>(null);
  const [skillsMetadata, setSkillsMetadata] = useState<SkillsMetadataMap | null>(null);
  const searchInputId = useId();

  const filteredDirectory = useMemo(() => filterDirectory(query, getCategoryLabel), [query, getCategoryLabel]);
  const filteredCategoryNames = useMemo(
    () => filteredDirectory.map(({ categoryName }) => categoryName),
    [filteredDirectory],
  );
  const filteredCategoryKey = filteredCategoryNames.join("|");
  const matchedSkillsCount = filteredDirectory.reduce((total, category) => total + category.skills.length, 0);

  useEffect(() => {
    if (!open || skillsMetadata) {
      return;
    }

    let isMounted = true;

    void import("@/data/skillsMetadata").then((module) => {
      if (isMounted) {
        setSkillsMetadata(module.skillsMetadata);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [open, skillsMetadata]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setExpandedCategories(INITIAL_EXPANDED_CATEGORIES);
      setSelectedSkillSlug(null);
      return;
    }

    if (query.trim()) {
      setExpandedCategories(filteredCategoryNames);
    }
  }, [open, query, filteredCategoryKey, filteredCategoryNames]);

  const selectedSkill = selectedSkillSlug ? skillsMetadata?.[selectedSkillSlug] ?? null : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="h-11 w-full rounded-xl border-primary/40 bg-[linear-gradient(180deg,rgba(13,11,10,0.88),rgba(28,22,19,0.92))] px-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-terminal-foreground shadow-[0_14px_26px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.05),inset_0_0_0_1px_rgba(191,101,61,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/65 hover:bg-[linear-gradient(180deg,rgba(26,21,18,0.96),rgba(43,31,25,0.96))] hover:text-primary-foreground hover:shadow-[0_18px_32px_rgba(0,0,0,0.28),0_0_0_1px_rgba(191,101,61,0.16),inset_0_1px_0_rgba(255,255,255,0.06)] focus-visible:ring-primary focus-visible:ring-offset-[hsl(var(--terminal-bg))] sm:min-w-[16.5rem] sm:w-auto"
        >
          {t(landingCopy.directoryModal.trigger)}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[88vh] max-w-5xl gap-0 overflow-hidden border-terminal-foreground/10 bg-terminal p-0 text-terminal-foreground shadow-2xl sm:rounded-2xl [&>button]:hidden">
        <div className="flex max-h-[88vh] flex-col overflow-hidden">
          <div className="sticky top-0 z-10 border-b border-terminal-foreground/10 bg-terminal/95 backdrop-blur">
            <div className="flex items-start justify-between gap-4 px-4 pb-4 pt-4 sm:px-6 sm:pt-6">
              <DialogHeader className="min-w-0 flex-1 text-left">
                <DialogTitle className="text-2xl font-bold text-terminal-foreground md:text-3xl">
                  {t(landingCopy.directoryModal.title)}
                </DialogTitle>
                <DialogDescription className="text-sm text-terminal-foreground/65">
                  {t(landingCopy.directoryModal.summary, { categoriesCount: skillsCategoryCount, skillsCount })}
                </DialogDescription>
              </DialogHeader>

              <DialogClose asChild>
                <button
                  type="button"
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-terminal-foreground/15 bg-black/20 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-terminal-foreground transition-colors hover:border-terminal-foreground/30 hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--terminal-bg))]"
                  aria-label={t(landingCopy.directoryModal.closeAriaLabel)}
                >
                  <span className="hidden sm:inline">{t(landingCopy.directoryModal.close)}</span>
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </DialogClose>
            </div>

            <div className="px-4 pb-4 sm:px-6 sm:pb-5">
              <label htmlFor={searchInputId} className="sr-only">
                {t(landingCopy.directoryModal.searchLabel)}
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-terminal-foreground/35" aria-hidden="true" />
                <Input
                  id={searchInputId}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t(landingCopy.directoryModal.searchPlaceholder)}
                  className="h-11 border-terminal-foreground/10 bg-black/20 pl-10 text-terminal-foreground placeholder:text-terminal-foreground/35 focus-visible:ring-primary"
                />
              </div>

              <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-terminal-foreground/45">
                {query.trim()
                  ? t(landingCopy.directoryModal.searchResultsHint, { categoriesCount: filteredDirectory.length, matchesCount: matchedSkillsCount })
                  : t(landingCopy.directoryModal.browseAllHint, { skillsCount, categoriesCount: skillsCategoryCount })}
              </p>
            </div>
          </div>

          <div className="overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
            {filteredDirectory.length > 0 ? (
              <Accordion
                type="multiple"
                value={expandedCategories}
                onValueChange={setExpandedCategories}
                className="space-y-3"
              >
                {filteredDirectory.map(({ categoryName, categorySlug, skills }) => (
                  <AccordionItem
                    key={categoryName}
                    value={categoryName}
                    className="rounded-2xl border border-terminal-foreground/10 bg-black/15 px-4"
                  >
                    <AccordionTrigger className="items-center gap-4 py-4 text-left hover:no-underline">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                          <span className="text-sm font-semibold text-terminal-foreground md:text-base">
                            {getCategoryLabel(categoryName)}
                          </span>
                          <span className="text-[11px] uppercase tracking-[0.22em] text-terminal-foreground/40">
                            {categorySlug}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className="shrink-0 border-primary/35 bg-primary/10 text-primary"
                      >
                        {skills.length}
                      </Badge>
                    </AccordionTrigger>

                    <AccordionContent className="pb-5">
                      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        {skills.map((skill) => (
                          <li key={skill}>
                            <button
                              type="button"
                              onClick={() => setSelectedSkillSlug(skill as SkillSlug)}
                              className="block w-full rounded-lg border border-terminal-foreground/10 bg-black/20 px-3 py-2 text-left text-xs text-terminal-foreground/85 transition-colors hover:border-primary/35 hover:bg-primary/10 hover:text-terminal-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--terminal-bg))] md:text-sm"
                              aria-label={t(landingCopy.directoryModal.openDetailsAria, { title: skillsMetadata?.[skill as SkillSlug]?.title ?? skill })}
                            >
                              <code>{skill}</code>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="rounded-2xl border border-dashed border-terminal-foreground/15 bg-black/15 px-6 py-12 text-center">
                <h3 className="text-lg font-semibold text-terminal-foreground">{t(landingCopy.directoryModal.noMatchesTitle)}</h3>
                <p className="mt-2 text-sm text-terminal-foreground/60">
                  {t(landingCopy.directoryModal.noMatchesBody)}
                </p>
              </div>
            )}
          </div>
        </div>

        <Suspense fallback={null}>
          <SkillDetailPopup
            open={Boolean(selectedSkillSlug && selectedSkill)}
            onOpenChange={(nextOpen) => {
              if (!nextOpen) {
                setSelectedSkillSlug(null);
              }
            }}
            title={selectedSkill?.title ?? ""}
            slug={selectedSkillSlug ?? ""}
            category={selectedSkill?.category ?? ""}
            shortDescription={selectedSkill?.shortDescription ?? ""}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default SkillsDirectoryModal;