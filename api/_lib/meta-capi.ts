import { createHash } from "node:crypto";

/* ── Meta Conversions API (CAPI) Server Module ─────────────────── */

const META_API_VERSION = "v21.0";
const META_GRAPH_BASE = "https://graph.facebook.com";

type MetaUserData = {
  em?: string | null;
  ph?: string | null;
  country?: string | null;
  client_ip_address?: string | null;
  client_user_agent?: string | null;
  fbc?: string | null;
  fbp?: string | null;
};

type MetaCustomData = {
  value?: number;
  currency?: string;
  content_ids?: string[];
  content_type?: string;
  contents?: Array<{ id: string; quantity: number }>;
};

type MetaEventParams = {
  event_name: string;
  event_id: string;
  event_time?: number;
  event_source_url?: string;
  action_source?: string;
  user_data: MetaUserData;
  custom_data?: MetaCustomData;
};

type MetaApiResponse = {
  events_received?: number;
  messages?: string[];
  fbtrace_id?: string;
};

/* ── Helpers ─────────────────────────────────────────────────────── */

function getMetaPixelId(): string | null {
  return process.env.META_PIXEL_ID ?? null;
}

function getMetaAccessToken(): string | null {
  return process.env.META_ACCESS_TOKEN ?? null;
}

function getMetaTestEventCode(): string | null {
  return process.env.META_TEST_EVENT_CODE ?? null;
}

/**
 * SHA-256 hash for user data parameters (em, ph).
 * Values are lowercased and trimmed before hashing per Meta requirements.
 * IP addresses and user agents are NOT hashed.
 */
export function hashUserParam(value: string): string {
  return createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

function normalizeOptionalValue(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return null;
  }

  const lowerCasedValue = normalizedValue.toLowerCase();
  if (
    lowerCasedValue === "null"
    || lowerCasedValue === "undefined"
    || lowerCasedValue === "unknown"
    || lowerCasedValue === "n/a"
    || lowerCasedValue === "na"
  ) {
    return null;
  }

  return normalizedValue;
}

function normalizeEmail(value: string | null | undefined): string | null {
  const normalizedValue = normalizeOptionalValue(value);
  if (!normalizedValue) {
    return null;
  }

  const normalizedEmail = normalizedValue.toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ? normalizedEmail
    : null;
}

function normalizePhone(value: string | null | undefined): string | null {
  const normalizedValue = normalizeOptionalValue(value);
  if (!normalizedValue) {
    return null;
  }

  const digitsOnlyPhone = normalizedValue.replace(/\D/g, "");
  return digitsOnlyPhone.length >= 7 ? digitsOnlyPhone : null;
}

function normalizeCountry(value: string | null | undefined): string | null {
  const normalizedValue = normalizeOptionalValue(value);
  if (!normalizedValue) {
    return null;
  }

  const normalizedCountry = normalizedValue.toLowerCase();
  return /^[a-z]{2}$/.test(normalizedCountry) ? normalizedCountry : null;
}

function buildUserData(raw: MetaUserData): Record<string, unknown> {
  const userData: Record<string, unknown> = {};

  const normalizedEmail = normalizeEmail(raw.em);
  const normalizedPhone = normalizePhone(raw.ph);
  const normalizedCountry = normalizeCountry(raw.country);
  const normalizedClientIp = normalizeOptionalValue(raw.client_ip_address);
  const normalizedClientUserAgent = normalizeOptionalValue(raw.client_user_agent);
  const normalizedFbc = normalizeOptionalValue(raw.fbc);
  const normalizedFbp = normalizeOptionalValue(raw.fbp);

  if (normalizedEmail) {
    userData.em = [hashUserParam(normalizedEmail)];
  }

  if (normalizedPhone) {
    userData.ph = [hashUserParam(normalizedPhone)];
  }

  if (normalizedCountry) {
    userData.country = [hashUserParam(normalizedCountry)];
  }

  // IP and UA are sent as-is (not hashed)
  if (normalizedClientIp) {
    userData.client_ip_address = normalizedClientIp;
  }

  if (normalizedClientUserAgent) {
    userData.client_user_agent = normalizedClientUserAgent;
  }

  if (normalizedFbc) {
    userData.fbc = normalizedFbc;
  }

  if (normalizedFbp) {
    userData.fbp = normalizedFbp;
  }

  return userData;
}

/* ── Main ────────────────────────────────────────────────────────── */

/**
 * Send a single conversion event to Meta Conversions API.
 * Fire-and-forget: logs errors but never throws.
 */
export async function sendConversionEvent(
  params: MetaEventParams,
): Promise<{ ok: boolean; response?: MetaApiResponse; error?: string }> {
  const pixelId = getMetaPixelId();
  const accessToken = getMetaAccessToken();

  if (!pixelId || !accessToken) {
    const missing = [
      !pixelId && "META_PIXEL_ID",
      !accessToken && "META_ACCESS_TOKEN",
    ].filter(Boolean).join(", ");

    console.warn(`[meta-capi] Skipping event "${params.event_name}": missing env vars (${missing})`);
    return { ok: false, error: `Missing env vars: ${missing}` };
  }

  const eventPayload: Record<string, unknown> = {
    event_name: params.event_name,
    event_time: params.event_time ?? Math.floor(Date.now() / 1000),
    event_id: params.event_id,
    action_source: params.action_source ?? "website",
    user_data: buildUserData(params.user_data),
  };

  if (params.event_source_url) {
    eventPayload.event_source_url = params.event_source_url;
  }

  if (params.custom_data) {
    eventPayload.custom_data = params.custom_data;
  }

  const body: Record<string, unknown> = {
    data: [eventPayload],
  };

  const testEventCode = getMetaTestEventCode();
  if (testEventCode) {
    body.test_event_code = testEventCode;
  }

  const url = `${META_GRAPH_BASE}/${META_API_VERSION}/${pixelId}/events`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
        access_token: accessToken,
      }),
    });

    const responseBody = await response.json().catch(() => ({})) as MetaApiResponse;

    if (!response.ok) {
      console.error(
        `[meta-capi] ${params.event_name} failed (${response.status}):`,
        JSON.stringify(responseBody),
      );
      return { ok: false, error: `HTTP ${response.status}`, response: responseBody };
    }

    console.log(
      `[meta-capi] ${params.event_name} sent (event_id: ${params.event_id}, events_received: ${responseBody.events_received ?? "?"})`,
    );

    return { ok: true, response: responseBody };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[meta-capi] ${params.event_name} network error:`, message);
    return { ok: false, error: message };
  }
}

/* ── Convenience helpers for specific events ─────────────────────── */

export function extractClientIp(
  headers: Record<string, string | string[] | undefined>,
): string | null {
  const forwarded = headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    // Take the first IP (client IP) from the chain
    return forwarded.split(",")[0].trim() || null;
  }

  const realIp = headers["x-real-ip"];
  if (typeof realIp === "string") {
    return realIp.trim() || null;
  }

  return null;
}

export function extractUserAgent(
  headers: Record<string, string | string[] | undefined>,
): string | null {
  const ua = headers["user-agent"];
  return typeof ua === "string" ? ua : null;
}
