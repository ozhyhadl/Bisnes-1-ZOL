import { describe, expect, it } from "vitest";

import {
  collectMetaRequestSignals,
  normalizeAndHashMetaUserParam,
} from "../../api/_lib/meta-capi-param-builder";

describe("Meta CAPI param builder adapter", () => {
  it("normalizes and hashes supported PII into the existing plain-hash payload shape", () => {
    expect(normalizeAndHashMetaUserParam(" Buyer@Example.com ", "email")).toBe(
      "6a6c26195c3682faa816966af789717c3bfa834eee6c599d667d2b3429c27cfd",
    );
    expect(normalizeAndHashMetaUserParam("+1 (555) 444-3322", "phone")).toBe(
      "37f947c3a7fb5d52c7745ca1b6babf78a4c05352a1dd6328d95f6780d6e63466",
    );
    expect(normalizeAndHashMetaUserParam(" us ", "country")).toBe(
      "79adb2a2fce5c6ba215fe5f27f532d4e7edbac4b6a5e09e1ef3a08084a904621",
    );
  });

  it("derives canonical fbc, fbp, and client_ip_address from request context without appendix noise", () => {
    const requestSignals = collectMetaRequestSignals({
      host: "aicldbase.com",
      eventSourceUrl: "https://aicldbase.com/?fbclid=test123",
      referer: "https://aicldbase.com/?fbclid=test123",
      cookieHeader: "_fbp=fb.1.987654321.123456789",
      xForwardedFor: "203.0.113.10, 10.0.0.1",
      remoteAddress: "::1",
    });

    expect(requestSignals.fbc).toMatch(/^fb\.1\.\d+\.test123$/);
    expect(requestSignals.fbp).toBe("fb.1.987654321.123456789");
    expect(requestSignals.clientIpAddress).toBe("203.0.113.10");
  });

  it("falls back to sanitized existing values when builder context cannot improve them", () => {
    const requestSignals = collectMetaRequestSignals({
      host: null,
      eventSourceUrl: null,
      referer: null,
      cookieHeader: null,
      xForwardedFor: null,
      remoteAddress: null,
      fallbackFbc: " fb.1.123456789.AbCdEf ",
      fallbackFbp: " fb.1.987654321.123456789 ",
      fallbackClientIpAddress: " 203.0.113.20 ",
    });

    expect(requestSignals).toEqual({
      fbc: "fb.1.123456789.AbCdEf",
      fbp: "fb.1.987654321.123456789",
      clientIpAddress: "203.0.113.20",
    });
  });
});