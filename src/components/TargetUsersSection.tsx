import TerminalWindow from "./TerminalWindow";
import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";

const users = [
  { icon: "🚀", title: "Solopreneurs", desc: "Monday you write a blog post. Tuesday a contract. Wednesday ad copy. Every hat, every day — now each one takes minutes." },
  { icon: "💻", title: "Freelancers & Consultants", desc: "Run /scope-of-work before a discovery call. Run /invoice after. The admin that used to eat your evenings fits between meetings." },
  { icon: "🏢", title: "Agency Owners", desc: "Your new ops manager is a folder of skill files. SOPs, onboarding checklists, client reports — generated on demand, formatted on brand." },
  { icon: "💡", title: "Creators & Course Builders", desc: "One skill turns a topic into a full course outline. Another writes your launch email sequence. A third builds the webinar script. Stack them." },
  { icon: "🛒", title: "E-commerce Sellers", desc: "Product descriptions that sell, ad copy that converts, shipping policies that don't sound like a robot wrote them. All from one bundle." },
  { icon: "🎯", title: "Early-Stage Founders", desc: "Pitch deck, financial model, market sizing — the stuff that takes a consultant two weeks. You'll have drafts before lunch." },
];

const TargetUsersSection = () => {
  return (
    <section className="py-16 px-4" aria-label="Who this is for">
      <ScrollReveal>
        <TerminalWindow prompt="claude@skills ~ % cat target-users.md">
          <h2 className="text-2xl md:text-4xl font-bold text-terminal-foreground mb-4">
            Built for People Who Run Things.
          </h2>
          <p className="text-sm text-terminal-foreground/70 mb-8">
            You don't have a content team, a legal department, or a CFO. Now you don't need one.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map((u) => (
              <div
                key={u.title}
                className="border border-terminal-foreground/10 rounded-lg p-5"
              >
                <div className="text-2xl mb-3">{u.icon}</div>
                <h3 className="text-terminal-foreground font-semibold mb-2 text-sm">{u.title}</h3>
                <p className="text-xs text-terminal-foreground/70 leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
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

export default TargetUsersSection;
