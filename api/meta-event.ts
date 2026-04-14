import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  sendConversionEvent,
  extractClientIp,
  extractUserAgent,
} from "./_lib/meta-capi";

/* ── Allowed event names (client-initiated only) ─────────────────── */

const ALLOWED_EVENTS = new Set(["ViewContent", "InitiateCheckout"]);

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

  if (!eventName || !ALLOWED_EVENTS.has(eventName)) {
    return res.status(400).json({ error: "Invalid or unsupported event_name." });
  }

  if (!eventId || eventId.length > 256) {
    return res.status(400).json({ error: "Missing or invalid event_id." });
  }

  // Extract IP and UA from server-side headers (not from client payload — prevents spoofing)
  const clientIp = extractClientIp(req.headers as Record<string, string | string[] | undefined>);
  const clientUa = extractUserAgent(req.headers as Record<string, string | string[] | undefined>);

  const result = await sendConversionEvent({
    event_name: eventName,
    event_id: eventId,
    event_source_url: eventSourceUrl ?? undefined,
    user_data: {
      client_ip_address: clientIp,
      client_user_agent: clientUa,
      fbc,
      fbp,
    },
  });

  return res.status(result.ok ? 200 : 502).json({
    status: result.ok ? "sent" : "error",
    events_received: result.response?.events_received ?? 0,
  });
}
