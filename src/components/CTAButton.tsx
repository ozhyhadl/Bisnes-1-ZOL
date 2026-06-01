import { cn } from "@/lib/utils";
import { scrollToPricingSection } from "@/lib/scroll";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type CTAButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  analyticsLocation?: string;
};

const CTAButton = ({ children, className, onClick, disabled = false, analyticsLocation, ...buttonProps }: CTAButtonProps) => {
  function handleClick(event: Parameters<NonNullable<ButtonHTMLAttributes<HTMLButtonElement>["onClick"]>>[0]) {
    if (analyticsLocation) {
      trackAnalyticsEvent("cta_click", { location: analyticsLocation });
    }

    if (onClick) {
      onClick(event);
      return;
    }

    scrollToPricingSection(analyticsLocation);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      {...buttonProps}
      className={cn(
        "inline-block rounded-lg bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 md:px-8 md:py-4 md:text-sm",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default CTAButton;
