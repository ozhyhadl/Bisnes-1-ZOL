import { PlayCircle } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { salesCopy } from "@/i18n/salesCopy";
import ScrollReveal from "./ScrollReveal";

const DemoVideoSection = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-card px-4 py-14" aria-label={t(salesCopy.demo.title)}>
      <ScrollReveal>
        <div className="mx-auto max-w-5xl rounded-[28px] border border-border/70 bg-[radial-gradient(circle_at_top,rgba(217,119,6,0.18),transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.04),rgba(15,23,42,0.02))] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] md:items-center">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">Demo</p>
              <h2 className="mb-4 text-2xl font-bold md:text-4xl">{t(salesCopy.demo.title)}</h2>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{t(salesCopy.demo.body)}</p>
            </div>
            <div className="rounded-3xl border border-border/70 bg-background/80 p-8 text-center shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
              <PlayCircle className="mx-auto mb-4 h-14 w-14 text-primary" />
              <p className="text-sm font-medium text-foreground">{t(salesCopy.demo.placeholder)}</p>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default DemoVideoSection;
