import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type DeliveryTokenRow = {
  transaction_id: string;
  file_key: string;
  label: string;
  bucket: string;
  storage_path: string;
  filename: string;
  delivery_token: string;
  download_attempts: number;
  successful_downloads: number;
  max_successful_downloads: number;
  last_download_at: string | null;
  used_by_ip: string | null;
  user_agent: string | null;
  delivery_status: "active" | "limit_exceeded" | "manual_resend_required" | "error";
  manual_resend_required: boolean;
  attempt_log: unknown;
};

const MAX_SUCCESSFUL_DOWNLOADS = 4;
const SIGNED_URL_TTL_SECONDS = 86400;
const FORBIDDEN_SUPABASE_PROJECT_REFS = new Set(["gjzltyiznkeyotqhqhxl"]);

function getEffectiveMaxSuccessfulDownloads(maxSuccessfulDownloads: number): number {
  return Math.max(maxSuccessfulDownloads, MAX_SUCCESSFUL_DOWNLOADS);
}

function extractSupabaseProjectRef(url: string): string | null {
  try {
    return new URL(url).hostname.split(".")[0] ?? null;
  } catch {
    return null;
  }
}

function isForbiddenSupabaseProject(url: string): boolean {
  const projectRef = extractSupabaseProjectRef(url);
  return projectRef ? FORBIDDEN_SUPABASE_PROJECT_REFS.has(projectRef) : false;
}

function createSupabaseAdminClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  if (isForbiddenSupabaseProject(supabaseUrl)) {
    throw new Error("Forbidden Supabase project configured.");
  }

  return createClient(supabaseUrl, supabaseKey);
}

function normalizeHeaderValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value ?? null;
}

function getClientIp(req: VercelRequest): string | null {
  const forwardedFor = normalizeHeaderValue(req.headers["x-forwarded-for"]);
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }

  const realIp = normalizeHeaderValue(req.headers["x-real-ip"]);
  if (realIp) {
    return realIp.trim();
  }

  return req.socket?.remoteAddress ?? null;
}

function getUserAgent(req: VercelRequest): string | null {
  return normalizeHeaderValue(req.headers["user-agent"]);
}

function appendAttemptLog(existing: unknown, entry: Record<string, unknown>) {
  const currentLog = Array.isArray(existing) ? existing : [];
  return [...currentLog.slice(-24), entry];
}

function isTokenBlocked(token: DeliveryTokenRow): boolean {
  const effectiveMaxSuccessfulDownloads = getEffectiveMaxSuccessfulDownloads(
    token.max_successful_downloads,
  );

  return token.manual_resend_required ||
    token.delivery_status === "manual_resend_required" ||
    token.delivery_status === "limit_exceeded" ||
    token.successful_downloads >= effectiveMaxSuccessfulDownloads;
}

