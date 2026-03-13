import TerminalWindow from "./TerminalWindow";
import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";

const steps = [
  { num: "1", title: "Download", desc: "Get the skill files and drop them into your Claude skills folder. Step-by-step setup guide included." },
  { num: "2", title: "Tell Claude what you need", desc: "Claude detects the right skill automatically and walks you through it. Or type /skill-name in Claude Code." },
  { num: "3", title: "Ship it", desc: "Get a finished deliverable — a blog post with meta tags, a contract with liability clauses, a forecast with assumptions documented. Copy, paste, done." },
];

const StepsSection = () => {
  return (
    <section className="py-16 px-4 bg-card" aria-label="How it works">
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % ./install.sh">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-4">
            Up and Running in 2 Minutes.
          </h2>
          <p className="text-sm text-terminal-foreground/70 mb-8 max-w-xl">
            Drop the skill files into Claude, ask for what you need, and get back a finished deliverable — not a rough draft you have to rewrite.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className="bg-terminal/80 border border-terminal-foreground/10 rounded-lg p-5"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold mb-3">
                  {s.num}
                </div>
                <h3 className="text-terminal-foreground font-semibold mb-2">{s.title}</h3>
                <p className="text-xs text-terminal-foreground/70 leading-relaxed">{s.desc}</p>
              </div>
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
