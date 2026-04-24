import type { VercelRequest, VercelResponse } from "@vercel/node";
import { randomBytes } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  sendConversionEvent,
  extractClientIp,
  extractUserAgent,
} from "./_lib/meta-capi.js";
import { collectMetaRequestSignals } from "./_lib/meta-capi-param-builder.js";
import { sendPurchaseCompletedTelegramNotification } from "./_lib/telegram.js";

/* ── Price-ID → Storage-file mapping ─────────────────────────────── */

type StorageFile = {
  key: string;
  label: string;
  bucket: string;
  path: string;
  filename: string;
};

type PaddleTransactionItem = {
  quantity?: number;
  price?: { id?: string };
};

type PaddleTransactionTotals = {
  subtotal?: string | number;
  tax?: string | number;
  total?: string | number;
};

type PaddleTransactionPayment = {
  captured_at?: string | null;
};

const BUCKET = "FIles main";

const STORAGE_MAP: Record<string, StorageFile> = {
  // Live
  "pri_01knwef8ref9gbw6pw9gmfh35t": {
    key: "skills",
    label: "Claude Skills Ultimate Bundle",
    bucket: BUCKET,
    path: "Claude Skills Ultimate Bundle.zip",
    filename: "Claude Skills Ultimate Bundle.zip",
  },
  "pri_01knwembd2ftzz0cw9gksxfh10": {
    key: "n8n",
    label: "1,800+ N8N Automations",
    bucket: BUCKET,
    path: "1 800 n8n Automations.zip",
    filename: "1 800 n8n Automations.zip",
  },
  // Sandbox (same storage files for testing)
  "pri_01knwqfr26gjr7sab6hckwwz8y": {
    key: "skills",
    label: "Claude Skills Ultimate Bundle",
    bucket: BUCKET,
    path: "Claude Skills Ultimate Bundle.zip",
    filename: "Claude Skills Ultimate Bundle.zip",
  },
  "pri_01knwqdeyp432a33ayh3b209ps": {
    key: "n8n",
    label: "1,800+ N8N Automations",
    bucket: BUCKET,
    path: "1 800 n8n Automations.zip",
    filename: "1 800 n8n Automations.zip",
  },
};

const MAX_SUCCESSFUL_DOWNLOADS = 4;
const SIGNED_URL_TTL_SECONDS = 86400;
const DEFAULT_SITE_URL = "https://aicldbase.com";
const EMAIL_ERROR_LIMIT = 1500;
const FORBIDDEN_SUPABASE_PROJECT_REFS = new Set(["gjzltyiznkeyotqhqhxl"]);
const FULFILLMENT_ACCESS_TOKEN_PREFIX = "fac_";
const SUPPORT_REFERENCE_PREFIX = "ACB-";

type OrderEmailStatus = "pending" | "sending" | "sent" | "failed" | "not_applicable";

type OrderEmailRow = {
  email: string | null;
  email_status: string | null;
  email_attempts: number | null;
};

type ClaimedOrderEmailSend = {
  status: "claimed";
  recipient: string;
  nextAttempt: number;
};

type SkippedOrderEmailSend = {
  status: "skipped";
  reason: "already_sent" | "already_sending" | "already_failed";
  emailStatus: OrderEmailStatus;
};

type NotApplicableOrderEmailSend = {
  status: "not_applicable";
  reason: "missing_email";
};

type ClaimOrderEmailSendResult =
  | ClaimedOrderEmailSend
  | SkippedOrderEmailSend
  | NotApplicableOrderEmailSend;

/* ── Helpers ─────────────────────────────────────────────────────── */

function getPaddleEnvironment(): "sandbox" | "production" {
  const configuredEnvironment = (process.env.PADDLE_ENVIRONMENT ?? "production")
    .trim()
    .toLowerCase();

  if (configuredEnvironment === "sandbox") {
    return "sandbox";
  }

  return "production";
}

function getPaddleApiBase(): string {
  return getPaddleEnvironment() === "sandbox"
    ? "https://sandbox-api.paddle.com"
    : "https://api.paddle.com";
}

