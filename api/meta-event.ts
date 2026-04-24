import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  sendConversionEvent,
  extractClientIp,
  extractUserAgent,
} from "./_lib/meta-capi.js";
import { collectMetaRequestSignals } from "./_lib/meta-capi-param-builder.js";
import { sendCheckoutStartedTelegramNotification } from "./_lib/telegram.js";

/* ── Allowed event names (client-initiated only) ─────────────────── */

const ALLOWED_EVENTS = new Set(["ViewContent", "InitiateCheckout"]);

type NotificationContext = {
  items?: string[];
  value?: number;
  currency?: string;
};

function parseNotificationContext(value: unknown): NotificationContext | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const maybeItems = Array.isArray((value as { items?: unknown }).items)
    ? (value as { items: unknown[] }).items
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : undefined;

  const maybeValue = typeof (value as { value?: unknown }).value === "number"
    && Number.isFinite((value as { value: number }).value)
    ? (value as { value: number }).value
    : undefined;

  const maybeCurrency = typeof (value as { currency?: unknown }).currency === "string"
    ? (value as { currency: string }).currency.trim() || undefined
    : undefined;

  if (!maybeItems?.length && maybeValue === undefined && !maybeCurrency) {
    return null;
  }

  return {
    items: maybeItems,
    value: maybeValue,
    currency: maybeCurrency,
  };
}

/* ── Handler ─────────────────────────────────────────────────────── */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store");

  const body = typeof req.body === "string"
    ? (() => { try { return JSON.parse(req.body); } catch { return null; } })()
    : req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Invalid request body." });
  }

  const eventName = typeof body.event_name === "string" ? body.event_name : null;
  const eventId = typeof body.event_id === "string" ? body.event_id : null;
  const eventSourceUrl = typeof body.event_source_url === "string" ? body.event_source_url : null;
  const fbc = typeof body.fbc === "string" ? body.fbc : null;
  const fbp = typeof body.fbp === "string" ? body.fbp : null;
  const externalId = typeof body.external_id === "string" ? body.external_id : null;
  const notificationContext = parseNotificationContext((body as { notification_context?: unknown }).notification_context);

  if (!eventName || !ALLOWED_EVENTS.has(eventName)) {
    return res.status(400).json({ error: "Invalid or unsupported event_name." });
  }

  if (!eventId || eventId.length > 256) {
    return res.status(400).json({ error: "Missing or invalid event_id." });
  }

  const fallbackClientIp = extractClientIp(req.headers as Record<string, string | string[] | undefined>);
  const clientUa = extractUserAgent(req.headers as Record<string, string | string[] | undefined>);
  const metaRequestSignals = collectMetaRequestSignals({
    host: typeof req.headers.host === "string" ? req.headers.host : null,
    eventSourceUrl,
    referer: typeof req.headers.referer === "string" ? req.headers.referer : null,
    cookieHeader: typeof req.headers.cookie === "string" ? req.headers.cookie : null,
    xForwardedFor: typeof req.headers["x-forwarded-for"] === "string" ? req.headers["x-forwarded-for"] : null,
    remoteAddress: req.socket?.remoteAddress ?? null,
    fallbackFbc: fbc,
    fallbackFbp: fbp,
    fallbackClientIpAddress: fallbackClientIp,
  });

  const result = await sendConversionEvent({
    event_name: eventName,
    event_id: eventId,
    event_source_url: eventSourceUrl ?? undefined,
    user_data: {
      external_id: externalId,
      client_ip_address: metaRequestSignals.clientIpAddress,
      client_user_agent: clientUa,
      fbc: metaRequestSignals.fbc,
      fbp: metaRequestSignals.fbp,
    },
  });

  if (eventName === "InitiateCheckout") {
    await sendCheckoutStartedTelegramNotification({
      eventName,
      pageUrl: eventSourceUrl,
      eventId,
      items: notificationContext?.items,
      value: notificationContext?.value,
      currency: notificationContext?.currency,
    });
  }

  return res.status(result.ok ? 200 : 502).json({
    status: result.ok ? "sent" : "error",
    events_received: result.response?.events_received ?? 0,
  });
}
