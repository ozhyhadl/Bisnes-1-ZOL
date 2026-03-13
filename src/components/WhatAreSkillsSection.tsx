import TerminalWindow from "./TerminalWindow";
import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";

const items = [
  { title: "Not prompts.", desc: "A prompt gives you one answer. A skill runs a multi-step workflow: it interviews you for context, picks the right strategy, writes the first draft, and refines it — all in one session." },
  { title: "Works everywhere Claude does.", desc: "Skills work across Claude.ai, Claude Code, and Cowork. On the web, Claude uses them automatically when they're relevant. In Claude Code, you can also invoke them directly with a /slash-command." },
  { title: "Built on an open standard.", desc: "Claude Skills follow the Agent Skills open standard, supported across multiple AI tools. Each skill is a simple folder with a SKILL.md file — no proprietary lock-in, no complicated setup." },
];

const WhatAreSkillsSection = () => {
  return (
    <section className="py-16 px-4" aria-label="What are Claude Skills">
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % cat basics.md">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-6">
            Not Prompts. Not Templates. Structured Skill Systems.
          </h2>
          <p className="text-sm text-terminal-foreground/70 mb-6 leading-relaxed">
            A skill is a SKILL.md file you drop into Claude. It tells Claude exactly how to do a specific job — which questions to ask, which framework to apply (PAS, AIDA, Jobs-to-Be-Done…), and how to format the final deliverable. The output reads like it came from a specialist, not a chatbot.
          </p>
          <div className="space-y-5">
            {items.map((item) => (
              <div key={item.title}>
                <h3 className="text-terminal-foreground font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-terminal-foreground/70 leading-relaxed">{item.desc}</p>
              </div>
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
