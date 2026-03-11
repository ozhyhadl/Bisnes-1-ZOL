import { motion } from "framer-motion";
import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";

const FinalCTASection = () => {
  return (
    <section className="py-20 px-4 bg-card text-center">
      <ScrollReveal>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
          claude@skills ~ % sudo get-bundle –now
        </p>
        <p className="text-sm text-primary font-semibold mb-6">
          7-Day Try Everything Guarantee
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-2xl md:text-5xl font-bold mb-6"
        >
          Run Your Business at<br />Command Speed.
        </motion.h2>
        <p className="max-w-xl mx-auto text-sm text-muted-foreground mb-10 leading-relaxed">
          500+ skills. Every department covered. One command away. If they don't save you hours in the first week, get your money back.
        </p>
        <CTAButton>Start Saving Hours Today — $15</CTAButton>
      </ScrollReveal>
    </section>
  );
};

export default FinalCTASection;
