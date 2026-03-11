import { motion } from "framer-motion";
import CTAButton from "./CTAButton";

const HeroSection = () => {
  return (
    <section className="pt-10 md:pt-16 pb-14 md:pb-20 text-center px-4" aria-label="Hero">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-block border border-border rounded-full px-5 py-1.5 mb-8"
      >
        <span className="text-sm text-muted-foreground">⚡ AI Cloud Base</span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-3xl md:text-6xl font-bold leading-tight mb-6"
      >
        Stop Prompting. Start<br />
        <span className="text-primary">Running Your Business.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="max-w-xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed mb-4"
      >
        500+ ready-made Claude skill files that handle your content, marketing, finance, legal, and ops — so you can focus on growth, not prompt engineering.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center justify-center gap-4 text-xs text-muted-foreground/70 mb-8"
      >
        <span>★★★★★ 4.9/5</span>
        <span className="text-border">|</span>
        <span>1,200+ buyers</span>
        <span className="text-border">|</span>
        <span>Works in Claude.ai, Code &amp; Cowork</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <CTAButton>Get Instant Access — $15</CTAButton>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-5 text-xs text-muted-foreground"
      >
        One-time purchase · Instant download · 7-day money-back guarantee
      </motion.p>
    </section>
  );
};

export default HeroSection;
