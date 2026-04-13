import type { SupabaseClient } from "@supabase/supabase-js";
import { Resend } from "resend";

type OrderEmailStatus = "pending" | "sending" | "sent" | "failed" | "not_applicable";

type DeliverableAttachment = {
  key: string;
  label: string;
  bucket: string;
  path: string;
  filename: string;
};

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

type EnsureOrderAttachmentEmailDeliveryParams = {
  supabase: SupabaseClient;
  transactionId: string;
  fallbackEmail: string | null;
  files: DeliverableAttachment[];
  environment: "sandbox" | "production";
};

const MAX_TOTAL_ATTACHMENT_BYTES = 25 * 1024 * 1024;
const EMAIL_ERROR_LIMIT = 1500;

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
    ? "[Sandbox] Your AI Cloud Base files are attached"
    : "Your AI Cloud Base files are attached";
}

function buildEmailHtml(transactionId: string, files: DeliverableAttachment[]): string {
  const itemList = files
    .map((file) => `<li><strong>${file.label}</strong> (${file.filename})</li>`)
    .join("");

  return [
    "<div style=\"font-family:Arial,sans-serif;line-height:1.6;color:#111827\">",
    "<p>Thanks for your purchase.</p>",
    "<p>Your files are attached to this email and are also available from your secure download page.</p>",
    `<p><strong>Transaction ID:</strong> ${transactionId}</p>`,
    `<ul>${itemList}</ul>`,
    "<p>If anything looks wrong, reply to this email and include your transaction ID.</p>",
    "</div>",
  ].join("");
}

function buildEmailText(transactionId: string, files: DeliverableAttachment[]): string {
  const itemLines = files.map((file) => `- ${file.label} (${file.filename})`).join("\n");

  return [
    "Thanks for your purchase.",
    "",
    "Your files are attached to this email and are also available from your secure download page.",
    "",
    `Transaction ID: ${transactionId}`,
    "",
    itemLines,
    "",
    "If anything looks wrong, reply to this email and include your transaction ID.",
  ].join("\n");
}

function createResendClient(): Resend {
  const apiKey = trimEmail(process.env.RESEND_API_KEY);

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  return new Resend(apiKey);
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

async function loadEmailAttachments(
  supabase: SupabaseClient,
  files: DeliverableAttachment[],
): Promise<Array<{ content: string; filename: string }>> {
  const attachments = [] as Array<{ content: string; filename: string }>;
  let totalBytes = 0;

  for (const file of files) {
    const { data, error } = await supabase.storage
      .from(file.bucket)
      .download(file.path);

    if (error || !data) {
      throw new Error(`Failed to load attachment ${file.filename}: ${error?.message ?? "missing file data"}`);
    }

    totalBytes += data.size;
    if (totalBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
      throw new Error("Attachment payload is too large to send through Resend.");
    }

    const buffer = Buffer.from(await data.arrayBuffer());
    attachments.push({
      content: buffer.toString("base64"),
      filename: file.filename,
    });
  }

  return attachments;
}

async function markOrderEmailSent(
  supabase: SupabaseClient,
  transactionId: string,
  files: DeliverableAttachment[],
): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({
      email_status: "sent",
      email_sent_at: new Date().toISOString(),
      email_claimed_at: null,
      email_error: null,
      attachments_sent: files.map((file) => file.key),
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

export async function ensureOrderAttachmentEmailDelivery({
  supabase,
  transactionId,
  fallbackEmail,
  files,
  environment,
}: EnsureOrderAttachmentEmailDeliveryParams): Promise<void> {
  const claim = await claimOrderEmailSend(supabase, transactionId, fallbackEmail);
  if (claim.status !== "claimed") {
    return;
  }

  try {
    const resend = createResendClient();
    const { from, replyTo } = getEmailSenderConfig();
    const attachments = await loadEmailAttachments(supabase, files);

    const { error } = await resend.emails.send({
      from,
      to: [claim.recipient],
      replyTo: replyTo ?? undefined,
      subject: buildEmailSubject(environment),
      html: buildEmailHtml(transactionId, files),
      text: buildEmailText(transactionId, files),
      attachments,
    });

    if (error) {
      throw new Error(error.message);
    }

    await markOrderEmailSent(supabase, transactionId, files);
  } catch (error: unknown) {
    await markOrderEmailFailed(supabase, transactionId, error);
    throw error;
  }
}