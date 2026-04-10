import { cn } from "@/lib/utils";
import { useCheckout } from "@/contexts/CheckoutContext";
import { type ReactNode } from "react";

type CTAButtonProps = {
  children: ReactNode;
  className?: string;
};

const CTAButton = ({ children, className }: CTAButtonProps) => {
  const { isCheckoutLoading, openCheckout } = useCheckout();

  return (
    <button
      type="button"
      onClick={() => {
        void openCheckout();
      }}
      disabled={isCheckoutLoading}
      aria-busy={isCheckoutLoading}
      className={cn(
        "inline-block bg-primary text-primary-foreground px-5 py-3 md:px-8 md:py-4 text-xs md:text-sm uppercase tracking-widest font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      {isCheckoutLoading ? "Opening Checkout..." : children}
    </button>
  );
};

export default CTAButton;
