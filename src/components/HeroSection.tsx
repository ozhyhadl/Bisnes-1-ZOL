import { motion } from "framer-motion";
import CTAButton from "./CTAButton";

const HeroSection = () => {
  return (
    <section className="pt-10 md:pt-16 pb-14 md:pb-20 text-center px-4">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4"
      >
        50K+ Customers Served
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-block border border-border rounded-full px-5 py-1.5 mb-10"
      >
        <span className="text-sm text-muted-foreground">&gt; AI Avalanche</span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-3xl md:text-6xl font-bold leading-tight mb-6"
      >
        The Ultimate<br />
        <span className="text-primary">Claude Skills Bundle.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed mb-10"
      >
        500+ pre-built skills that turn Claude into your full business operations team. Works across Claude.ai, Claude Code, and Cowork. Content, marketing, finance, legal, ops — handled in seconds.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <CTAButton>Get the Bundle — $15</CTAButton>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-5 text-xs text-muted-foreground"
      >
        One-time purchase • Instant download • 7-day guarantee
      </motion.p>
    </section>
  );
};

export default HeroSection;
