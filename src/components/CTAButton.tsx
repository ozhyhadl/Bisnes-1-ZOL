import { CHECKOUT_URL } from "@/config/links";

const CTAButton = ({ children, href }: { children: React.ReactNode; href?: string }) => {
  return (
    <a
      href={href ?? CHECKOUT_URL}
      className="inline-block bg-primary text-primary-foreground px-5 py-3 md:px-8 md:py-4 text-xs md:text-sm uppercase tracking-widest font-semibold rounded-lg hover:opacity-90 transition-opacity"
    >
      {children}
    </a>
  );
};

export default CTAButton;
