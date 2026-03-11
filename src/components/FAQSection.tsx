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
  { q: "What exactly is a Claude skill?", a: "A skill is a structured SKILL.md file that extends what Claude can do. Each one contains expert-level instructions, proven frameworks, and output templates. When you install a skill, Claude automatically knows when to use it based on your request — or you can invoke it directly with a /slash-command in Claude Code. Think of them as hiring a specialist, not copying a prompt." },
  { q: "Where can I use these skills?", a: "Anywhere Claude runs — Claude.ai, Claude Code, and Cowork. On the web, enable them in Customize > Skills and Claude uses them automatically. In Claude Code, drop them in your skills folder and invoke them with /skill-name or let Claude detect them. You just need an active Claude plan. The skills themselves are a one-time purchase with no recurring fees." },
  { q: "How do I install the skills?", a: "You'll get a download link after purchase with all the skill folders and a quick-start guide. For Claude.ai, upload them in Customize > Skills. For Claude Code, drop them into your ~/.claude/skills/ folder. Either way, it takes about 2 minutes. No coding or technical setup required." },
  { q: "Are these just fancy prompts?", a: "No. Each skill is a structured system that guides Claude through a multi-step process — asking the right questions, applying proven frameworks (like PAS for sales copy or AIDA for ads), and formatting output professionally. They're closer to hiring a specialist than copying a prompt." },
  { q: "Will these work for my type of business?", a: "The bundle covers content creation, marketing, sales, finance, legal, operations, and strategy. If you run any kind of online business, service business, or creator business, you'll find dozens of skills that apply directly to your day-to-day work." },
  { q: "What if I don't like them?", a: "You're covered by a 7-day money-back guarantee. Try every skill in the bundle. If they don't save you real time and effort, email us for a full refund. No hoops, no questions." },
  { q: "Is this just for solopreneurs?", a: "Solopreneurs get the most leverage because they wear every hat. But small teams, agency owners, and freelancers all use the bundle to speed up their workflows. If you use Claude for business, these skills will save you time." },
];

const FAQSection = () => {
  return (
    <section className="py-16 px-4">
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % man claude-skills">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-8">
            Got Questions?
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
