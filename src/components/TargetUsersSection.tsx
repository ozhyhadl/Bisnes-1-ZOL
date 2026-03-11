import TerminalWindow from "./TerminalWindow";
import CTAButton from "./CTAButton";
import ScrollReveal from "./ScrollReveal";

const users = [
  { icon: "🚀", title: "Solopreneurs", desc: "You're the CEO, marketer, copywriter, and accountant. These skills handle every department so you can focus on growth." },
  { icon: "💻", title: "Freelancers & Consultants", desc: "Proposals, contracts, case studies, invoices — the admin side of client work, done in minutes instead of hours." },
  { icon: "🏢", title: "Agency Owners", desc: "SOPs, onboarding systems, client dashboards, and reporting — systematize your agency without hiring an ops manager." },
  { icon: "💡", title: "Creators & Course Builders", desc: "Blog posts, video scripts, course outlines, email sequences — produce more content with less effort." },
  { icon: "🛒", title: "E-commerce Sellers", desc: "Product descriptions, ad copy, checkout optimization, shipping policies — everything your store needs to convert." },
  { icon: "🎯", title: "Early-Stage Founders", desc: "Business plans, pitch decks, market research, financial forecasts — get investor-ready without a full team." },
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
            If you wear multiple hats and want AI that actually keeps up, this bundle was made for you.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map((u) => (
              <div
                key={u.title}
                className="border border-terminal-foreground/10 rounded-lg p-5"
              >
                <div className="text-2xl mb-3">{u.icon}</div>
                <h3 className="text-terminal-foreground font-semibold mb-2 text-sm">{u.title}</h3>
                <p className="text-xs text-terminal-foreground/60 leading-relaxed">{u.desc}</p>
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
