import { SUPPORT_EMAIL } from "@/config/links";

const SiteFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-terminal text-terminal-foreground/70 py-10 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-terminal-foreground font-bold text-sm">
          <span className="text-primary text-lg">⚡</span>
          <span>AI Cloud Base</span>
        </div>
        <p className="text-xs leading-relaxed max-w-md mx-auto">
          Pre-built Claude AI skills for solopreneurs, freelancers, and small teams. Automate every department of your business.
        </p>
        <div className="flex items-center justify-center gap-6 text-xs">
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-terminal-foreground transition-colors">
            Contact
          </a>
          <span className="text-terminal-foreground/20">|</span>
          <span>Instant Digital Delivery</span>
          <span className="text-terminal-foreground/20">|</span>
          <a href="/privacy" className="hover:text-terminal-foreground transition-colors">
            Privacy
          </a>
          <span className="text-terminal-foreground/20">|</span>
          <a href="/terms" className="hover:text-terminal-foreground transition-colors">
            Terms
          </a>
        </div>
        <p className="text-[10px] text-terminal-foreground/70 pt-2">
          &copy; {currentYear} AI Cloud Base. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
