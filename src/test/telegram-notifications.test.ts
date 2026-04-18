import { afterEach, describe, expect, it, vi } from "vitest";

import {
  sendCheckoutStartedTelegramNotification,
  sendPurchaseCompletedTelegramNotification,
} from "../../api/_lib/telegram";

describe("telegram notifications", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;
  });

  it("sends checkout-start notifications with a readable payload", async () => {
    process.env.TELEGRAM_BOT_TOKEN = "telegram-token";
    process.env.TELEGRAM_CHAT_ID = "375111501";

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, result: { message_id: 1 } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const result = await sendCheckoutStartedTelegramNotification({
      eventName: "InitiateCheckout",
      pageUrl: "https://aicldbase.com/",
      eventId: "evt_checkout_1",
      items: ["Claude Skills Ultimate Bundle", "1,800+ N8N Automations"],
      value: 25,
      currency: "USD",
      occurredAt: new Date("2026-04-18T23:55:00Z"),
    });

    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body));

    expect(url).toBe("https://api.telegram.org/bottelegram-token/sendMessage");
    expect(body.chat_id).toBe("375111501");
    expect(body.text).toContain("🟠 Checkout started");
    expect(body.text).toContain("Event: InitiateCheckout");
    expect(body.text).toContain("Items: Claude Skills Ultimate Bundle, 1,800+ N8N Automations");
    expect(body.text).toContain("Amount: 25 USD");
  });

  it("fails safely when Telegram API is unavailable", async () => {
    process.env.TELEGRAM_BOT_TOKEN = "telegram-token";
    process.env.TELEGRAM_CHAT_ID = "375111501";

    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      sendPurchaseCompletedTelegramNotification({
        transactionId: "txn_123",
        supportReference: "ACB-123456",
        value: 15,
        currency: "USD",
        email: "buyer@example.com",
        items: ["Claude Skills Ultimate Bundle"],
      }),
    ).resolves.toBe(false);
  });
});