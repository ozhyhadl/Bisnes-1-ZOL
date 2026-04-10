import {
  initializePaddle,
  type CheckoutOpenLineItem,
  type CheckoutOpenOptions,
  type Paddle,
} from "@paddle/paddle-js";

const PADDLE_ENVIRONMENT = "production" as const;
const PADDLE_CLIENT_TOKEN = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;

let paddleInstance: Paddle | null = null;
let paddlePromise: Promise<Paddle | null> | null = null;

export type PaddleCheckoutItem = CheckoutOpenLineItem;

function getPaddleTokenError(): string {
  return "[Paddle] Missing VITE_PADDLE_CLIENT_TOKEN. Add it in Vercel project env and rebuild the app.";
}

export async function getPaddle(): Promise<Paddle | null> {
  if (paddleInstance) {
    return paddleInstance;
  }

  if (!PADDLE_CLIENT_TOKEN) {
    console.error(getPaddleTokenError());
    return null;
  }

  if (!paddlePromise) {
    paddlePromise = initializePaddle({
      token: PADDLE_CLIENT_TOKEN,
      environment: PADDLE_ENVIRONMENT,
    })
      .then((instance) => {
        if (!instance) {
          console.error("[Paddle] initializePaddle() returned no instance.");
          return null;
        }

        paddleInstance = instance;
        return instance;
      })
      .catch((error: unknown) => {
        console.error("[Paddle] Failed to initialize Paddle.js.", error);
        paddlePromise = null;
        return null;
      });
  }

  return paddlePromise;
}

export function openPaddleCheckout(paddle: Paddle, items: CheckoutOpenLineItem[]): void {
  if (items.length === 0) {
    throw new Error("[Paddle] Cannot open checkout without items.");
  }

  const checkoutOptions: CheckoutOpenOptions = {
    items,
    settings: {
      displayMode: "overlay",
      successUrl: `${window.location.origin}/?checkout=success`,
    },
  };

  paddle.Checkout.open(checkoutOptions);
}