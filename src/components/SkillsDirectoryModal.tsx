import { useEffect, useId, useState } from "react";
import { Search } from "lucide-react";

import {
  skillsCategoryCount,
  skillsCount,
  skillsDirectoryCategorySlugs,
  skillsDirectoryEntries,
} from "@/data/skillsDirectory";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const INITIAL_EXPANDED_CATEGORIES = skillsDirectoryEntries.slice(0, 4).map(([categoryName]) => categoryName);

function filterDirectory(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return skillsDirectoryEntries.map(([categoryName, skills]) => ({
      categoryName,
      categorySlug: skillsDirectoryCategorySlugs[categoryName],
      skills,
    }));
  }

  return skillsDirectoryEntries.flatMap(([categoryName, skills]) => {
    const categoryMatch = categoryName.toLowerCase().includes(normalizedQuery);
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
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(INITIAL_EXPANDED_CATEGORIES);
  const searchInputId = useId();

  const filteredDirectory = filterDirectory(query);
  const filteredCategoryNames = filteredDirectory.map(({ categoryName }) => categoryName);
  const filteredCategoryKey = filteredCategoryNames.join("|");
  const matchedSkillsCount = filteredDirectory.reduce((total, category) => total + category.skills.length, 0);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setExpandedCategories(INITIAL_EXPANDED_CATEGORIES);
      return;
    }

    if (query.trim()) {
      setExpandedCategories(filteredCategoryNames);
    }
  }, [open, query, filteredCategoryKey]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="w-full border-terminal-foreground/20 bg-transparent text-xs uppercase tracking-[0.24em] text-terminal-foreground hover:bg-terminal-foreground/10 hover:text-terminal-foreground sm:w-auto"
        >
          Browse All 501 Skills
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[88vh] max-w-5xl gap-0 overflow-hidden border-terminal-foreground/10 bg-terminal p-0 text-terminal-foreground shadow-2xl sm:rounded-2xl [&>button]:text-terminal-foreground/60 [&>button]:ring-offset-[hsl(var(--terminal-bg))] [&>button]:hover:bg-terminal-foreground/10 [&>button]:hover:text-terminal-foreground [&>button]:data-[state=open]:bg-transparent">
        <div className="flex max-h-[88vh] flex-col overflow-hidden">
          <div className="sticky top-0 z-10 border-b border-terminal-foreground/10 bg-terminal/95 backdrop-blur">
            <DialogHeader className="px-6 pb-4 pt-6 text-left">
              <DialogTitle className="text-2xl font-bold text-terminal-foreground md:text-3xl">
                Claude Skills Directory
              </DialogTitle>
              <DialogDescription className="text-sm text-terminal-foreground/65">
                {skillsCategoryCount} categories · {skillsCount} skills
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 pb-5">
              <label htmlFor={searchInputId} className="sr-only">
                Search categories or skill slugs
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-terminal-foreground/35" aria-hidden="true" />
                <Input
                  id={searchInputId}
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search categories or skill slugs"
                  className="h-11 border-terminal-foreground/10 bg-black/20 pl-10 text-terminal-foreground placeholder:text-terminal-foreground/35 focus-visible:ring-primary"
                />
              </div>

              <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-terminal-foreground/45">
                {query.trim()
                  ? `${filteredDirectory.length} categories · ${matchedSkillsCount} matches`
                  : `Browse all ${skillsCount} skills across ${skillsCategoryCount} categories`}
              </p>
            </div>
          </div>

          <div className="overflow-y-auto px-6 pb-6">
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
                            {categoryName}
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
                            <code className="block rounded-lg border border-terminal-foreground/10 bg-black/20 px-3 py-2 text-xs text-terminal-foreground/85 md:text-sm">
                              {skill}
                            </code>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="rounded-2xl border border-dashed border-terminal-foreground/15 bg-black/15 px-6 py-12 text-center">
                <h3 className="text-lg font-semibold text-terminal-foreground">No matches found</h3>
                <p className="mt-2 text-sm text-terminal-foreground/60">
                  Try a category like Finance or a slug like nda-template.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SkillsDirectoryModal;