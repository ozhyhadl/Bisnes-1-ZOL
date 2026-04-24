import { cn } from "@/lib/utils";
import { scrollToPricingSection } from "@/lib/scroll";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type CTAButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
};

const CTAButton = ({ children, className, onClick, disabled = false, ...buttonProps }: CTAButtonProps) => {
  function handleClick(event: Parameters<NonNullable<ButtonHTMLAttributes<HTMLButtonElement>["onClick"]>>[0]) {
    if (onClick) {
      onClick(event);
      return;
    }

    scrollToPricingSection();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      {...buttonProps}
      className={cn(
        "inline-block bg-primary text-primary-foreground px-5 py-3 md:px-8 md:py-4 text-xs md:text-sm uppercase tracking-widest font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default CTAButton;
