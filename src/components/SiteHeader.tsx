import { scrollToPricingSection } from "@/lib/scroll";

const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-2 font-bold text-sm tracking-tight" aria-label="AI Cloud Base — Home">
          <span className="text-primary text-lg">⚡</span>
          <span>AI Cloud Base</span>
        </a>
        <button
          type="button"
          onClick={scrollToPricingSection}
          className="text-xs uppercase tracking-wider font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Get the Bundle
        </button>
      </div>
    </header>
  );
};

export default SiteHeader;
