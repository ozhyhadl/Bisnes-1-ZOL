import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockSendConversionEvent = vi.fn();
const mockExtractClientIp = vi.fn();
const mockExtractUserAgent = vi.fn();
const mockCollectMetaRequestSignals = vi.fn();
const mockSendCheckoutStartedTelegramNotification = vi.fn();

vi.mock("../../api/_lib/meta-capi.js", () => ({
  sendConversionEvent: (...args: unknown[]) => mockSendConversionEvent(...args),
  extractClientIp: (...args: unknown[]) => mockExtractClientIp(...args),
  extractUserAgent: (...args: unknown[]) => mockExtractUserAgent(...args),
}));

vi.mock("../../api/_lib/meta-capi-param-builder.js", () => ({
  collectMetaRequestSignals: (...args: unknown[]) => mockCollectMetaRequestSignals(...args),
}));

vi.mock("../../api/_lib/telegram.js", () => ({
  sendCheckoutStartedTelegramNotification: (...args: unknown[]) => mockSendCheckoutStartedTelegramNotification(...args),
}));

describe("meta-event telegram integration", () => {
  beforeEach(() => {
    mockSendConversionEvent.mockReset();
    mockExtractClientIp.mockReset();
    mockExtractUserAgent.mockReset();
    mockCollectMetaRequestSignals.mockReset();
    mockSendCheckoutStartedTelegramNotification.mockReset();

    mockSendConversionEvent.mockResolvedValue({ ok: true, response: { events_received: 1 } });
    mockExtractClientIp.mockReturnValue("203.0.113.10");
    mockExtractUserAgent.mockReturnValue("Mozilla/5.0");
    mockCollectMetaRequestSignals.mockReturnValue({
      clientIpAddress: "203.0.113.10",
      fbc: "fb.1.123456789.AbCdEf",
      fbp: "fb.1.987654321.123456789",
    });
    mockSendCheckoutStartedTelegramNotification.mockResolvedValue(true);
  });

  afterEach(() => {
    vi.resetModules();
  });

  it("sends a telegram notification for a real InitiateCheckout event", async () => {
    const { default: handler } = await import("../../api/meta-event");

    const req = {
      method: "POST",
      body: {
        event_name: "InitiateCheckout",
        event_id: "evt_checkout_1",
        event_source_url: "https://aicldbase.com/",
        notification_context: {
          items: ["Claude Skills Ultimate Bundle"],
          value: 15,
          currency: "USD",
        },
      },
      headers: {
        host: "aicldbase.com",
        referer: "https://aicldbase.com/",
        cookie: "_fbp=fb.1.987654321.123456789",
      },
      socket: { remoteAddress: "203.0.113.10" },
    } as any;

    const res = {
      setHeader: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as any;

    await handler(req, res);

    expect(mockSendConversionEvent).toHaveBeenCalledTimes(1);
    expect(mockSendConversionEvent).toHaveBeenCalledWith({
      event_name: "InitiateCheckout",
      event_id: "evt_checkout_1",
      event_source_url: "https://aicldbase.com/",
      user_data: {
        client_ip_address: "203.0.113.10",
        client_user_agent: "Mozilla/5.0",
        fbc: "fb.1.123456789.AbCdEf",
        fbp: "fb.1.987654321.123456789",
      },
    });
    expect(mockSendCheckoutStartedTelegramNotification).toHaveBeenCalledWith({
      eventName: "InitiateCheckout",
      pageUrl: "https://aicldbase.com/",
      eventId: "evt_checkout_1",
      items: ["Claude Skills Ultimate Bundle"],
      value: 15,
      currency: "USD",
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });
});