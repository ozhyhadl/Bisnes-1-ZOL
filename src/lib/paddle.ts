import {
  CheckoutEventNames,
  type PaddleEventData,
  initializePaddle,
  type CheckoutOpenLineItem,
  type CheckoutOpenOptions,
  type Paddle,
} from "@paddle/paddle-js";

import { getPaddleBillingConfig } from "@/config/billing";
import { trackPurchase } from "@/lib/meta-events";

const paddleBillingConfig = getPaddleBillingConfig();
export const PADDLE_FULFILLMENT_ACCESS_TOKEN_STORAGE_KEY = "aicb:last-fulfillment-access-token";
export const PADDLE_PENDING_FULFILLMENT_CLAIM_STORAGE_KEY = "aicb:pending-fulfillment-claim";
export const PADDLE_PENDING_FULFILLMENT_TXN_STORAGE_KEY = "aicb:pending-fulfillment-txn";
const FULFILLMENT_ACCESS_TOKEN_QUERY_PARAM = "access";
const FULFILLMENT_ACCESS_TOKEN_PREFIX = "fac_";

const DOWNLOAD_ROUTE = "/download";

let paddleInstance: Paddle | null = null;
let paddlePromise: Promise<Paddle | null> | null = null;

export type PaddleCheckoutItem = CheckoutOpenLineItem;

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function createFulfillmentAccessToken(): string {
  const cryptoApi = globalThis.crypto;

  if (!cryptoApi?.getRandomValues) {
    throw new Error("[Paddle] Secure random generator is unavailable in this browser.");
  }

  const bytes = new Uint8Array(24);
  cryptoApi.getRandomValues(bytes);

  return `${FULFILLMENT_ACCESS_TOKEN_PREFIX}${toHex(bytes)}`;
}

function storeFulfillmentAccessToken(accessToken: string): void {
  window.sessionStorage.setItem(
    PADDLE_FULFILLMENT_ACCESS_TOKEN_STORAGE_KEY,
    accessToken,
  );
}

function storePendingFulfillmentClaim(accessToken: string): void {
  window.sessionStorage.setItem(
    PADDLE_PENDING_FULFILLMENT_CLAIM_STORAGE_KEY,
    accessToken,
  );
}

function readStoredFulfillmentAccessToken(): string | null {
  return window.sessionStorage.getItem(PADDLE_FULFILLMENT_ACCESS_TOKEN_STORAGE_KEY);
}

export function readPendingFulfillmentClaimAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(PADDLE_PENDING_FULFILLMENT_CLAIM_STORAGE_KEY);
}

export function clearPendingFulfillmentClaimAccessToken(accessToken?: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const pendingAccessToken = readPendingFulfillmentClaimAccessToken();
  if (!pendingAccessToken) {
    return;
  }

  if (!accessToken || pendingAccessToken === accessToken) {
    window.sessionStorage.removeItem(PADDLE_PENDING_FULFILLMENT_CLAIM_STORAGE_KEY);
  }
}

export function readPendingFulfillmentTransactionId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(PADDLE_PENDING_FULFILLMENT_TXN_STORAGE_KEY);
}

export function clearPendingFulfillmentTransactionId(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(PADDLE_PENDING_FULFILLMENT_TXN_STORAGE_KEY);
}

function storePendingFulfillmentTransactionId(transactionId: string): void {
  window.sessionStorage.setItem(
    PADDLE_PENDING_FULFILLMENT_TXN_STORAGE_KEY,
    transactionId,
  );
}

function extractFulfillmentAccessToken(customData: unknown): string | null {
  if (!customData || typeof customData !== "object" || Array.isArray(customData)) {
    return null;
  }

  const accessToken = (customData as Record<string, unknown>).fulfillment_access_token;
  return typeof accessToken === "string" && accessToken.length > 0
    ? accessToken
    : null;
}

export async function claimFulfillmentAccess(
  transactionId: string,
  accessToken: string,
): Promise<void> {
  const res = await fetch("/api/fulfill", {
    method: "POST",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transactionId,
      accessToken,
    }),
  });

  if (res.ok) {
    return;
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  const bodyText = await res.text().catch(() => "");
  throw new Error(bodyText || `Request failed (${res.status})`);
}

function buildDownloadUrl(accessToken: string): string {
  const targetUrl = new URL(`${window.location.origin}${DOWNLOAD_ROUTE}`);
  targetUrl.searchParams.set(FULFILLMENT_ACCESS_TOKEN_QUERY_PARAM, accessToken);
  return targetUrl.toString();
}

function handleCheckoutEvent(event: PaddleEventData): void {
  if (event.name !== CheckoutEventNames.CHECKOUT_COMPLETED) {
    return;
  }

  const transactionId = event.data?.transaction_id;
  const accessToken = extractFulfillmentAccessToken(event.data?.custom_data) ??
    readStoredFulfillmentAccessToken();

  if (!transactionId || !accessToken) {
    return;
  }

  // Fire Pixel Purchase event (CAPI Purchase is fired server-side in fulfill.ts)
  // Uses transactionId as event_id for deduplication
  trackPurchase({ transactionId });

  storePendingFulfillmentTransactionId(transactionId);

  void claimFulfillmentAccess(transactionId, accessToken)
    .then(() => {
      clearPendingFulfillmentClaimAccessToken(accessToken);
      clearPendingFulfillmentTransactionId();
    })
    .catch((error: unknown) => {
      console.error("[Paddle] Failed to claim secure fulfillment access.", error);
    });
}

function getPaddleTokenError(): string {
  const envName = paddleBillingConfig.mode === "sandbox"
    ? "VITE_PADDLE_CLIENT_TOKEN_SANDBOX"
    : "VITE_PADDLE_CLIENT_TOKEN";

  return `[Paddle] Missing ${envName}. Set it in env and restart / rebuild.`;
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

  const accessToken = createFulfillmentAccessToken();
  storeFulfillmentAccessToken(accessToken);
  storePendingFulfillmentClaim(accessToken);

  const checkoutOptions: CheckoutOpenOptions = {
    items,
    customData: {
      fulfillment_access_token: accessToken,
    },
    settings: {
      displayMode: "overlay",
      successUrl: buildDownloadUrl(accessToken),
    },
  };

  paddle.Checkout.open(checkoutOptions);
}