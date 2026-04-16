import { afterEach, describe, expect, it, vi } from "vitest";

import { hashUserParam, sendConversionEvent } from "../../api/_lib/meta-capi";

describe("Meta CAPI user_data hygiene", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.META_PIXEL_ID;
    delete process.env.META_ACCESS_TOKEN;
    delete process.env.META_TEST_EVENT_CODE;
  });

  it("omits empty, placeholder, and whitespace-only user_data values", async () => {
    process.env.META_PIXEL_ID = "1687132965983563";
    process.env.META_ACCESS_TOKEN = "token-value";
    process.env.META_TEST_EVENT_CODE = "TEST71014";

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ events_received: 1, messages: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await sendConversionEvent({
      event_name: "ViewContent",
      event_id: "payload-hygiene-1",
      event_source_url: "https://aicldbase.com/",
      user_data: {
        em: "   ",
        ph: "undefined",
        country: "N/A",
        client_ip_address: "  ",
        client_user_agent: "unknown",
        fbc: " null ",
        fbp: "",
      },
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body));

    expect(body.test_event_code).toBe("TEST71014");
    expect(body.data[0].user_data).toEqual({});
  });

  it("includes only normalized real values in user_data", async () => {
    process.env.META_PIXEL_ID = "1687132965983563";
    process.env.META_ACCESS_TOKEN = "token-value";

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ events_received: 1, messages: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await sendConversionEvent({
      event_name: "Purchase",
      event_id: "payload-hygiene-2",
      event_source_url: "https://aicldbase.com/download",
      user_data: {
        em: " Buyer@Example.com ",
        ph: "+1 (555) 444-3322",
        country: " us ",
        client_ip_address: "203.0.113.10",
        client_user_agent: "Mozilla/5.0",
        fbc: "fb.1.123456789.AbCdEf",
        fbp: "fb.1.987654321.123456789",
      },
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body));

    expect(body.data[0].user_data).toEqual({
      em: [hashUserParam("buyer@example.com")],
      ph: [hashUserParam("15554443322")],
      country: [hashUserParam("us")],
      client_ip_address: "203.0.113.10",
      client_user_agent: "Mozilla/5.0",
      fbc: "fb.1.123456789.AbCdEf",
      fbp: "fb.1.987654321.123456789",
    });
  });
});