function getPaddleApiKey(): string | undefined {
  return getPaddleEnvironment() === "sandbox"
    ? process.env.PADDLE_API_KEY_SANDBOX
    : process.env.PADDLE_API_KEY;
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

function getEffectiveMaxSuccessfulDownloads(maxSuccessfulDownloads: number): number {
  return Math.max(maxSuccessfulDownloads, MAX_SUCCESSFUL_DOWNLOADS);
}

function getSiteBaseUrl(): string {
  const configuredSiteUrl = (
    process.env.PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    DEFAULT_SITE_URL
  ).trim();

  return configuredSiteUrl.endsWith("/")
    ? configuredSiteUrl.slice(0, -1)
    : configuredSiteUrl;
}

function buildAbsoluteSiteUrl(path: string): string {
  return `${getSiteBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseJsonBody(req: VercelRequest): Record<string, unknown> | null {
  if (!req.body) {
    return null;
  }

  if (typeof req.body === "string") {
    try {
      const parsed = JSON.parse(req.body) as unknown;
      return isRecord(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  return isRecord(req.body) ? req.body : null;
}

function createFulfillmentAccessTokenValue(): string {
  return `${FULFILLMENT_ACCESS_TOKEN_PREFIX}${randomBytes(24).toString("hex")}`;
}

function createSupportReferenceValue(): string {
  return `${SUPPORT_REFERENCE_PREFIX}${randomBytes(5).toString("hex").toUpperCase()}`;
}

function normalizeSupportReference(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function isValidFulfillmentAccessToken(value: string): boolean {
  return /^fac_[a-f0-9]{48}$/i.test(value);
}

function extractFulfillmentAccessTokenFromCustomData(customData: unknown): string | null {
  if (!isRecord(customData)) {
    return null;
  }

  const accessToken = customData.fulfillment_access_token;
  return typeof accessToken === "string" && isValidFulfillmentAccessToken(accessToken)
    ? accessToken
    : null;
}

function extractFulfillmentAccessTokenFromTransaction(
  transaction: Record<string, unknown>,
): string | null {
  const directMatch = extractFulfillmentAccessTokenFromCustomData(transaction.custom_data) ??
    extractFulfillmentAccessTokenFromCustomData(transaction.customData);
  if (directMatch) {
    return directMatch;
  }

  const checkout = isRecord(transaction.checkout) ? transaction.checkout : null;
  if (!checkout) {
    return null;
  }

  return extractFulfillmentAccessTokenFromCustomData(checkout.custom_data) ??
    extractFulfillmentAccessTokenFromCustomData(checkout.customData);
}

function resolveFulfillmentAccessToken(params: {
  requestedAccessToken: string;
  paddleAccessToken: string | null;
  existingAccessToken: string | null;
  requirePaddleBoundAccess: boolean;
}): string {
  const { requestedAccessToken, paddleAccessToken, existingAccessToken, requirePaddleBoundAccess } = params;

  if (requirePaddleBoundAccess && !paddleAccessToken) {
    throw new Error("The paid transaction is missing a secure fulfillment access token.");
  }

  if (paddleAccessToken && paddleAccessToken !== requestedAccessToken) {
    throw new Error("The secure access token does not match the paid transaction.");
  }

  if (existingAccessToken && existingAccessToken !== requestedAccessToken) {
    throw new Error("The secure access token does not match the stored order record.");
  }

  return paddleAccessToken ?? existingAccessToken ?? requestedAccessToken;
}

function normalizeEmailStatus(value: string | null | undefined): OrderEmailStatus {
  if (
    value === "pending" ||
    value === "sending" ||
    value === "sent" ||
    value === "failed" ||
    value === "not_applicable"
  ) {
    return value;
  }

  return "pending";
}

function trimEmail(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function stringifyEmailError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message.slice(0, EMAIL_ERROR_LIMIT);
}

function buildEmailSubject(environment: "sandbox" | "production"): string {
  return environment === "sandbox"
    ? "[Sandbox] Your secure download links are ready"
    : "Your secure download links are ready";
}

function buildEmailHtml(
  orderReference: string,
  downloadLinks: Array<{ key: string; label: string; filename: string; url: string }>,
): string {
  const itemList = downloadLinks
    .map((downloadLink) => `
      <tr>
        <td style="padding:0 0 16px 0;">
          <div style="font-size:14px;font-weight:600;color:#1f2937;margin-bottom:4px;">${downloadLink.label}</div>
          <div style="font-size:13px;color:#6b7280;margin-bottom:10px;">${downloadLink.filename}</div>
          <a href="${downloadLink.url}" style="display:inline-block;padding:10px 16px;border-radius:10px;background-color:#d57a4d;color:#ffffff;font-size:13px;font-weight:600;text-decoration:none;">Download ${downloadLink.label}</a>
        </td>
      </tr>`)
    .join("");

  return [
    "<div style=\"margin:0;padding:24px;background-color:#f7f2eb;font-family:Arial,sans-serif;color:#1f2937;\">",
    "<div style=\"max-width:600px;margin:0 auto;background-color:#ffffff;border:1px solid #e7ddd1;border-radius:16px;overflow:hidden;\">",
    "<div style=\"padding:32px 28px 20px 28px;border-bottom:1px solid #efe7dc;\">",
    "<div style=\"font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#8b7355;margin-bottom:12px;\">AI Cloud Base</div>",
    "<h1 style=\"margin:0 0 12px 0;font-size:28px;line-height:1.2;color:#1f2937;\">Your secure download links are ready</h1>",
    "<p style=\"margin:0;font-size:15px;line-height:1.7;color:#4b5563;\">Thanks for your order. Use the secure links below to access your files.</p>",
    "</div>",
    "<div style=\"padding:24px 28px;\">",
    "<div style=\"margin:0 0 20px 0;padding:16px 18px;background-color:#fbf8f4;border:1px solid #eee3d6;border-radius:12px;\">",
    "<div style=\"font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8b7355;margin-bottom:8px;\">Order Details</div>",
    `<div style=\"font-size:14px;color:#4b5563;margin-bottom:6px;\"><strong style=\"color:#1f2937;\">Order reference:</strong> ${orderReference}</div>`,
    `<div style=\"font-size:14px;color:#4b5563;\">Each file supports up to ${MAX_SUCCESSFUL_DOWNLOADS} successful downloads. Once a file link is issued, it remains active for ${SIGNED_URL_TTL_SECONDS / 3600} hours.</div>`,
    "</div>",
    "<table role=\"presentation\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" style=\"margin:0 0 20px 0;\">",
    itemList,
    "</table>",
    "<p style=\"margin:0 0 14px 0;font-size:14px;line-height:1.7;color:#4b5563;\">If you use all 4 successful downloads for a file, contact support and we will help with a manual resend.</p>",
    "<p style=\"margin:0 0 14px 0;font-size:14px;line-height:1.7;color:#4b5563;\">If anything looks wrong, reply to this email and include your order reference.</p>",
    "<p style=\"margin:0;font-size:14px;line-height:1.7;color:#4b5563;\">Best,<br />AI Cloud Base Support</p>",
    "</div>",
    "</div>",
    "</div>",
  ].join("");
}

function buildEmailText(
  orderReference: string,
  downloadLinks: Array<{ key: string; label: string; filename: string; url: string }>,
): string {
  const itemLines = downloadLinks
    .map((downloadLink) => `- ${downloadLink.label} (${downloadLink.filename})\n  ${downloadLink.url}`)
    .join("\n\n");

  return [
    "Your secure download links are ready.",
    "",
    "Thanks for your order.",
    "",
    "Use the secure links below to access your files.",
    "",
    "Order details",
    `Order reference: ${orderReference}`,
    `Download policy: Up to ${MAX_SUCCESSFUL_DOWNLOADS} successful downloads per file. Each issued file link stays active for ${SIGNED_URL_TTL_SECONDS / 3600} hours.`,
    "",
    itemLines,
    "",
    "If you use all 4 successful downloads for a file, contact support for a manual resend.",
    "",
    "If you run into any other issues, reply to this email and include your order reference.",
    "",
    "Best,",
    "AI Cloud Base Support",
  ].join("\n");
}

function getResendApiKey(): string {
  const apiKey = trimEmail(process.env.RESEND_API_KEY);

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  return apiKey;
}

