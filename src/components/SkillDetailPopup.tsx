import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/translations";

type SkillDetailPopupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
};

const SkillDetailPopup = ({
  open,
  onOpenChange,
  title,
  slug,
  category,
  shortDescription,
}: SkillDetailPopupProps) => {
  const { t, getCategoryLabel } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[60] max-w-xl gap-0 overflow-hidden border-terminal-foreground/10 bg-terminal p-0 text-terminal-foreground shadow-2xl sm:rounded-2xl [&>button]:text-terminal-foreground/60 [&>button]:ring-offset-[hsl(var(--terminal-bg))] [&>button]:hover:bg-terminal-foreground/10 [&>button]:hover:text-terminal-foreground [&>button]:data-[state=open]:bg-transparent">
        <div className="border-b border-terminal-foreground/10 bg-black/20 px-6 py-5">
          <DialogHeader className="text-left">
            <p className="text-[11px] uppercase tracking-[0.24em] text-terminal-foreground/45">
              {t(landingCopy.skillDetail.eyebrow)}
            </p>
            <DialogTitle className="mt-3 text-2xl font-bold text-terminal-foreground md:text-3xl">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-3 flex flex-wrap items-center gap-2 text-left text-terminal-foreground/60">
              <Badge variant="outline" className="border-primary/35 bg-primary/10 text-primary">
                {getCategoryLabel(category)}
              </Badge>
              <code className="rounded-md border border-terminal-foreground/10 bg-black/25 px-2 py-1 text-xs text-terminal-foreground/75">
                {slug}
              </code>
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm leading-7 text-terminal-foreground/82 md:text-base">
            {shortDescription}
          </p>
        </div>

        <div className="flex justify-end border-t border-terminal-foreground/10 bg-black/10 px-6 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="border-terminal-foreground/15 bg-transparent text-terminal-foreground hover:bg-terminal-foreground/10 hover:text-terminal-foreground"
            >
              {t(landingCopy.skillDetail.backButton)}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SkillDetailPopup;