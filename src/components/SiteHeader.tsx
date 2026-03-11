import { CHECKOUT_URL } from "@/config/links";

const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-2 font-bold text-sm tracking-tight" aria-label="AI Cloud Base — Home">
          <img src="/logo.png" alt="" width={28} height={17} className="h-5 w-auto" />
          <span>AI Cloud Base</span>
        </a>
        <a
          href={CHECKOUT_URL}
          className="text-xs uppercase tracking-wider font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Get the Bundle
        </a>
      </div>
    </header>
  );
};

export default SiteHeader;