function getEmailSenderConfig() {
  const from = trimEmail(process.env.EMAIL_FROM);
  const replyTo = trimEmail(process.env.EMAIL_REPLY_TO);

  if (!from) {
    throw new Error("EMAIL_FROM is not configured.");
  }

  return {
    from,
    replyTo,
  };
}

async function claimOrderEmailSend(
  supabase: SupabaseClient,
  transactionId: string,
  fallbackEmail: string | null,
): Promise<ClaimOrderEmailSendResult> {
  const { data: order, error } = await supabase
    .from("orders")
    .select("email,email_status,email_attempts")
    .eq("transaction_id", transactionId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load order email state: ${error.message}`);
  }

  const typedOrder = (order ?? null) as OrderEmailRow | null;
  const recipient = trimEmail(typedOrder?.email) ?? trimEmail(fallbackEmail);
  if (!recipient) {
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        email_status: "not_applicable",
        email_error: "Buyer email not available for transactional delivery.",
        email_claimed_at: null,
      })
      .eq("transaction_id", transactionId);

    if (updateError) {
      console.error("[order-email] Failed to mark email as not applicable:", updateError.message);
    }

    return {
      status: "not_applicable",
      reason: "missing_email",
    };
  }

  const currentStatus = normalizeEmailStatus(typedOrder?.email_status);
  if (currentStatus === "sent") {
    return {
      status: "skipped",
      reason: "already_sent",
      emailStatus: currentStatus,
    };
  }

  if (currentStatus === "sending") {
    return {
      status: "skipped",
      reason: "already_sending",
      emailStatus: currentStatus,
    };
  }

  if (currentStatus === "failed") {
    return {
      status: "skipped",
      reason: "already_failed",
      emailStatus: currentStatus,
    };
  }

  const nextAttempt = (typedOrder?.email_attempts ?? 0) + 1;
  const now = new Date().toISOString();
  const { data: claimedOrder, error: claimError } = await supabase
    .from("orders")
    .update({
      email: recipient,
      email_status: "sending",
      email_attempts: nextAttempt,
      email_claimed_at: now,
      email_error: null,
    })
    .eq("transaction_id", transactionId)
    .eq("email_status", currentStatus)
    .select("email,email_attempts")
    .maybeSingle();

  if (claimError) {
    throw new Error(`Failed to claim order email send: ${claimError.message}`);
  }

  if (!claimedOrder) {
    const { data: refreshedOrder } = await supabase
      .from("orders")
      .select("email_status")
      .eq("transaction_id", transactionId)
      .maybeSingle();

    return {
      status: "skipped",
      reason: normalizeEmailStatus(refreshedOrder?.email_status) === "sent"
        ? "already_sent"
        : "already_sending",
      emailStatus: normalizeEmailStatus(refreshedOrder?.email_status),
    };
  }

  return {
    status: "claimed",
    recipient,
    nextAttempt,
  };
}

function buildEmailDeliveryLinks(
  accessToken: string,
  downloads: Array<{ key: string; label: string; filename: string }>,
): Array<{ key: string; label: string; filename: string; url: string }> {
  return downloads.map((download) => ({
    key: download.key,
    label: download.label,
    filename: download.filename,
    url: buildAbsoluteSiteUrl(
      `/download?access=${encodeURIComponent(accessToken)}&file=${encodeURIComponent(download.key)}`,
    ),
  }));
}

async function markOrderEmailSent(
  supabase: SupabaseClient,
  transactionId: string,
  downloadLinks: Array<{ key: string }>,
): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({
      email_status: "sent",
      email_sent_at: new Date().toISOString(),
      email_claimed_at: null,
      email_error: null,
      attachments_sent: downloadLinks.map((downloadLink) => downloadLink.key),
    })
    .eq("transaction_id", transactionId)
    .eq("email_status", "sending");

  if (error) {
    throw new Error(`Failed to persist sent email state: ${error.message}`);
  }
}

async function markOrderEmailFailed(
  supabase: SupabaseClient,
  transactionId: string,
  error: unknown,
): Promise<void> {
  const { error: updateError } = await supabase
    .from("orders")
    .update({
      email_status: "failed",
      email_claimed_at: null,
      email_error: stringifyEmailError(error),
    })
    .eq("transaction_id", transactionId)
    .eq("email_status", "sending");

  if (updateError) {
    console.error("[order-email] Failed to persist failed email state:", updateError.message);
  }
}

async function sendOrderEmailViaResendApi(params: {
  apiKey: string;
  transactionId: string;
  orderReference: string;
  recipient: string;
  from: string;
  replyTo: string | null;
  environment: "sandbox" | "production";
  downloadLinks: Array<{ key: string; label: string; filename: string; url: string }>;
  attempt: number;
}): Promise<void> {
  const resendPayload = {
    from: params.from,
    to: [params.recipient],
    subject: buildEmailSubject(params.environment),
    html: buildEmailHtml(params.orderReference, params.downloadLinks),
    text: buildEmailText(params.orderReference, params.downloadLinks),
    ...(params.replyTo ? { reply_to: params.replyTo } : {}),
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `${params.transactionId}-delivery-links-${params.attempt}`,
    },
    body: JSON.stringify(resendPayload),
  });

  if (response.ok) {
    return;
  }

  const responseText = await response.text();
  throw new Error(`Resend API ${response.status}: ${responseText}`);
}

async function ensureOrderDeliveryEmail({
  supabase,
  transactionId,
  orderReference,
  fallbackEmail,
  downloadLinks,
  environment,
}: {
  supabase: SupabaseClient;
  transactionId: string;
  orderReference: string;
  fallbackEmail: string | null;
  downloadLinks: Array<{ key: string; label: string; filename: string; url: string }>;
  environment: "sandbox" | "production";
}): Promise<void> {
  const claim = await claimOrderEmailSend(supabase, transactionId, fallbackEmail);
  if (claim.status !== "claimed") {
    return;
  }

  try {
    const apiKey = getResendApiKey();
    const { from, replyTo } = getEmailSenderConfig();

    await sendOrderEmailViaResendApi({
      apiKey,
      transactionId,
      orderReference,
      recipient: claim.recipient,
      from,
      replyTo,
      environment,
      downloadLinks,
      attempt: claim.nextAttempt,
    });

    await markOrderEmailSent(supabase, transactionId, downloadLinks);
  } catch (error: unknown) {
    await markOrderEmailFailed(supabase, transactionId, error);
    throw error;
  }
}

async function verifyTransaction(transactionId: string) {
  const apiKey = getPaddleApiKey();
  if (!apiKey) {
    const envLabel = getPaddleEnvironment() === "sandbox"
      ? "PADDLE_API_KEY_SANDBOX"
      : "PADDLE_API_KEY";
    throw new Error(`${envLabel} is not configured.`);
  }

  const url = `${getPaddleApiBase()}/transactions/${encodeURIComponent(transactionId)}?include=customer`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Paddle API ${res.status}: ${body}`);
  }

  const json = (await res.json()) as { data: Record<string, unknown> };
  return json.data;
}

