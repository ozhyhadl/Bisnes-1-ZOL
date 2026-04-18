type CheckoutStartedNotificationInput = {
  eventName: string;
  pageUrl?: string | null;
  eventId?: string | null;
  items?: string[];
  value?: number | null;
  currency?: string | null;
  occurredAt?: Date;
};

type PurchaseCompletedNotificationInput = {
  transactionId: string;
  supportReference?: string | null;
  value?: number | null;
  currency?: string | null;
  email?: string | null;
  items?: string[];
  occurredAt?: Date;
};

function getTelegramBotToken(): string | null {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  return token ? token : null;
}

function getTelegramChatId(): string | null {
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  return chatId ? chatId : null;
}

function isFiniteNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeOptionalString(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized ? normalized : null;
}

function normalizeItems(items: string[] | null | undefined): string[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => normalizeOptionalString(item))
    .filter((item): item is string => Boolean(item));
}

function formatAmount(value: number | null | undefined, currency: string | null | undefined): string | null {
  const normalizedCurrency = normalizeOptionalString(currency)?.toUpperCase() ?? null;

  if (!isFiniteNumber(value) && !normalizedCurrency) {
    return null;
  }

  if (!isFiniteNumber(value)) {
    return normalizedCurrency;
  }

  const rounded = Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.00$/, "");
  return normalizedCurrency ? `${rounded} ${normalizedCurrency}` : rounded;
}

function formatTimestamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function buildCheckoutStartedMessage({
  eventName,
  pageUrl,
  eventId,
  items,
  value,
  currency,
  occurredAt = new Date(),
}: CheckoutStartedNotificationInput): string {
  const lines = ["🟠 Checkout started", "", `Event: ${eventName}`];
  const normalizedPageUrl = normalizeOptionalString(pageUrl);
  const normalizedEventId = normalizeOptionalString(eventId);
  const normalizedItems = normalizeItems(items);
  const amount = formatAmount(value, currency);

  if (normalizedPageUrl) {
    lines.push(`Page: ${normalizedPageUrl}`);
  }

  if (normalizedEventId) {
    lines.push(`Event ID: ${normalizedEventId}`);
  }

  if (normalizedItems.length > 0) {
    lines.push(`Items: ${normalizedItems.join(", ")}`);
  }

  if (amount) {
    lines.push(`Amount: ${amount}`);
  }

  lines.push(`Time: ${formatTimestamp(occurredAt)}`);
  return lines.join("\n");
}

function buildPurchaseCompletedMessage({
  transactionId,
  supportReference,
  value,
  currency,
  email,
  items,
  occurredAt = new Date(),
}: PurchaseCompletedNotificationInput): string {
  const lines = ["🟢 Purchase completed", "", `Transaction: ${transactionId}`];
  const normalizedSupportReference = normalizeOptionalString(supportReference);
  const normalizedEmail = normalizeOptionalString(email);
  const normalizedItems = normalizeItems(items);
  const amount = formatAmount(value, currency);

  if (normalizedSupportReference) {
    lines.push(`Order: ${normalizedSupportReference}`);
  }

  if (amount) {
    lines.push(`Amount: ${amount}`);
  }

  if (normalizedEmail) {
    lines.push(`Email: ${normalizedEmail}`);
  }

  if (normalizedItems.length > 0) {
    lines.push("Items:");
    normalizedItems.forEach((item) => {
      lines.push(`- ${item}`);
    });
  }

  lines.push(`Time: ${formatTimestamp(occurredAt)}`);
  return lines.join("\n");
}

async function sendTelegramText(text: string): Promise<boolean> {
  const token = getTelegramBotToken();
  const chatId = getTelegramChatId();

  if (!token || !chatId) {
    console.warn("[telegram] Skipping notification: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      console.error(`[telegram] sendMessage failed (${response.status}): ${responseText}`);
      return false;
    }

    return true;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[telegram] sendMessage network error:", message);
    return false;
  }
}

export async function sendCheckoutStartedTelegramNotification(
  input: CheckoutStartedNotificationInput,
): Promise<boolean> {
  return sendTelegramText(buildCheckoutStartedMessage(input));
}

export async function sendPurchaseCompletedTelegramNotification(
  input: PurchaseCompletedNotificationInput,
): Promise<boolean> {
  return sendTelegramText(buildPurchaseCompletedMessage(input));
}