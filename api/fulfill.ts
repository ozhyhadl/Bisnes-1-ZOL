import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

/* ── Price-ID → Storage-file mapping ─────────────────────────────── */

type StorageFile = {
  key: string;
  label: string;
  bucket: string;
  path: string;
  filename: string;
};

const STORAGE_MAP: Record<string, StorageFile> = {
  // Live
  "pri_01knwef8ref9gbw6pw9gmfh35t": {
    key: "skills",
    label: "AI Skills Bundle",
    bucket: "downloads",
    path: "skills-bundle.zip",
    filename: "AI-Cloud-Base-Skills-Bundle.zip",
  },
  "pri_01knwembd2ftzz0cw9gksxfh10": {
    key: "n8n",
    label: "N8N Workflows Bundle",
    bucket: "downloads",
    path: "n8n-bundle.zip",
    filename: "N8N-Workflows-Bundle.zip",
  },
  // Sandbox (same storage files for testing)
  "pri_01knwqfr26gjr7sab6hckwwz8y": {
    key: "skills",
    label: "AI Skills Bundle",
    bucket: "downloads",
    path: "skills-bundle.zip",
    filename: "AI-Cloud-Base-Skills-Bundle.zip",
  },
  "pri_01knwqdeyp432a33ayh3b209ps": {
    key: "n8n",
    label: "N8N Workflows Bundle",
    bucket: "downloads",
    path: "n8n-bundle.zip",
    filename: "N8N-Workflows-Bundle.zip",
  },
};

const SIGNED_URL_TTL_SECONDS = 3600;

/* ── Helpers ─────────────────────────────────────────────────────── */

function getPaddleApiBase(): string {
  const env = process.env.PADDLE_ENVIRONMENT ?? "production";
  return env === "sandbox"
    ? "https://sandbox-api.paddle.com"
    : "https://api.paddle.com";
}

async function verifyTransaction(transactionId: string) {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    throw new Error("PADDLE_API_KEY is not configured.");
  }

  const url = `${getPaddleApiBase()}/transactions/${encodeURIComponent(transactionId)}`;
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

  /* ── Verify Paddle transaction ────────────────────────────────── */

  let transaction: Record<string, unknown>;
  try {
    transaction = await verifyTransaction(txn);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[fulfill] Paddle verification failed:", message);
    return res
      .status(502)
      .json({ error: "Unable to verify payment. Please try again later." });
  }

  if (transaction.status !== "completed" && transaction.status !== "paid") {
    return res.status(403).json({
      error: `Transaction is not completed (status: ${String(transaction.status)}).`,
    });
  }

  /* ── Map purchased items to storage files ─────────────────────── */

  const items = (transaction.items ?? []) as Array<{
    price: { id: string };
  }>;
  const seen = new Set<string>();
  const filesToDeliver: StorageFile[] = [];

  for (const item of items) {
    const priceId = item.price?.id;
    if (priceId && STORAGE_MAP[priceId] && !seen.has(priceId)) {
      seen.add(priceId);
      filesToDeliver.push(STORAGE_MAP[priceId]);
    }
  }

  if (filesToDeliver.length === 0) {
    console.error("[fulfill] No downloadable files for transaction:", txn);
    return res
      .status(404)
      .json({ error: "No downloadable files found for this transaction." });
  }

  /* ── Generate Supabase signed URLs ────────────────────────────── */

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "[fulfill] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    );
    return res.status(500).json({ error: "Storage configuration error." });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

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
    return res
      .status(500)
      .json({ error: "Failed to generate download links." });
  }

  /* ── Return download links ────────────────────────────────────── */

  return res.status(200).json({
    status: "ok",
    transactionId: txn,
    downloads,
  });
}
