import type { VercelRequest, VercelResponse } from "@vercel/node";

const ALLOWED_EVENTS = new Set([
  "cta_click",
  "upsell_toggle",
  "popup_force_sale_shown",
  "popup_force_sale_cta_click",
  "scroll_to_pricing",
  "purchase_initiated",
  "purchase_completed",
  "offer_expired",
  "exit_intent_shown",
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = typeof req.body === "string"
    ? (() => {
        try {
          return JSON.parse(req.body);
        } catch {
          return null;
        }
      })()
    : req.body;

  const event = typeof body?.event === "string" ? body.event : null;

  if (!event || !ALLOWED_EVENTS.has(event)) {
    return res.status(400).json({ error: "Invalid event" });
  }

  return res.status(204).end();
}
