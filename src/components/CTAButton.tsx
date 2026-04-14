import { cn } from "@/lib/utils";
import { useCheckout } from "@/contexts/CheckoutContext";
import { scrollToPricingSection } from "@/lib/scroll";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type CTAButtonProps = {
  children: ReactNode;
  className?: string;
  action?: "scroll" | "checkout";
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  disabled?: boolean;
};

const CTAButton = ({ children, className, action = "scroll", onClick, disabled = false }: CTAButtonProps) => {
  const { isCheckoutLoading, openCheckout } = useCheckout();

  const isCheckoutButton = action === "checkout";
  const isDisabled = disabled || (isCheckoutButton && isCheckoutLoading);

  function handleClick(event: Parameters<NonNullable<ButtonHTMLAttributes<HTMLButtonElement>["onClick"]>>[0]) {
    if (onClick) {
      onClick(event);
      return;
    }

    if (isCheckoutButton) {
      void openCheckout();
      return;
    }

    scrollToPricingSection();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-busy={isCheckoutButton && isCheckoutLoading}
      className={cn(
        "inline-block bg-primary text-primary-foreground px-5 py-3 md:px-8 md:py-4 text-xs md:text-sm uppercase tracking-widest font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      {isCheckoutButton && isCheckoutLoading ? "Opening Checkout..." : children}
    </button>
  );
};

export default CTAButton;
