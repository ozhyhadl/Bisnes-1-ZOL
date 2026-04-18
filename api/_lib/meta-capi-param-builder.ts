import { isIP } from "node:net";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { ParamBuilder } = require("capi-param-builder-nodejs") as typeof import("capi-param-builder-nodejs");

const META_REQUEST_DOMAINS = ["aicldbase.com", "localhost"];
const HASH_WITH_APPENDIX_RE = /^([a-f0-9]{64})\.([A-Za-z0-9+/=_-]{8})$/i;
const TRACKING_WITH_APPENDIX_RE = /^(fb\.1\.[^.]+\.[^.]+)\.([A-Za-z0-9+/=_-]{8})$/;
const APPENDIX_SEGMENT_RE = /^[A-Za-z0-9+/=_-]{8}$/;

type SupportedPiiType = "email" | "phone" | "country";

type RequestSignalInput = {
  host?: string | null;
  eventSourceUrl?: string | null;
  referer?: string | null;
  cookieHeader?: string | null;
  xForwardedFor?: string | null;
  remoteAddress?: string | null;
  fallbackFbc?: string | null;
  fallbackFbp?: string | null;
  fallbackClientIpAddress?: string | null;
};

const piiBuilder = new ParamBuilder();

export function sanitizeOptionalMetaValue(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return null;
  }

  const lowerCasedValue = normalizedValue.toLowerCase();
  if (
    lowerCasedValue === "null"
    || lowerCasedValue === "undefined"
    || lowerCasedValue === "unknown"
    || lowerCasedValue === "n/a"
    || lowerCasedValue === "na"
  ) {
    return null;
  }

  return normalizedValue;
}

function stripBuilderHashAppendix(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  const match = trimmedValue.match(HASH_WITH_APPENDIX_RE);
  if (!match) {
    return trimmedValue || null;
  }

  return match[1].toLowerCase();
}

function stripBuilderTrackingAppendix(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  const trackingMatch = trimmedValue.match(TRACKING_WITH_APPENDIX_RE);
  if (trackingMatch) {
    return trackingMatch[1];
  }

  const lastDotIndex = trimmedValue.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return trimmedValue;
  }

  const maybeAppendix = trimmedValue.slice(lastDotIndex + 1);
  const maybeBaseValue = trimmedValue.slice(0, lastDotIndex);
  if (!APPENDIX_SEGMENT_RE.test(maybeAppendix)) {
    return trimmedValue;
  }

  return isIP(maybeBaseValue) ? maybeBaseValue : trimmedValue;
}

function parseCookieHeader(cookieHeader: string | null | undefined): Record<string, string> | null {
  const normalizedCookieHeader = sanitizeOptionalMetaValue(cookieHeader);
  if (!normalizedCookieHeader) {
    return null;
  }

  const cookies: Record<string, string> = {};

  for (const segment of normalizedCookieHeader.split(";")) {
    const separatorIndex = segment.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const name = segment.slice(0, separatorIndex).trim();
    const value = segment.slice(separatorIndex + 1).trim();
    if (!name || !value) {
      continue;
    }

    cookies[name] = decodeURIComponent(value);
  }

  return Object.keys(cookies).length > 0 ? cookies : null;
}

function toQueryParams(urlValue: string | null | undefined): Record<string, string> | null {
  const normalizedUrl = sanitizeOptionalMetaValue(urlValue);
  if (!normalizedUrl) {
    return null;
  }

  try {
    const searchParams = new URL(normalizedUrl).searchParams;
    const queryParams: Record<string, string> = {};

    for (const [key, value] of searchParams.entries()) {
      if (!(key in queryParams)) {
        queryParams[key] = value;
      }
    }

    return Object.keys(queryParams).length > 0 ? queryParams : null;
  } catch {
    return null;
  }
}

function getBuilderHost(host: string | null | undefined, eventSourceUrl: string | null | undefined, referer: string | null | undefined): string | null {
  const normalizedHost = sanitizeOptionalMetaValue(host);
  if (normalizedHost) {
    return normalizedHost;
  }

  for (const candidate of [eventSourceUrl, referer]) {
    const normalizedCandidate = sanitizeOptionalMetaValue(candidate);
    if (!normalizedCandidate) {
      continue;
    }

    try {
      return new URL(normalizedCandidate).host;
    } catch {
      continue;
    }
  }

  return null;
}

export function normalizeAndHashMetaUserParam(value: string | null | undefined, dataType: SupportedPiiType): string | null {
  const sanitizedValue = sanitizeOptionalMetaValue(value);
  if (!sanitizedValue) {
    return null;
  }

  const builderValue = piiBuilder.getNormalizedAndHashedPII(sanitizedValue, dataType);
  return stripBuilderHashAppendix(builderValue);
}

export function collectMetaRequestSignals({
  host,
  eventSourceUrl,
  referer,
  cookieHeader,
  xForwardedFor,
  remoteAddress,
  fallbackFbc,
  fallbackFbp,
  fallbackClientIpAddress,
}: RequestSignalInput): {
  fbc: string | null;
  fbp: string | null;
  clientIpAddress: string | null;
} {
  const builderHost = getBuilderHost(host, eventSourceUrl, referer);
  const queryParams = toQueryParams(eventSourceUrl) ?? toQueryParams(referer);
  const requestCookies = parseCookieHeader(cookieHeader);

  let builderFbc: string | null = null;
  let builderFbp: string | null = null;
  let builderClientIp: string | null = null;

  if (builderHost) {
    const builder = new ParamBuilder(META_REQUEST_DOMAINS);
    builder.processRequest(
      builderHost,
      queryParams,
      requestCookies,
      sanitizeOptionalMetaValue(referer) ?? sanitizeOptionalMetaValue(eventSourceUrl),
      sanitizeOptionalMetaValue(xForwardedFor),
      sanitizeOptionalMetaValue(remoteAddress),
    );

    builderFbc = stripBuilderTrackingAppendix(builder.getFbc());
    builderFbp = stripBuilderTrackingAppendix(builder.getFbp());
    builderClientIp = stripBuilderTrackingAppendix(builder.getClientIpAddress());
  }

  return {
    fbc: sanitizeOptionalMetaValue(builderFbc) ?? sanitizeOptionalMetaValue(fallbackFbc),
    fbp: sanitizeOptionalMetaValue(builderFbp) ?? sanitizeOptionalMetaValue(fallbackFbp),
    clientIpAddress: sanitizeOptionalMetaValue(builderClientIp) ?? sanitizeOptionalMetaValue(fallbackClientIpAddress),
  };
}