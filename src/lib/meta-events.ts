/* ── Meta Pixel + CAPI client-side event helpers ────────────────── */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/* ── Event ID ────────────────────────────────────────────────────── */

export function generateEventId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/* ── Cookie readers for fbc / fbp ────────────────────────────────── */

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function getFbc(): string | null {
  return getCookie("_fbc");
}

function getFbp(): string | null {
  return getCookie("_fbp");
}

/* ── CAPI server call ────────────────────────────────────────────── */

async function sendCapiEvent(
  eventName: string,
  eventId: string,
): Promise<void> {
  try {
    await fetch("/api/meta-event", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        fbc: getFbc(),
        fbp: getFbp(),
      }),
    });
  } catch {
    // Fire-and-forget: don't block UX on tracking failures
  }
}

/* ── Pixel helper ────────────────────────────────────────────────── */

function firePixelEvent(
  eventName: string,
  params: Record<string, unknown> | undefined,
  eventId: string,
): void {
  if (typeof window === "undefined" || !window.fbq) return;

  if (params) {
    window.fbq("track", eventName, params, { eventID: eventId });
  } else {
    window.fbq("track", eventName, {}, { eventID: eventId });
  }
}

/* ── Public event functions ──────────────────────────────────────── */

/**
 * Track ViewContent — fires on landing page view.
 * Pixel + CAPI with shared event_id for deduplication.
 */
export function trackViewContent(): void {
  const eventId = generateEventId();

  firePixelEvent("ViewContent", {
    content_name: "AI Cloud Base — Landing Page",
    content_type: "product",
  }, eventId);

  void sendCapiEvent("ViewContent", eventId);
}

/**
 * Track InitiateCheckout — fires when user opens checkout.
 * Pixel + CAPI with shared event_id for deduplication.
 */
export function trackInitiateCheckout(): void {
  const eventId = generateEventId();

  firePixelEvent("InitiateCheckout", {
    content_type: "product",
    currency: "USD",
  }, eventId);

  void sendCapiEvent("InitiateCheckout", eventId);
}

/**
 * Track Purchase — fires Pixel only (CAPI is sent server-side from fulfill.ts).
 * Uses transactionId as event_id for deduplication with server CAPI.
 */
export function trackPurchase(data: {
  transactionId: string;
  value?: number;
  currency?: string;
}): void {
  firePixelEvent("Purchase", {
    value: data.value ?? 0,
    currency: data.currency ?? "USD",
    content_type: "product",
  }, data.transactionId);
}
