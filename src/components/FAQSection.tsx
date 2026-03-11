import TerminalWindow from "./TerminalWindow";
import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "What exactly is a Claude skill?", a: "A SKILL.md file you add to Claude. It contains the full workflow for a specific task — the questions to ask you, the framework to apply, and the output format. Example: the SaaS Agreement skill asks about your pricing tiers, liability caps, and refund terms, then outputs a ready-to-sign contract." },
  { q: "Where can I use these skills?", a: "Anywhere Claude runs — Claude.ai, Claude Code, and Cowork. On the web, enable them in Customize > Skills and Claude uses them automatically. In Claude Code, drop them in your skills folder and invoke them with /skill-name or let Claude detect them. You just need an active Claude plan. The skills themselves are a one-time purchase with no recurring fees." },
  { q: "How do I install the skills?", a: "You'll get a download link after purchase with all the skill folders and a quick-start guide. For Claude.ai, upload them in Customize > Skills. For Claude Code, drop them into your ~/.claude/skills/ folder. Either way, it takes about 2 minutes. No coding or technical setup required." },
  { q: "Are these just fancy prompts?", a: "No. A prompt is one question, one answer. A skill is a multi-step system: it interviews you for context, selects the right strategy, generates the deliverable, and formats it for real-world use. You paste the output straight into your workflow — no rewriting needed." },
  { q: "Will these work for my type of business?", a: "The bundle covers content creation, marketing, sales, finance, legal, operations, and strategy. If you run any kind of online business, service business, or creator business, you'll find dozens of skills that apply directly to your day-to-day work." },
  { q: "What if I don't like them?", a: "7-day money-back guarantee. Try every skill. If the output isn't worth your $15, email us and get a full refund. No forms, no calls." },
  { q: "Is this just for solopreneurs?", a: "Solopreneurs get the most leverage, but agency owners use the SOPs and reporting skills, freelancers use the contracts and proposals, and small teams use the ops and onboarding workflows. If your work touches Claude, you'll find skills that fit." },
];

const FAQSection = () => {
  return (
    <section className="py-16 px-4" aria-label="FAQ">
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % man claude-skills">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-8">
            Common Questions, Straight Answers.
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-terminal-foreground/10">
                <AccordionTrigger className="text-sm text-terminal-foreground hover:no-underline text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-terminal-foreground/60 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TerminalWindow>
      </ScrollReveal>
      <ScrollReveal delay={0.2}>
        <div className="text-center mt-10">
          <CTAButton>Get the Bundle — $15</CTAButton>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default FAQSection;
