import { toast } from "@/components/ui/sonner";
import { getPaddleBillingConfig } from "@/config/billing";
import { getPaddle, openPaddleCheckout, type PaddleCheckoutItem } from "@/lib/paddle";
import { createContext, useContext, useState, type ReactNode } from "react";

type CheckoutContextValue = {
  isN8nAdded: boolean;
  isCheckoutLoading: boolean;
  addN8nToOrder: () => void;
  openCheckout: () => Promise<void>;
};

const noopAsync = async () => {};

const CheckoutContext = createContext<CheckoutContextValue>({
  isN8nAdded: false,
  isCheckoutLoading: false,
  addN8nToOrder: () => {},
  openCheckout: noopAsync,
});

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [isN8nAdded, setIsN8nAdded] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const billingConfig = getPaddleBillingConfig();

  const addN8nToOrder = () => {
    setIsN8nAdded(true);
  };

  const openCheckout = async () => {
    if (isCheckoutLoading) {
      return;
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

      if (isN8nAdded) {
        items.push({
          priceId: billingConfig.n8n.priceId,
          quantity: 1,
        });
      }

      openPaddleCheckout(paddle, items);
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
        openCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
