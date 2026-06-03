import { cn } from "@/lib/utils";
import { scrollToPricingSection } from "@/lib/scroll";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type CTAButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  analyticsLocation?: string;
  variant?: "primary" | "subtle";
};

const CTAButton = ({ children, className, onClick, disabled = false, analyticsLocation, variant = "primary", ...buttonProps }: CTAButtonProps) => {
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
        "inline-flex items-center justify-center rounded-[14px] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] antialiased transition-[box-shadow,background-color,border-color,color,opacity,transform] duration-300 disabled:cursor-not-allowed disabled:opacity-70 md:px-8 md:py-4 md:text-sm",
        variant === "primary"
          ? "border border-[rgba(157,30,23,0.72)] bg-[linear-gradient(180deg,rgba(255,70,45,1),rgba(207,36,29,1))] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,226,209,0.48),0_0_0_1px_rgba(207,36,29,0.34),0_18px_36px_rgba(142,28,24,0.32),0_0_34px_rgba(255,60,38,0.26)] hover:-translate-y-0.5 hover:border-[rgba(183,32,24,0.82)] hover:bg-[linear-gradient(180deg,rgba(255,84,54,1),rgba(224,40,31,1))] hover:shadow-[inset_0_1px_0_rgba(255,235,222,0.54),0_0_0_1px_rgba(224,40,31,0.42),0_22px_42px_rgba(142,28,24,0.38),0_0_48px_rgba(255,60,38,0.34)] active:translate-y-0 active:shadow-[inset_0_2px_6px_rgba(94,20,17,0.24),0_10px_24px_rgba(142,28,24,0.28)]"
          : "border border-border/80 bg-background/78 text-foreground shadow-[0_8px_20px_rgba(54,42,31,0.08)] hover:border-primary/28 hover:bg-background/96 hover:text-foreground",
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default CTAButton;