/* ── DB helpers ──────────────────────────────────────────────────── */

type OrderUpsertData = {
  transaction_id: string;
  fulfillment_access_token?: string | null;
  support_reference?: string | null;
  email: string | null;
  paddle_customer_id: string | null;
  checkout_id: string | null;
  environment: "sandbox" | "production";
  items: unknown[];
  skills_purchased: boolean;
  n8n_purchased: boolean;
  transaction_status: string | null;
  transaction_passed: boolean;
  transaction_passed_at: string | null;
  currency_code: string | null;
  quantity: number;
  unit_price_amount: number | null;
  subtotal_amount: number | null;
  tax_amount: number | null;
  total_amount: number | null;
  fulfillment_status: "pending" | "fulfilled" | "error";
  download_links_generated: boolean;
  download_attempts: number;
  successful_downloads: number;
  delivery_status: "pending" | "ready" | "limit_exceeded" | "manual_resend_required" | "error";
  manual_resend_required: boolean;
  last_download_at: string | null;
  fulfilled_at: string | null;
  error_message: string | null;
  source: string;
  raw_transaction_payload: unknown;
};

type OrderRecord = {
  id: number;
  transaction_id: string;
  fulfillment_access_token: string | null;
  support_reference: string | null;
  download_attempts: number;
  successful_downloads: number;
  last_download_at: string | null;
  fulfilled_at: string | null;
};

type DeliveryTokenUpsertData = {
  order_id: number;
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
  attempt_log: unknown[];
};

type DeliveryTokenRecord = DeliveryTokenUpsertData;

