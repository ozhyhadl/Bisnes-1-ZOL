import {
  CheckoutEventNames,
  type PaddleEventData,
  initializePaddle,
  type CheckoutOpenLineItem,
  type CheckoutOpenOptions,
  type Paddle,
} from "@paddle/paddle-js";

import { getPaddleBillingConfig, isSandboxPaddleMode } from "@/config/billing";

const paddleBillingConfig = getPaddleBillingConfig();
export const PADDLE_TRANSACTION_STORAGE_KEY = "aicb:last-paddle-transaction-id";

const DOWNLOAD_ROUTE = "/download";

let paddleInstance: Paddle | null = null;
let paddlePromise: Promise<Paddle | null> | null = null;

export type PaddleCheckoutItem = CheckoutOpenLineItem;

function redirectToDownload(transactionId?: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const targetUrl = new URL(`${window.location.origin}${DOWNLOAD_ROUTE}`);
  if (transactionId) {
    targetUrl.searchParams.set("txn", transactionId);
    window.sessionStorage.setItem(PADDLE_TRANSACTION_STORAGE_KEY, transactionId);
  }

  window.location.assign(targetUrl.toString());
}

function handleCheckoutEvent(event: PaddleEventData): void {
  if (event.name !== CheckoutEventNames.CHECKOUT_COMPLETED) {
    return;
  }

  const transactionId = event.data?.transaction_id;
  redirectToDownload(transactionId);
}

function getPaddleTokenError(): string {
  if (isSandboxPaddleMode()) {
    return "[Paddle] Missing sandbox Paddle token for local checkout testing.";
  }

  return "[Paddle] Missing VITE_PADDLE_CLIENT_TOKEN. Add it in Vercel project env and rebuild the app.";
}

export async function getPaddle(): Promise<Paddle | null> {
  if (paddleInstance) {
    return paddleInstance;
  }

  if (!paddleBillingConfig.token) {
    console.error(getPaddleTokenError());
    return null;
  }

  if (!paddlePromise) {
    paddlePromise = initializePaddle({
      token: paddleBillingConfig.token,
      environment: paddleBillingConfig.mode,
      eventCallback: handleCheckoutEvent,
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
      successUrl: `${window.location.origin}${DOWNLOAD_ROUTE}`,
    },
  };

  paddle.Checkout.open(checkoutOptions);
}