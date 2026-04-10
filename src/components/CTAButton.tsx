import { cn } from "@/lib/utils";
import { useCheckout } from "@/contexts/CheckoutContext";
import { scrollToPricingSection } from "@/lib/scroll";
import { type ReactNode } from "react";

type CTAButtonProps = {
  children: ReactNode;
  className?: string;
  action?: "scroll" | "checkout";
};

const CTAButton = ({ children, className, action = "scroll" }: CTAButtonProps) => {
  const { isCheckoutLoading, openCheckout } = useCheckout();

  const isCheckoutButton = action === "checkout";

  return (
    <button
      type="button"
      onClick={() => {
        if (isCheckoutButton) {
          void openCheckout();
          return;
        }

        scrollToPricingSection();
      }}
      disabled={isCheckoutButton && isCheckoutLoading}
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
