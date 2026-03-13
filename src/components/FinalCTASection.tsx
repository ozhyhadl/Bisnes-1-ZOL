import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";

const FinalCTASection = () => {
  return (
    <section className="py-20 px-4 bg-card text-center" aria-label="Final call to action">
      <ScrollReveal>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
          claude@skills ~ % sudo get-bundle –now
        </p>
        <p className="text-sm text-primary font-semibold mb-6">
          One-Time Purchase — Instant Access — Yours Forever
        </p>
        <h2 className="text-2xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto">
          One Bundle. Every Department. Deploy and Ship.
        </h2>
        <p className="max-w-xl mx-auto text-sm text-muted-foreground mb-10 leading-relaxed">
          500+ skills that handle the work you keep putting off. Blog posts, contracts, ad campaigns, financial models — finished, not drafted. $15 once, yours forever.
        </p>
        <CTAButton>Get Instant Access — $15</CTAButton>
      </ScrollReveal>
    </section>
  );
};

export default FinalCTASection;
