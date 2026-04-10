import { CHECKOUT_URL } from "@/config/links";
import { cn } from "@/lib/utils";
import { getPaddle, openDefaultPaddleCheckout } from "@/lib/paddle";

type CTAButtonProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
};

const CTAButton = ({ children, href, className }: CTAButtonProps) => {
  const fallbackHref = href ?? CHECKOUT_URL;

  const handleGetInstantAccess = async () => {
    const paddle = await getPaddle();

    if (!paddle) {
      console.error("[Paddle] Checkout is unavailable because Paddle.js was not initialized.");

      if (fallbackHref) {
        window.location.assign(fallbackHref);
      }

      return;
    }

    const checkoutOpened = openDefaultPaddleCheckout(paddle);

    if (!checkoutOpened && fallbackHref) {
      console.log(`[Paddle] Falling back to ${fallbackHref} until a real Paddle priceId is configured.`);
      window.location.assign(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGetInstantAccess}
      className={cn(
        "inline-block bg-primary text-primary-foreground px-5 py-3 md:px-8 md:py-4 text-xs md:text-sm uppercase tracking-widest font-semibold rounded-lg hover:opacity-90 transition-opacity",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default CTAButton;
