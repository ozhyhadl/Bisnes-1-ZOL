import { motion } from "framer-motion";
import TerminalWindow from "./TerminalWindow";
import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";

const steps = [
  { num: "1", title: "Download", desc: "Grab the skill files and drop them into your skills folder. One-click setup guide included." },
  { num: "2", title: "Ask Claude", desc: "Just describe what you need. Claude automatically detects the right skill and walks you through it. Or type /skill-name in Claude Code." },
  { num: "3", title: "Done", desc: "Get polished, ready-to-use output. No prompt engineering required." },
];

const StepsSection = () => {
  return (
    <section className="py-16 px-4 bg-card">
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % ./install.sh">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-4">
            Up and Running in 2 Minutes.
          </h2>
          <p className="text-sm text-terminal-foreground/70 mb-8 max-w-xl">
            The Claude Skills Ultimate Bundle gives you 500+ pre-built skills that handle real business tasks — structured systems that produce polished, ready-to-use output every time.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-terminal/80 border border-terminal-foreground/10 rounded-lg p-5"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold mb-3">
                  {s.num}
                </div>
                <h3 className="text-terminal-foreground font-semibold mb-2">{s.title}</h3>
                <p className="text-xs text-terminal-foreground/60 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </TerminalWindow>
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <div className="text-center mt-10">
          <CTAButton>Set Up in 2 Minutes — $15</CTAButton>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default StepsSection;
