import { toast } from "@/components/ui/sonner";
import { getPaddleBillingConfig } from "@/config/billing";
import { getPaddle, openPaddleCheckout, type PaddleCheckoutItem } from "@/lib/paddle";
import { trackInitiateCheckout } from "@/lib/meta-events";
import { createContext, useContext, useState, type ReactNode } from "react";

type CheckoutOpenOptions = {
  includeN8n?: boolean;
  persistN8nSelection?: boolean;
};

type CheckoutContextValue = {
  isN8nAdded: boolean;
  isCheckoutLoading: boolean;
  addN8nToOrder: () => void;
  removeN8nFromOrder: () => void;
  toggleN8nInOrder: () => void;
  openCheckout: (options?: CheckoutOpenOptions) => Promise<void>;
};

const noopAsync = async (_options?: CheckoutOpenOptions) => {};

const CheckoutContext = createContext<CheckoutContextValue>({
  isN8nAdded: false,
  isCheckoutLoading: false,
  addN8nToOrder: () => {},
  removeN8nFromOrder: () => {},
  toggleN8nInOrder: () => {},
  openCheckout: noopAsync,
});

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [isN8nAdded, setIsN8nAdded] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const billingConfig = getPaddleBillingConfig();

  const addN8nToOrder = () => {
    setIsN8nAdded(true);
  };

  const removeN8nFromOrder = () => {
    setIsN8nAdded(false);
  };

  const toggleN8nInOrder = () => {
    setIsN8nAdded((currentValue) => !currentValue);
  };

  const openCheckout = async (options?: CheckoutOpenOptions) => {
    if (isCheckoutLoading) {
      return;
    }

    const includeN8n = options?.includeN8n ?? isN8nAdded;

    if (options?.persistN8nSelection) {
      setIsN8nAdded(includeN8n);
    }

    setIsCheckoutLoading(true);

    try {
      const paddle = await getPaddle();

      if (!paddle) {
        throw new Error("Paddle.js was not initialized.");
      }

      const items: PaddleCheckoutItem[] = [
        {
          priceId: billingConfig.skills.priceId,
          quantity: 1,
        },
      ];

      if (includeN8n) {
        items.push({
          priceId: billingConfig.n8n.priceId,
          quantity: 1,
        });
      }

      openPaddleCheckout(paddle, items);

      // Fire InitiateCheckout after Paddle overlay is opened
      trackInitiateCheckout();
    } catch (error: unknown) {
      console.error("[Paddle] Unable to open checkout.", error);
      toast.error("Unable to open checkout. Please try again.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        isN8nAdded,
        isCheckoutLoading,
        addN8nToOrder,
        removeN8nFromOrder,
        toggleN8nInOrder,
        openCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
