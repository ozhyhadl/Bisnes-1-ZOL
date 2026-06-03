type AnalyticsEventName =
  | "cta_click"
  | "upsell_toggle"
  | "popup_force_sale_shown"
  | "popup_force_sale_cta_click"
  | "scroll_to_pricing"
  | "purchase_initiated"
  | "purchase_completed"
  | "offer_expired"
  | "exit_intent_shown";

type AnalyticsPayload = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function canTrackInBrowser(): boolean {
  return typeof window !== "undefined";
}

async function sendAnalyticsEvent(event: AnalyticsEventName, payload?: AnalyticsPayload): Promise<void> {
  if (!canTrackInBrowser()) {
    return;
  }

  const body = JSON.stringify({
    event,
    payload,
    url: window.location.href,
    ts: Date.now(),
  });

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics-event", blob);
      return;
    }

    await fetch("/api/analytics-event", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body,
    });
  } catch {
    // Ignore analytics transport failures.
  }
}

export function trackAnalyticsEvent(event: AnalyticsEventName, payload?: AnalyticsPayload): void {
  if (!canTrackInBrowser()) {
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
  void sendAnalyticsEvent(event, payload);
}
