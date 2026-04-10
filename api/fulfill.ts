import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

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
    path: "1,800+ n8n Automations.zip",
    filename: "1,800+ n8n Automations.zip",
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
    path: "1,800+ n8n Automations.zip",
    filename: "1,800+ n8n Automations.zip",
  },
};

const SIGNED_URL_TTL_SECONDS = 3600;
const FORBIDDEN_SUPABASE_PROJECT_REFS = new Set(["gjzltyiznkeyotqhqhxl"]);

/* ── Helpers ─────────────────────────────────────────────────────── */

function getPaddleEnvironment(): "sandbox" | "production" {
  return (process.env.PADDLE_ENVIRONMENT ?? "production") === "sandbox"
    ? "sandbox"
    : "production";
}

function getPaddleApiBase(): string {
  return getPaddleEnvironment() === "sandbox"
    ? "https://sandbox-api.paddle.com"
    : "https://api.paddle.com";
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

async function verifyTransaction(transactionId: string) {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    throw new Error("PADDLE_API_KEY is not configured.");
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
  last_download_at: string | null;
  fulfilled_at: string | null;
  error_message: string | null;
  source: string;
  raw_transaction_payload: unknown;
};

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
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store");

  const txn = req.query.txn;
  if (!txn || typeof txn !== "string") {
    return res.status(400).json({ error: "Missing transaction ID." });
  }

  if (!/^txn_[a-zA-Z0-9]+$/.test(txn)) {
    return res.status(400).json({ error: "Invalid transaction ID format." });
  }

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
      last_download_at: null,
      fulfilled_at: null,
      error_message: `Paddle verification failed: ${message}`,
      source: "download_page",
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

  if (transaction.status !== "completed" && transaction.status !== "paid") {
    // Log non-completed transaction
    await upsertOrder(supabase, {
      transaction_id: txn,
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
      last_download_at: null,
      fulfilled_at: null,
      error_message: `Transaction not completed (status: ${transactionStatus})`,
      source: "download_page",
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
      last_download_at: null,
      fulfilled_at: null,
      error_message: "No downloadable files found for purchased price IDs",
      source: "download_page",
      raw_transaction_payload: transaction,
    });

    return res
      .status(404)
      .json({ error: "No downloadable files found for this transaction." });
  }

  /* ── Create / update order record (pending) ───────────────────── */

  // Increment download_attempts for repeat requests
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("download_attempts")
    .eq("transaction_id", txn)
    .maybeSingle();

  const currentAttempts = existingOrder?.download_attempts ?? 0;

  await upsertOrder(supabase, {
    transaction_id: txn,
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
    download_attempts: currentAttempts + 1,
    last_download_at: null,
    fulfilled_at: null,
    error_message: null,
    source: "download_page",
    raw_transaction_payload: transaction,
  });

  /* ── Generate Supabase signed URLs ────────────────────────────── */

  const downloads: Array<{
    key: string;
    label: string;
    filename: string;
    url: string;
  }> = [];

  for (const file of filesToDeliver) {
    const { data, error } = await supabase.storage
      .from(file.bucket)
      .createSignedUrl(file.path, SIGNED_URL_TTL_SECONDS, {
        download: file.filename,
      });

    if (error || !data?.signedUrl) {
      console.error(
        `[fulfill] Signed URL failed for ${file.path}:`,
        error,
      );
      continue;
    }

    downloads.push({
      key: file.key,
      label: file.label,
      filename: file.filename,
      url: data.signedUrl,
    });
  }

  if (downloads.length === 0) {
    // Update order with error
    await upsertOrder(supabase, {
      transaction_id: txn,
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
      download_attempts: currentAttempts + 1,
      last_download_at: null,
      fulfilled_at: null,
      error_message: "Failed to generate signed URLs for all files",
      source: "download_page",
      raw_transaction_payload: transaction,
    });

    return res
      .status(500)
      .json({ error: "Failed to generate download links." });
  }

  /* ── Mark order as fulfilled ──────────────────────────────────── */

  await upsertOrder(supabase, {
    transaction_id: txn,
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
    download_links_generated: true,
    download_attempts: currentAttempts + 1,
    last_download_at: new Date().toISOString(),
    fulfilled_at: new Date().toISOString(),
    error_message: null,
    source: "download_page",
    raw_transaction_payload: transaction,
  });

  /* ── Return download links ────────────────────────────────────── */

  return res.status(200).json({
    status: "ok",
    transactionId: txn,
    downloads,
  });
}
