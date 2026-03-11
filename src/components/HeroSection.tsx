import CTAButton from "./CTAButton";

const HeroSection = () => {
  return (
    <section className="pt-10 md:pt-16 pb-14 md:pb-20 text-center px-4" aria-label="Hero">
      <div className="inline-block border border-border rounded-full px-5 py-1.5 mb-8">
        <span className="text-sm text-muted-foreground">⚡ AI Cloud Base</span>
      </div>
      <h1 className="text-3xl md:text-6xl font-bold leading-tight mb-6 max-w-3xl mx-auto">
        Stop Prompting. Start Running Your Business.
      </h1>
      <p className="max-w-xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
        500+ ready-made Claude skill files that turn a blank chat into a finished blog post, a signed contract, or a 90-day marketing plan — before your coffee gets cold.
      </p>
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/70 mb-8">
        <span>★★★★★ 4.9/5</span>
        <span className="text-border">|</span>
        <span>1,200+ buyers</span>
        <span className="text-border">|</span>
        <span>Works in Claude.ai, Code &amp; Cowork</span>
      </div>
      <div>
        <CTAButton>Get Instant Access — $15</CTAButton>
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        One-time purchase · Instant download · 7-day money-back guarantee
      </p>
    </section>
  );
};

export default HeroSection;