async function findOrderByAccessToken(
  supabase: SupabaseClient,
  accessToken: string,
): Promise<OrderRecord | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("id,transaction_id,fulfillment_access_token,support_reference,download_attempts,successful_downloads,last_download_at,fulfilled_at")
    .eq("fulfillment_access_token", accessToken)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to resolve secure access token: ${error.message}`);
  }

  return (data ?? null) as OrderRecord | null;
}

async function upsertOrder(
  supabase: SupabaseClient,
  data: OrderUpsertData,
): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .upsert(data, { onConflict: "transaction_id" });
  if (error) {
    console.error("[fulfill] DB upsert failed:", error.message);
  }
}

async function upsertDeliveryToken(
  supabase: SupabaseClient,
  data: DeliveryTokenUpsertData,
): Promise<void> {
  const { error } = await supabase
    .from("delivery_tokens")
    .upsert(data, { onConflict: "transaction_id,file_key" });

  if (error) {
    console.error("[fulfill] Delivery token upsert failed:", error.message);
  }
}

async function listDeliveryTokens(
  supabase: SupabaseClient,
  transactionId: string,
): Promise<DeliveryTokenRecord[]> {
  const { data, error } = await supabase
    .from("delivery_tokens")
    .select("order_id,transaction_id,file_key,label,bucket,storage_path,filename,delivery_token,download_attempts,successful_downloads,max_successful_downloads,last_download_at,used_by_ip,user_agent,delivery_status,manual_resend_required,attempt_log")
    .eq("transaction_id", transactionId)
    .order("id", { ascending: true });

  if (error) {
    console.error("[fulfill] Failed to load delivery tokens:", error.message);
    return [];
  }

  return (data ?? []) as DeliveryTokenRecord[];
}

function createDeliveryTokenValue(): string {
  return randomBytes(24).toString("hex");
}

function isTokenBlocked(token: DeliveryTokenRecord): boolean {
  const effectiveMaxSuccessfulDownloads = getEffectiveMaxSuccessfulDownloads(
    token.max_successful_downloads,
  );

  return token.manual_resend_required ||
    token.delivery_status === "manual_resend_required" ||
    token.delivery_status === "limit_exceeded" ||
    token.successful_downloads >= effectiveMaxSuccessfulDownloads;
}

function summarizeDeliveryTokens(tokens: DeliveryTokenRecord[]) {
  const downloadAttempts = tokens.reduce((sum, token) => sum + token.download_attempts, 0);
  const successfulDownloads = tokens.reduce((sum, token) => sum + token.successful_downloads, 0);
  const lastDownloadAt = tokens
    .map((token) => token.last_download_at)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1) ?? null;
  const anyBlocked = tokens.some((token) => isTokenBlocked(token));
  const allBlocked = tokens.length > 0 && tokens.every((token) => isTokenBlocked(token));

  return {
    downloadAttempts,
    successfulDownloads,
    lastDownloadAt,
    anyBlocked,
    allBlocked,
    deliveryStatus: allBlocked
      ? "manual_resend_required"
      : anyBlocked
        ? "limit_exceeded"
        : "ready" as OrderUpsertData["delivery_status"],
  };
}

function buildDeliveryDownloads(tokens: DeliveryTokenRecord[]) {
  return tokens.map((token) => ({
    maxSuccessfulDownloads: getEffectiveMaxSuccessfulDownloads(token.max_successful_downloads),
    signedUrlTtlSeconds: SIGNED_URL_TTL_SECONDS,
    key: token.file_key,
    label: token.label,
    filename: token.filename,
    url: `/api/deliver?token=${encodeURIComponent(token.delivery_token)}`,
    status: isTokenBlocked(token) ? "manual_resend_required" : "download_allowed",
    remainingSuccessfulDownloads: Math.max(
      getEffectiveMaxSuccessfulDownloads(token.max_successful_downloads) - token.successful_downloads,
      0,
    ),
  }));
}

function extractEmail(transaction: Record<string, unknown>): string | null {
  // Paddle v2 includes customer details via ?include=customer
  const customer = transaction.customer as
    | { email?: string }
    | undefined;
  if (customer?.email) return customer.email;

  // Fallback: checkout.customer_email in some transaction shapes
  const checkout = transaction.checkout as
    | { customer_email?: string }
    | undefined;
  if (checkout?.customer_email) return checkout.customer_email;

  return null;
}

function extractCustomerId(
  transaction: Record<string, unknown>,
): string | null {
  if (typeof transaction.customer_id === "string") {
    return transaction.customer_id;
  }

  const customer = transaction.customer as { id?: string } | undefined;
  if (customer?.id) {
    return customer.id;
  }

  return null;
}

function extractCheckoutId(
  transaction: Record<string, unknown>,
): string | null {
  if (typeof transaction.checkout_id === "string") {
    return transaction.checkout_id;
  }
  const checkout = transaction.checkout as { id?: string } | undefined;
  if (checkout?.id) return checkout.id;
  return null;
}

function extractMetaExternalId(
  transaction: Record<string, unknown>,
): string | null {
  return extractCustomerId(transaction) ?? extractCheckoutId(transaction);
}

function parseMoneyAmount(value: string | number | undefined): number | null {
  if (value === undefined) {
    return null;
  }

  const numericValue =
    typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return Number((numericValue / 100).toFixed(2));
}

function extractCurrencyCode(transaction: Record<string, unknown>): string | null {
  return typeof transaction.currency_code === "string"
    ? transaction.currency_code
    : null;
}

function extractQuantity(items: PaddleTransactionItem[]): number {
  const quantity = items.reduce((sum, item) => {
    const itemQuantity = typeof item.quantity === "number" && item.quantity > 0
      ? item.quantity
      : 0;
    return sum + itemQuantity;
  }, 0);

  return quantity > 0 ? quantity : 1;
}

function extractTotals(transaction: Record<string, unknown>) {
  const details = transaction.details as
    | { totals?: PaddleTransactionTotals }
    | undefined;

  const subtotalAmount = parseMoneyAmount(details?.totals?.subtotal);
  const taxAmount = parseMoneyAmount(details?.totals?.tax);
  const totalAmount = parseMoneyAmount(details?.totals?.total);

  return {
    subtotalAmount,
    taxAmount,
    totalAmount,
  };
}

function extractTransactionPassedAt(
  transaction: Record<string, unknown>,
): string | null {
  const payments = Array.isArray(transaction.payments)
    ? (transaction.payments as PaddleTransactionPayment[])
    : [];

  const capturedAt = payments.find((payment) => payment.captured_at)?.captured_at;
  if (capturedAt) {
    return capturedAt;
  }

  if (typeof transaction.billed_at === "string") {
    return transaction.billed_at;
  }

  if (typeof transaction.updated_at === "string") {
    return transaction.updated_at;
  }

  if (typeof transaction.created_at === "string") {
    return transaction.created_at;
  }

  return null;
}

function buildOrderFinancials(
  transaction: Record<string, unknown>,
  items: PaddleTransactionItem[],
  transactionStatus: string,
) {
  const quantity = extractQuantity(items);
  const { subtotalAmount, taxAmount, totalAmount } = extractTotals(transaction);

  return {
    transaction_passed: transactionStatus === "completed" || transactionStatus === "paid",
    transaction_passed_at: extractTransactionPassedAt(transaction),
    currency_code: extractCurrencyCode(transaction),
    quantity,
    unit_price_amount:
      subtotalAmount !== null && quantity > 0
        ? Number((subtotalAmount / quantity).toFixed(2))
        : null,
    subtotal_amount: subtotalAmount,
    tax_amount: taxAmount,
    total_amount: totalAmount,
  };
}

/* ── Handler ─────────────────────────────────────────────────────── */

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store");

  /* ── Init Supabase client ─────────────────────────────────────── */

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "[fulfill] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    );
    return res.status(500).json({ error: "Storage configuration error." });
  }

  if (isForbiddenSupabaseProject(supabaseUrl)) {
    console.error("[fulfill] Refusing to use forbidden Supabase project ref.");
    return res.status(500).json({
      error: "Storage configuration is not ready yet. Please contact support.",
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const environment = getPaddleEnvironment();
  const fulfillmentSource = req.method === "POST"
    ? "checkout_callback"
    : "download_page";

  let txn: string;
  let requestedAccessToken: string;
  let requirePaddleBoundAccess = false;

  if (req.method === "GET") {
    const access = req.query.access;

    if (!access || typeof access !== "string") {
      return res.status(400).json({ error: "Missing secure access token." });
    }

    if (!isValidFulfillmentAccessToken(access)) {
      return res.status(400).json({ error: "Invalid secure access token format." });
    }

    let accessOrder: OrderRecord | null;
    try {
      accessOrder = await findOrderByAccessToken(supabase, access);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("[fulfill] Access token lookup failed:", message);
      return res.status(500).json({ error: "Unable to resolve your secure download access right now." });
    }

    if (!accessOrder?.transaction_id) {
      return res.status(404).json({ error: "Secure access link not found or expired." });
    }

    txn = accessOrder.transaction_id;
    requestedAccessToken = access;
  } else {
    const body = parseJsonBody(req);
    const transactionId = typeof body?.transactionId === "string"
      ? body.transactionId
      : null;
    const accessToken = typeof body?.accessToken === "string"
      ? body.accessToken
      : null;

    if (!transactionId) {
      return res.status(400).json({ error: "Missing transaction ID." });
    }

    if (!/^txn_[a-zA-Z0-9]+$/.test(transactionId)) {
      return res.status(400).json({ error: "Invalid transaction ID format." });
    }

    if (!accessToken) {
      return res.status(400).json({ error: "Missing secure access token." });
    }

    if (!isValidFulfillmentAccessToken(accessToken)) {
      return res.status(400).json({ error: "Invalid secure access token format." });
    }

    txn = transactionId;
    requestedAccessToken = accessToken;
    requirePaddleBoundAccess = true;
  }

  /* ── Verify Paddle transaction ────────────────────────────────── */

  let transaction: Record<string, unknown>;
  try {
    transaction = await verifyTransaction(txn);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[fulfill] Paddle verification failed:", message);

    // Log error to DB
    await upsertOrder(supabase, {
      transaction_id: txn,
      fulfillment_access_token: requestedAccessToken,
      email: null,
      paddle_customer_id: null,
      checkout_id: null,
      environment,
      items: [],
      skills_purchased: false,
      n8n_purchased: false,
      transaction_status: null,
      transaction_passed: false,
      transaction_passed_at: null,
      currency_code: null,
      quantity: 1,
      unit_price_amount: null,
      subtotal_amount: null,
      tax_amount: null,
      total_amount: null,
      fulfillment_status: "error",
      download_links_generated: false,
      download_attempts: 0,
      successful_downloads: 0,
      delivery_status: "error",
      manual_resend_required: false,
      last_download_at: null,
      fulfilled_at: null,
      error_message: `Paddle verification failed: ${message}`,
      source: fulfillmentSource,
      raw_transaction_payload: null,
    });

    return res
      .status(502)
      .json({ error: "Unable to verify payment. Please try again later." });
  }

  const transactionStatus = String(transaction.status ?? "unknown");
  const transactionItems = (transaction.items ?? []) as PaddleTransactionItem[];
  const financials = buildOrderFinancials(
    transaction,
    transactionItems,
    transactionStatus,
  );

  const { data: existingOrderData } = await supabase
    .from("orders")
    .select("id,transaction_id,fulfillment_access_token,support_reference,download_attempts,successful_downloads,last_download_at,fulfilled_at")
    .eq("transaction_id", txn)
    .maybeSingle();

  const existingOrder = (existingOrderData ?? null) as OrderRecord | null;
  const paddleAccessToken = extractFulfillmentAccessTokenFromTransaction(transaction);

  let fulfillmentAccessToken: string;
  try {
    fulfillmentAccessToken = resolveFulfillmentAccessToken({
      requestedAccessToken,
      paddleAccessToken,
      existingAccessToken: existingOrder?.fulfillment_access_token ?? null,
      requirePaddleBoundAccess,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[fulfill] Secure access verification failed:", message);

    await upsertOrder(supabase, {
      transaction_id: txn,
      fulfillment_access_token: requestedAccessToken,
      support_reference: normalizeSupportReference(existingOrder?.support_reference),
      email: extractEmail(transaction),
      paddle_customer_id: extractCustomerId(transaction),
      checkout_id: extractCheckoutId(transaction),
      environment,
      items: transactionItems as unknown[],
      skills_purchased: false,
      n8n_purchased: false,
      transaction_status: transactionStatus,
      transaction_passed: financials.transaction_passed,
      transaction_passed_at: financials.transaction_passed_at,
      currency_code: financials.currency_code,
      quantity: financials.quantity,
      unit_price_amount: financials.unit_price_amount,
      subtotal_amount: financials.subtotal_amount,
      tax_amount: financials.tax_amount,
      total_amount: financials.total_amount,
      fulfillment_status: "error",
      download_links_generated: false,
      download_attempts: existingOrder?.download_attempts ?? 0,
      successful_downloads: existingOrder?.successful_downloads ?? 0,
      delivery_status: "error",
      manual_resend_required: false,
      last_download_at: existingOrder?.last_download_at ?? null,
      fulfilled_at: existingOrder?.fulfilled_at ?? null,
      error_message: message,
      source: fulfillmentSource,
      raw_transaction_payload: transaction,
    });

    return res.status(403).json({
      error: "Secure fulfillment access could not be verified. Please use the latest download link or contact support.",
    });
  }

  const supportReference = normalizeSupportReference(existingOrder?.support_reference) ??
    createSupportReferenceValue();

  if (transaction.status !== "completed" && transaction.status !== "paid") {
    // Log non-completed transaction
    await upsertOrder(supabase, {
      transaction_id: txn,
      fulfillment_access_token: fulfillmentAccessToken,
      support_reference: supportReference,
      email: extractEmail(transaction),
      paddle_customer_id: extractCustomerId(transaction),
      checkout_id: extractCheckoutId(transaction),
      environment,
      items: (transaction.items ?? []) as unknown[],
      skills_purchased: false,
      n8n_purchased: false,
      transaction_status: transactionStatus,
      transaction_passed: financials.transaction_passed,
      transaction_passed_at: financials.transaction_passed_at,
      currency_code: financials.currency_code,
      quantity: financials.quantity,
      unit_price_amount: financials.unit_price_amount,
      subtotal_amount: financials.subtotal_amount,
      tax_amount: financials.tax_amount,
      total_amount: financials.total_amount,
      fulfillment_status: "error",
      download_links_generated: false,
      download_attempts: 0,
      successful_downloads: 0,
      delivery_status: "error",
      manual_resend_required: false,
      last_download_at: null,
      fulfilled_at: null,
      error_message: `Transaction not completed (status: ${transactionStatus})`,
      source: fulfillmentSource,
      raw_transaction_payload: transaction,
    });

    return res.status(403).json({
      error: `Transaction is not completed (status: ${transactionStatus}).`,
    });
  }

  /* ── Map purchased items to storage files ─────────────────────── */

  const items = transactionItems as Array<{
    quantity?: number;
    price: { id: string };
  }>;
  const seen = new Set<string>();
  const filesToDeliver: StorageFile[] = [];
  let skillsPurchased = false;
  let n8nPurchased = false;

  for (const item of items) {
    const priceId = item.price?.id;
    if (priceId && STORAGE_MAP[priceId] && !seen.has(priceId)) {
      seen.add(priceId);
      const sf = STORAGE_MAP[priceId];
      filesToDeliver.push(sf);
      if (sf.key === "skills") skillsPurchased = true;
      if (sf.key === "n8n") n8nPurchased = true;
    }
  }

  if (filesToDeliver.length === 0) {
    console.error("[fulfill] No downloadable files for transaction:", txn);

    await upsertOrder(supabase, {
      transaction_id: txn,
      fulfillment_access_token: fulfillmentAccessToken,
      support_reference: supportReference,
      email: extractEmail(transaction),
      paddle_customer_id: extractCustomerId(transaction),
      checkout_id: extractCheckoutId(transaction),
      environment,
      items: items as unknown[],
      skills_purchased: false,
      n8n_purchased: false,
      transaction_status: transactionStatus,
      transaction_passed: financials.transaction_passed,
      transaction_passed_at: financials.transaction_passed_at,
      currency_code: financials.currency_code,
      quantity: financials.quantity,
      unit_price_amount: financials.unit_price_amount,
      subtotal_amount: financials.subtotal_amount,
      tax_amount: financials.tax_amount,
      total_amount: financials.total_amount,
      fulfillment_status: "error",
      download_links_generated: false,
      download_attempts: 0,
      successful_downloads: 0,
      delivery_status: "error",
      manual_resend_required: false,
      last_download_at: null,
      fulfilled_at: null,
      error_message: "No downloadable files found for purchased price IDs",
      source: fulfillmentSource,
      raw_transaction_payload: transaction,
    });

    return res
      .status(404)
      .json({ error: "No downloadable files found for this transaction." });
  }

  /* ── Create / update order record (pending) ───────────────────── */

  await upsertOrder(supabase, {
    transaction_id: txn,
    fulfillment_access_token: fulfillmentAccessToken,
    support_reference: supportReference,
    email: extractEmail(transaction),
    paddle_customer_id: extractCustomerId(transaction),
    checkout_id: extractCheckoutId(transaction),
    environment,
    items: items as unknown[],
    skills_purchased: skillsPurchased,
    n8n_purchased: n8nPurchased,
    transaction_status: transactionStatus,
    transaction_passed: financials.transaction_passed,
    transaction_passed_at: financials.transaction_passed_at,
    currency_code: financials.currency_code,
    quantity: financials.quantity,
    unit_price_amount: financials.unit_price_amount,
    subtotal_amount: financials.subtotal_amount,
    tax_amount: financials.tax_amount,
    total_amount: financials.total_amount,
    fulfillment_status: "pending",
    download_links_generated: false,
    download_attempts: existingOrder?.download_attempts ?? 0,
    successful_downloads: existingOrder?.successful_downloads ?? 0,
    delivery_status: "pending",
    manual_resend_required: false,
    last_download_at: existingOrder?.last_download_at ?? null,
    fulfilled_at: existingOrder?.fulfilled_at ?? null,
    error_message: null,
    source: fulfillmentSource,
    raw_transaction_payload: transaction,
  });

  const { data: orderRecord, error: orderLookupError } = await supabase
    .from("orders")
    .select("id,fulfillment_access_token,support_reference")
    .eq("transaction_id", txn)
    .maybeSingle();

  if (orderLookupError || !orderRecord?.id) {
    console.error("[fulfill] Failed to resolve order id:", orderLookupError?.message);

    await upsertOrder(supabase, {
      transaction_id: txn,
      fulfillment_access_token: fulfillmentAccessToken,
      support_reference: supportReference,
      email: extractEmail(transaction),
      paddle_customer_id: extractCustomerId(transaction),
      checkout_id: extractCheckoutId(transaction),
      environment,
      items: items as unknown[],
      skills_purchased: skillsPurchased,
      n8n_purchased: n8nPurchased,
      transaction_status: transactionStatus,
      transaction_passed: financials.transaction_passed,
      transaction_passed_at: financials.transaction_passed_at,
      currency_code: financials.currency_code,
      quantity: financials.quantity,
      unit_price_amount: financials.unit_price_amount,
      subtotal_amount: financials.subtotal_amount,
      tax_amount: financials.tax_amount,
      total_amount: financials.total_amount,
      fulfillment_status: "error",
      download_links_generated: false,
      download_attempts: existingOrder?.download_attempts ?? 0,
      successful_downloads: existingOrder?.successful_downloads ?? 0,
      delivery_status: "error",
      manual_resend_required: false,
      last_download_at: existingOrder?.last_download_at ?? null,
      fulfilled_at: existingOrder?.fulfilled_at ?? null,
      error_message: "Failed to prepare controlled delivery token records",
      source: fulfillmentSource,
      raw_transaction_payload: transaction,
    });

    return res.status(500).json({ error: "Failed to prepare download delivery." });
  }

  const existingTokens = await listDeliveryTokens(supabase, txn);
  const existingTokensByKey = new Map(existingTokens.map((token) => [token.file_key, token]));

  for (const file of filesToDeliver) {
    const existingToken = existingTokensByKey.get(file.key);
    const effectiveMaxSuccessfulDownloads = getEffectiveMaxSuccessfulDownloads(
      existingToken?.max_successful_downloads ?? 0,
    );
    const normalizedDeliveryStatus = existingToken?.delivery_status === "error"
      ? "error"
      : (existingToken?.successful_downloads ?? 0) >= effectiveMaxSuccessfulDownloads
        ? "manual_resend_required"
        : "active";

    await upsertDeliveryToken(supabase, {
      order_id: orderRecord.id,
      transaction_id: txn,
      file_key: file.key,
      label: file.label,
      bucket: file.bucket,
      storage_path: file.path,
      filename: file.filename,
      delivery_token: existingToken?.delivery_token ?? createDeliveryTokenValue(),
      download_attempts: existingToken?.download_attempts ?? 0,
      successful_downloads: existingToken?.successful_downloads ?? 0,
      max_successful_downloads: effectiveMaxSuccessfulDownloads,
      last_download_at: existingToken?.last_download_at ?? null,
      used_by_ip: existingToken?.used_by_ip ?? null,
      user_agent: existingToken?.user_agent ?? null,
      delivery_status: normalizedDeliveryStatus,
      manual_resend_required: normalizedDeliveryStatus === "manual_resend_required",
      attempt_log: Array.isArray(existingToken?.attempt_log) ? existingToken.attempt_log : [],
    });
  }

  const deliveryTokens = await listDeliveryTokens(supabase, txn);
  if (deliveryTokens.length === 0) {
    await upsertOrder(supabase, {
      transaction_id: txn,
      fulfillment_access_token: fulfillmentAccessToken,
      support_reference: supportReference,
      email: extractEmail(transaction),
      paddle_customer_id: extractCustomerId(transaction),
      checkout_id: extractCheckoutId(transaction),
      environment,
      items: items as unknown[],
      skills_purchased: skillsPurchased,
      n8n_purchased: n8nPurchased,
      transaction_status: transactionStatus,
      transaction_passed: financials.transaction_passed,
      transaction_passed_at: financials.transaction_passed_at,
      currency_code: financials.currency_code,
      quantity: financials.quantity,
      unit_price_amount: financials.unit_price_amount,
      subtotal_amount: financials.subtotal_amount,
      tax_amount: financials.tax_amount,
      total_amount: financials.total_amount,
      fulfillment_status: "error",
      download_links_generated: false,
      download_attempts: existingOrder?.download_attempts ?? 0,
      successful_downloads: existingOrder?.successful_downloads ?? 0,
      delivery_status: "error",
      manual_resend_required: false,
      last_download_at: existingOrder?.last_download_at ?? null,
      fulfilled_at: existingOrder?.fulfilled_at ?? null,
      error_message: "Failed to load delivery token records after creation",
      source: fulfillmentSource,
      raw_transaction_payload: transaction,
    });

    return res.status(500).json({ error: "Failed to prepare download delivery." });
  }

  const deliverySummary = summarizeDeliveryTokens(deliveryTokens);
  const downloads = buildDeliveryDownloads(deliveryTokens);
  const emailDeliveryLinks = buildEmailDeliveryLinks(fulfillmentAccessToken, downloads);

  await upsertOrder(supabase, {
    transaction_id: txn,
    fulfillment_access_token: fulfillmentAccessToken,
    support_reference: supportReference,
    email: extractEmail(transaction),
    paddle_customer_id: extractCustomerId(transaction),
    checkout_id: extractCheckoutId(transaction),
    environment,
    items: items as unknown[],
    skills_purchased: skillsPurchased,
    n8n_purchased: n8nPurchased,
    transaction_status: transactionStatus,
    transaction_passed: financials.transaction_passed,
    transaction_passed_at: financials.transaction_passed_at,
    currency_code: financials.currency_code,
    quantity: financials.quantity,
    unit_price_amount: financials.unit_price_amount,
    subtotal_amount: financials.subtotal_amount,
    tax_amount: financials.tax_amount,
    total_amount: financials.total_amount,
    fulfillment_status: "fulfilled",
    download_links_generated: deliverySummary.successfulDownloads > 0,
    download_attempts: deliverySummary.downloadAttempts,
    successful_downloads: deliverySummary.successfulDownloads,
    delivery_status: deliverySummary.deliveryStatus,
    manual_resend_required: deliverySummary.allBlocked,
    last_download_at: deliverySummary.lastDownloadAt,
    fulfilled_at: existingOrder?.fulfilled_at ?? new Date().toISOString(),
    error_message: deliverySummary.allBlocked
      ? "This order has reached the secure delivery limit. Contact support for a manual resend."
      : null,
    source: fulfillmentSource,
    raw_transaction_payload: transaction,
  });

  /* ── Meta Conversions API: Purchase event (fire-and-forget) ───── */

  try {
    const purchaseEmail = extractEmail(transaction);
    const purchaseIp = extractClientIp(req.headers as Record<string, string | string[] | undefined>);
    const purchaseUa = extractUserAgent(req.headers as Record<string, string | string[] | undefined>);
    const purchaseEventSourceUrl = buildAbsoluteSiteUrl("/download");
    const purchaseRequestSignals = collectMetaRequestSignals({
      host: typeof req.headers.host === "string" ? req.headers.host : null,
      eventSourceUrl: purchaseEventSourceUrl,
      referer: typeof req.headers.referer === "string" ? req.headers.referer : null,
      cookieHeader: typeof req.headers.cookie === "string" ? req.headers.cookie : null,
      xForwardedFor: typeof req.headers["x-forwarded-for"] === "string" ? req.headers["x-forwarded-for"] : null,
      remoteAddress: req.socket?.remoteAddress ?? null,
      fallbackClientIpAddress: purchaseIp,
    });
    const purchasedItemLabels = filesToDeliver.map((file) => file.label);

    const contentIds = items
      .map((item) => item.price?.id)
      .filter((id): id is string => Boolean(id));

    await sendConversionEvent({
      event_name: "Purchase",
      event_id: txn,
      event_source_url: purchaseEventSourceUrl,
      user_data: {
        em: purchaseEmail,
        external_id: extractMetaExternalId(transaction),
        client_ip_address: purchaseRequestSignals.clientIpAddress,
        client_user_agent: purchaseUa,
        fbc: purchaseRequestSignals.fbc,
        fbp: purchaseRequestSignals.fbp,
      },
      custom_data: {
        value: financials.total_amount ?? 0,
        currency: (financials.currency_code ?? "USD").toUpperCase(),
        content_ids: contentIds,
        content_type: "product",
      },
    });

    await sendPurchaseCompletedTelegramNotification({
      transactionId: txn,
      supportReference,
      value: financials.total_amount ?? 0,
      currency: (financials.currency_code ?? "USD").toUpperCase(),
      email: purchaseEmail,
      items: purchasedItemLabels,
    });
  } catch (error: unknown) {
    const capiMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[fulfill] Meta CAPI Purchase event failed:", capiMessage);
  }

  try {
    await ensureOrderDeliveryEmail({
      supabase,
      transactionId: txn,
      orderReference: supportReference,
      fallbackEmail: extractEmail(transaction),
      downloadLinks: emailDeliveryLinks,
      environment,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[fulfill] Transactional email delivery failed:", message);
  }

  /* ── Return download links ────────────────────────────────────── */

  if (req.method === "POST") {
    return res.status(200).json({
      status: "claimed",
      accessToken: fulfillmentAccessToken,
      orderReference: supportReference,
    });
  }

  if (downloads.every((download) => download.status === "manual_resend_required")) {
    return res.status(429).json({
      code: "manual_resend_required",
      error: "This order has reached the 4-download secure delivery limit. Contact support for a manual resend.",
      orderReference: supportReference,
    });
  }

  return res.status(200).json({
    status: "ok",
    orderReference: supportReference,
    deliveryPolicy: {
      maxSuccessfulDownloads: MAX_SUCCESSFUL_DOWNLOADS,
      signedUrlTtlSeconds: SIGNED_URL_TTL_SECONDS,
    },
    downloads,
  });
}
