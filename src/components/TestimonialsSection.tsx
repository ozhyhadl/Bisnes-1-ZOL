import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { testimonials } from "@/data/testimonials";
import { salesCopy } from "@/i18n/salesCopy";
import ScrollReveal from "./ScrollReveal";

const TestimonialsSection = () => {
  const { t } = useLanguage();

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-16" aria-label={t(salesCopy.testimonials.title)}>
      <ScrollReveal>
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">Social proof</p>
            <h2 className="mb-4 text-2xl font-bold md:text-4xl">{t(salesCopy.testimonials.title)}</h2>
            <p className="text-sm text-muted-foreground">{t(salesCopy.testimonials.subtitle)}</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="rounded-2xl border border-border/70 bg-card/70 p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <Avatar className="h-11 w-11 border border-border/70">
                    <AvatarFallback>{testimonial.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-foreground">{testimonial.quote}</p>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/85">{testimonial.result}</p>
              </article>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default TestimonialsSection;