async function syncOrderDeliveryState(
  supabase: SupabaseClient,
  transactionId: string,
): Promise<void> {
  const { data, error } = await supabase
    .from("delivery_tokens")
    .select(
      "download_attempts,successful_downloads,last_download_at,delivery_status,manual_resend_required,max_successful_downloads",
    )
    .eq("transaction_id", transactionId);

  if (error) {
    console.error("[deliver] Failed to load delivery tokens for sync:", error.message);
    return;
  }

  const tokens = (data ?? []) as Array<{
    download_attempts: number;
    successful_downloads: number;
    last_download_at: string | null;
    delivery_status: DeliveryTokenRow["delivery_status"];
    manual_resend_required: boolean;
    max_successful_downloads: number;
  }>;

  const downloadAttempts = tokens.reduce((sum, token) => sum + (token.download_attempts ?? 0), 0);
  const successfulDownloads = tokens.reduce((sum, token) => sum + (token.successful_downloads ?? 0), 0);
  const lastDownloadAt = tokens
    .map((token) => token.last_download_at)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? null;
  const anyBlocked = tokens.some((token) =>
    token.manual_resend_required ||
    token.delivery_status === "manual_resend_required" ||
    token.delivery_status === "limit_exceeded" ||
    token.successful_downloads >= getEffectiveMaxSuccessfulDownloads(token.max_successful_downloads)
  );
  const allBlocked = tokens.length > 0 && tokens.every((token) =>
    token.manual_resend_required ||
    token.delivery_status === "manual_resend_required" ||
    token.delivery_status === "limit_exceeded" ||
    token.successful_downloads >= getEffectiveMaxSuccessfulDownloads(token.max_successful_downloads)
  );
  const anyError = tokens.some((token) => token.delivery_status === "error");

  let deliveryStatus: "ready" | "limit_exceeded" | "manual_resend_required" | "error" | "pending" = "pending";
  if (allBlocked) {
    deliveryStatus = "manual_resend_required";
  } else if (anyBlocked) {
    deliveryStatus = "limit_exceeded";
  } else if (anyError) {
    deliveryStatus = "error";
  } else if (tokens.length > 0) {
    deliveryStatus = "ready";
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      download_attempts: downloadAttempts,
      successful_downloads: successfulDownloads,
      last_download_at: lastDownloadAt,
      delivery_status: deliveryStatus,
      manual_resend_required: allBlocked,
      download_links_generated: successfulDownloads > 0,
      error_message: allBlocked
        ? "The secure delivery limit for this order has been reached. Contact support for a manual resend."
        : anyError
          ? "A delivery error occurred. Please try again."
          : null,
    })
    .eq("transaction_id", transactionId);

  if (updateError) {
    console.error("[deliver] Failed to sync order delivery state:", updateError.message);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store");

  const token = req.query.token;
  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Missing delivery token." });
  }

  if (!/^[a-f0-9]{48}$/i.test(token)) {
    return res.status(400).json({ error: "Invalid delivery token format." });
  }

  let supabase: SupabaseClient;
  try {
    supabase = createSupabaseAdminClient();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[deliver] Supabase init failed:", message);
    return res.status(500).json({ error: "Storage configuration error." });
  }

  const { data, error } = await supabase
    .from("delivery_tokens")
    .select("transaction_id,file_key,label,bucket,storage_path,filename,delivery_token,download_attempts,successful_downloads,max_successful_downloads,last_download_at,used_by_ip,user_agent,delivery_status,manual_resend_required,attempt_log")
    .eq("delivery_token", token)
    .maybeSingle();

  if (error) {
    console.error("[deliver] Failed to load delivery token:", error.message);
    return res.status(500).json({ error: "Unable to prepare your secure download." });
  }

  if (!data) {
    return res.status(404).json({ error: "Delivery token not found or expired." });
  }

  const deliveryToken = data as DeliveryTokenRow;
  const effectiveMaxSuccessfulDownloads = getEffectiveMaxSuccessfulDownloads(
    deliveryToken.max_successful_downloads,
  );
  const clientIp = getClientIp(req);
  const userAgent = getUserAgent(req);
  const timestamp = new Date().toISOString();

  if (isTokenBlocked(deliveryToken)) {
    const { error: updateError } = await supabase
      .from("delivery_tokens")
      .update({
        download_attempts: deliveryToken.download_attempts + 1,
        max_successful_downloads: effectiveMaxSuccessfulDownloads,
        used_by_ip: clientIp,
        user_agent: userAgent,
        delivery_status: "manual_resend_required",
        manual_resend_required: true,
        attempt_log: appendAttemptLog(deliveryToken.attempt_log, {
          at: timestamp,
          ip: clientIp,
          user_agent: userAgent,
          result: "manual_resend_required",
        }),
      })
      .eq("delivery_token", token);

    if (updateError) {
      console.error("[deliver] Failed to mark token as blocked:", updateError.message);
    }

    await syncOrderDeliveryState(supabase, deliveryToken.transaction_id);

    return res.status(429).json({
      code: "manual_resend_required",
      error: "This file has reached its 4-download limit. Contact support for a manual resend.",
    });
  }

  const { data: signedData, error: signedError } = await supabase.storage
    .from(deliveryToken.bucket)
    .createSignedUrl(deliveryToken.storage_path, SIGNED_URL_TTL_SECONDS, {
      download: deliveryToken.filename,
    });

  if (signedError || !signedData?.signedUrl) {
    console.error("[deliver] Signed URL failed:", signedError);

    const { error: updateError } = await supabase
      .from("delivery_tokens")
      .update({
        download_attempts: deliveryToken.download_attempts + 1,
        max_successful_downloads: effectiveMaxSuccessfulDownloads,
        used_by_ip: clientIp,
        user_agent: userAgent,
        delivery_status: "error",
        attempt_log: appendAttemptLog(deliveryToken.attempt_log, {
          at: timestamp,
          ip: clientIp,
          user_agent: userAgent,
          result: "error",
          reason: "signed_url_failed",
        }),
      })
      .eq("delivery_token", token);

    if (updateError) {
      console.error("[deliver] Failed to log signed URL error:", updateError.message);
    }

    await syncOrderDeliveryState(supabase, deliveryToken.transaction_id);

    return res.status(500).json({ error: "Failed to generate a secure download link." });
  }

  const nextSuccessfulDownloads = deliveryToken.successful_downloads + 1;
  const nextStatus = nextSuccessfulDownloads >= effectiveMaxSuccessfulDownloads
    ? "manual_resend_required"
    : "active";

  const { error: updateError } = await supabase
    .from("delivery_tokens")
    .update({
      download_attempts: deliveryToken.download_attempts + 1,
      successful_downloads: nextSuccessfulDownloads,
      max_successful_downloads: effectiveMaxSuccessfulDownloads,
      last_download_at: timestamp,
      used_by_ip: clientIp,
      user_agent: userAgent,
      delivery_status: nextStatus,
      manual_resend_required: nextSuccessfulDownloads >= effectiveMaxSuccessfulDownloads,
      attempt_log: appendAttemptLog(deliveryToken.attempt_log, {
        at: timestamp,
        ip: clientIp,
        user_agent: userAgent,
        result: "delivered",
      }),
    })
    .eq("delivery_token", token);

  if (updateError) {
    console.error("[deliver] Failed to update delivery token after success:", updateError.message);
  }

  await syncOrderDeliveryState(supabase, deliveryToken.transaction_id);

  return res.status(200).json({
    status: "ok",
    download: {
      key: deliveryToken.file_key,
      label: deliveryToken.label,
      filename: deliveryToken.filename,
      url: signedData.signedUrl,
    },
    remainingSuccessfulDownloads: Math.max(
      effectiveMaxSuccessfulDownloads - nextSuccessfulDownloads,
      0,
    ),
    maxSuccessfulDownloads: effectiveMaxSuccessfulDownloads,
    signedUrlTtlSeconds: SIGNED_URL_TTL_SECONDS,
  });
}