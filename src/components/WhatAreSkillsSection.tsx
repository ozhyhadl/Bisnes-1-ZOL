import { motion } from "framer-motion";
import TerminalWindow from "./TerminalWindow";
import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";

const items = [
  { title: "Not prompts.", desc: "A prompt is a one-off question. A skill is a structured system that guides Claude through a multi-step process — asking the right questions, applying proven frameworks, and formatting output professionally." },
  { title: "Works everywhere Claude does.", desc: "Skills work across Claude.ai, Claude Code, and Cowork. On the web, Claude uses them automatically when they're relevant. In Claude Code, you can also invoke them directly with a /slash-command." },
  { title: "Built on an open standard.", desc: "Claude Skills follow the Agent Skills open standard, supported across multiple AI tools. Each skill is a simple folder with a SKILL.md file — no proprietary lock-in, no complicated setup." },
];

const WhatAreSkillsSection = () => {
  return (
    <section className="py-16 px-4">
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % cat basics.md">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-6">
            What Are Claude Skills?
          </h2>
          <p className="text-sm text-terminal-foreground/70 mb-6 leading-relaxed">
            Skills are structured instruction files that extend what Claude can do. Each skill contains expert-level frameworks, step-by-step processes, and output templates — so Claude delivers polished, professional results instead of generic AI output.
          </p>
          <div className="space-y-5">
            {items.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                <h3 className="text-terminal-foreground font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-terminal-foreground/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </TerminalWindow>
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <div className="text-center mt-10">
          <CTAButton>Try Skills Risk-Free — $15</CTAButton>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default WhatAreSkillsSection;
