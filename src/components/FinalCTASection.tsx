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
          7-Day Money-Back Guarantee — Zero Risk
        </p>
        <h2 className="text-2xl md:text-5xl font-bold mb-6">
          You’re One Download Away From<br />
          <span className="text-primary">Running Your Business Faster.</span>
        </h2>
        <p className="max-w-xl mx-auto text-sm text-muted-foreground mb-10 leading-relaxed">
          500+ skills. Every department covered. If they don’t save you hours in the first week, get a full refund — no questions asked.
        </p>
        <CTAButton>Start Saving Hours Today — $15</CTAButton>
      </ScrollReveal>
    </section>
  );
};

export default FinalCTASection;
