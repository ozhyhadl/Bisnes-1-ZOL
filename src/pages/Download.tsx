import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Download, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import { SUPPORT_EMAIL } from "@/config/links";
import {
  claimFulfillmentAccess,
  clearPendingFulfillmentClaimAccessToken,
  clearPendingFulfillmentTransactionId,
  PADDLE_FULFILLMENT_ACCESS_TOKEN_STORAGE_KEY,
  readPendingFulfillmentClaimAccessToken,
  readPendingFulfillmentTransactionId,
} from "@/lib/paddle";

const PENDING_CLAIM_RETRY_DELAY_MS = 1200;
const MAX_PENDING_CLAIM_RETRIES = 8;

type DownloadLink = {
  key: string;
  label: string;
  filename: string;
  url: string;
  status: "download_allowed" | "manual_resend_required";
  remainingSuccessfulDownloads: number;
  maxSuccessfulDownloads: number;
  signedUrlTtlSeconds: number;
};

type DeliveryPolicy = {
  maxSuccessfulDownloads: number;
  signedUrlTtlSeconds: number;
};

type SignedDownload = {
  key: string;
  label: string;
  filename: string;
  url: string;
};

type FulfillmentState =
  | { phase: "loading" }
  | { phase: "ready"; downloads: DownloadLink[]; deliveryPolicy: DeliveryPolicy; orderReference: string | null }
  | { phase: "manual-resend"; message: string }
  | { phase: "error"; message: string };

type ApiErrorBody = {
  error?: string;
  code?: string;
};

function isManualResendError(body: ApiErrorBody): boolean {
  return body.code === "manual_resend_required";
}

async function parseFulfillmentErrorResponse(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await res.json().catch(() => ({}))) as ApiErrorBody;
    return body.error ?? `Request failed (${res.status})`;
  }

  const bodyText = await res.text().catch(() => "");
  if (
    bodyText.includes("import ") ||
    bodyText.includes("<!doctype html") ||
    bodyText.includes("<html")
  ) {
    return "Local fulfillment API returned unexpected content. Restart the dev server and reload this page.";
  }

  return bodyText || `Request failed (${res.status})`;
}

async function parseFulfillmentSuccessResponse(
  res: Response,
): Promise<{ downloads: DownloadLink[]; deliveryPolicy: DeliveryPolicy; orderReference: string | null }> {
  const contentType = res.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const bodyText = await res.text().catch(() => "");
    if (
      bodyText.includes("import ") ||
      bodyText.includes("<!doctype html") ||
      bodyText.includes("<html")
    ) {
      throw new Error(
        "Local fulfillment API returned unexpected content. Restart the dev server and reload this page.",
      );
    }

    throw new Error("Fulfillment endpoint returned a non-JSON response.");
  }

  return (await res.json()) as {
    downloads: DownloadLink[];
    deliveryPolicy: DeliveryPolicy;
    orderReference: string | null;
  };
}

async function parseApiErrorBody(res: Response): Promise<ApiErrorBody> {
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return { error: await parseFulfillmentErrorResponse(res) };
  }

  return (await res.json().catch(() => ({}))) as ApiErrorBody;
}

async function parseDeliverySuccessResponse(
  res: Response,
): Promise<{ download: SignedDownload; remainingSuccessfulDownloads: number }> {
  const contentType = res.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error("Delivery endpoint returned a non-JSON response.");
  }

  return (await res.json()) as {
    download: SignedDownload;
    remainingSuccessfulDownloads: number;
  };
}

function triggerBrowserDownload(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function readFulfillmentAccessToken(searchParams: URLSearchParams): string | null {
  const queryAccessToken = searchParams.get("access");

  if (queryAccessToken) {
    window.sessionStorage.setItem(
      PADDLE_FULFILLMENT_ACCESS_TOKEN_STORAGE_KEY,
      queryAccessToken,
    );
    return queryAccessToken;
  }

  return window.sessionStorage.getItem(PADDLE_FULFILLMENT_ACCESS_TOKEN_STORAGE_KEY);
}

function clearTechnicalQueryParams(searchParams: URLSearchParams) {
  const nextSearchParams = new URLSearchParams();
  const selectedFileKey = searchParams.get("file");

  if (selectedFileKey) {
    nextSearchParams.set("file", selectedFileKey);
  }

  const nextQuery = nextSearchParams.toString();
  window.history.replaceState(
    window.history.state,
    "",
    nextQuery ? `/download?${nextQuery}` : "/download",
  );
}

const DownloadPage = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<FulfillmentState>({ phase: "loading" });
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    document.title = "Your Download Is Ready — AI Cloud Base";
    let robotsMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    );
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.name = "robots";
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = "noindex";
    return () => {
      document.title =
        "500+ Claude AI Skills Bundle — Automate Your Business";
      if (robotsMeta) robotsMeta.content = "index, follow";
    };
  }, []);

  useEffect(() => {
    const accessToken = readFulfillmentAccessToken(searchParams);
    const selectedFileKey = searchParams.get("file");
    const hasTechnicalParams = searchParams.has("access");
    const pendingClaimAccessToken = readPendingFulfillmentClaimAccessToken();
    const shouldRetryPendingClaim = pendingClaimAccessToken === accessToken;
    const shouldAutoStartDownloads = refreshNonce === 0;

    if (!accessToken) {
      setState({
        phase: "error",
        message:
          "We couldn't find your purchase details on this page. If you completed payment, check your email for the backup download link or contact support.",
      });
      return;
    }

    let cancelled = false;

    function refreshDownloads() {
      setRefreshNonce((current) => current + 1);
    }

    async function requestDelivery(download: DownloadLink) {
      const res = await fetch(download.url);

      if (!res.ok) {
        const body = await parseApiErrorBody(res);
        if (isManualResendError(body)) {
          throw Object.assign(new Error(body.error ?? "Manual resend required."), {
            code: "manual_resend_required",
          });
        }

        throw new Error(body.error ?? `Request failed (${res.status})`);
      }

      const data = await parseDeliverySuccessResponse(res);
      triggerBrowserDownload(data.download.url);
      return data;
    }

    async function fetchDownloads(retryAttempt = 0) {
      try {
        const res = await fetch(`/api/fulfill?access=${encodeURIComponent(accessToken)}`);

        if (!res.ok) {
          const body = await parseApiErrorBody(res);
          if (isManualResendError(body)) {
            setState({
              phase: "manual-resend",
              message: body.error ?? "This file has reached its 4-download limit. Contact support for a manual resend.",
            });
            return;
          }

          if (
            res.status === 404 &&
            shouldRetryPendingClaim &&
            retryAttempt < MAX_PENDING_CLAIM_RETRIES
          ) {
            if (retryAttempt === 0) {
              const pendingTxnId = readPendingFulfillmentTransactionId();
              if (pendingTxnId) {
                try {
                  await claimFulfillmentAccess(pendingTxnId, accessToken);
                  clearPendingFulfillmentTransactionId();
                } catch {
                  /* claim may have already succeeded via keepalive — retry GET will confirm */
                }
              }
            }

            window.setTimeout(() => {
              if (!cancelled) {
                void fetchDownloads(retryAttempt + 1);
              }
            }, PENDING_CLAIM_RETRY_DELAY_MS);
            return;
          }

          if (
            res.status === 404 &&
            shouldRetryPendingClaim &&
            retryAttempt >= MAX_PENDING_CLAIM_RETRIES
          ) {
            clearPendingFulfillmentClaimAccessToken(accessToken);
            clearPendingFulfillmentTransactionId();
            throw new Error(
              "We are still finalizing your secure access after payment. Please reload this page once or use the email download link if it already arrived.",
            );
          }

          throw new Error(body.error ?? `Request failed (${res.status})`);
        }

        const data = await parseFulfillmentSuccessResponse(res);
        if (cancelled) return;

        clearPendingFulfillmentClaimAccessToken(accessToken);

        setState({
          phase: "ready",
          downloads: data.downloads,
          deliveryPolicy: data.deliveryPolicy,
          orderReference: data.orderReference,
        });

        if (hasTechnicalParams) {
          clearTechnicalQueryParams(searchParams);
        }

        const allowedDownloads = data.downloads.filter((download) =>
          download.status === "download_allowed"
        );
        const downloadsToAutoStart = selectedFileKey
          ? allowedDownloads.filter((download) => download.key === selectedFileKey)
          : allowedDownloads;

        if (shouldAutoStartDownloads && downloadsToAutoStart.length > 0) {
          void (async () => {
            try {
              for (let index = 0; index < downloadsToAutoStart.length; index += 1) {
                if (index > 0) {
                  await new Promise((resolve) => window.setTimeout(resolve, 2500));
                }

                if (cancelled) {
                  return;
                }

                await requestDelivery(downloadsToAutoStart[index]);
              }

              if (!cancelled) {
                refreshDownloads();
              }
            } catch (error: unknown) {
              if (cancelled) {
                return;
              }

              const message = error instanceof Error
                ? error.message
                : "We couldn't prepare your secure download right now.";
              const manualResend = error instanceof Error && "code" in error && error.code === "manual_resend_required";

              setState(
                manualResend
                  ? { phase: "manual-resend", message }
                  : { phase: "error", message },
              );
            }
          })();
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : "We couldn't prepare your download right now.";
        setState({ phase: "error", message });
      }
    }

    fetchDownloads();
    return () => {
      cancelled = true;
    };
  }, [searchParams, refreshNonce]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        {state.phase === "loading" && <LoadingCard />}
        {state.phase === "ready" && (
          <ReadyCard
            downloads={state.downloads}
            deliveryPolicy={state.deliveryPolicy}
            orderReference={state.orderReference}
            onDownloadSuccess={() => setRefreshNonce((current) => current + 1)}
            onManualResend={(message) => setState({ phase: "manual-resend", message })}
            onError={(message) => setState({ phase: "error", message })}
          />
        )}
        {state.phase === "manual-resend" && <ManualResendCard message={state.message} />}
        {state.phase === "error" && <ErrorCard message={state.message} />}
      </div>
    </div>
  );
};

function LoadingCard() {
  return (
    <div className="text-center space-y-6">
      <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
      <h1 className="text-2xl font-bold text-foreground">
        Preparing your download…
      </h1>
      <p className="text-muted-foreground text-sm">
        We are verifying your payment and preparing secure download links. Please
        keep this page open.
      </p>
    </div>
  );
}

function ReadyCard(
  {
    downloads,
    deliveryPolicy,
    orderReference,
    onDownloadSuccess,
    onManualResend,
    onError,
  }: {
    downloads: DownloadLink[];
    deliveryPolicy: DeliveryPolicy;
    orderReference: string | null;
    onDownloadSuccess: () => void;
    onManualResend: (message: string) => void;
    onError: (message: string) => void;
  },
) {
  const [usageOverrides, setUsageOverrides] = useState<Record<string, number>>({});

  useEffect(() => {
    setUsageOverrides({});
  }, [downloads]);

  const availableDownloads = downloads.filter((download) => download.status === "download_allowed");
  const blockedDownloads = downloads.filter((download) => download.status === "manual_resend_required");

  function getRemainingDownloads(download: DownloadLink): number {
    return usageOverrides[download.key] ?? download.remainingSuccessfulDownloads;
  }

  async function handleSecureDownload(download: DownloadLink) {
    const res = await fetch(download.url);

    if (!res.ok) {
      const body = await parseApiErrorBody(res);
      if (isManualResendError(body)) {
        throw Object.assign(new Error(body.error ?? "Manual resend required."), {
          code: "manual_resend_required",
        });
      }

      throw new Error(body.error ?? `Request failed (${res.status})`);
    }

    const data = await parseDeliverySuccessResponse(res);
    triggerBrowserDownload(data.download.url);

    setUsageOverrides((prev) => ({
      ...prev,
      [download.key]: data.remainingSuccessfulDownloads,
    }));

    onDownloadSuccess();
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-500/15 rounded-full mx-auto flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Your Download Is Ready
        </h1>
        <p className="text-muted-foreground">
          Thanks for your order. Your secure file links should start downloading automatically.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <p className="text-sm text-muted-foreground text-center">
          If nothing starts automatically, use the secure download buttons below.
        </p>
        <div className="rounded-lg border border-border/80 bg-background/70 px-4 py-3 text-center text-xs leading-relaxed text-muted-foreground">
          Each file supports up to {deliveryPolicy.maxSuccessfulDownloads} successful downloads. Every issued file link stays active for {deliveryPolicy.signedUrlTtlSeconds / 3600} hours.
        </div>

        {orderReference ? (
          <div className="rounded-lg border border-border/80 bg-background/70 px-4 py-3 text-center text-xs leading-relaxed text-muted-foreground">
            Order reference: <span className="font-semibold text-foreground">{orderReference}</span>
          </div>
        ) : null}

        <div className="space-y-4">
          {availableDownloads.map((download) => {
            const remaining = getRemainingDownloads(download);
            const usedDownloads = download.maxSuccessfulDownloads - remaining;

            return (
              <div key={download.key}>
                <button
                  type="button"
                  onClick={() => {
                    void handleSecureDownload(download).catch((error: unknown) => {
                      const message = error instanceof Error
                        ? error.message
                        : "We couldn't prepare your secure download right now.";
                      const manualResend = error instanceof Error && "code" in error && error.code === "manual_resend_required";

                      if (manualResend) {
                        onManualResend(message);
                        return;
                      }

                      onError(message);
                    });
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium flex-1 text-left truncate">
                    {download.label}
                  </span>
                </button>
                <p className="mt-1.5 text-center text-xs text-muted-foreground">
                  {usedDownloads} of {download.maxSuccessfulDownloads} downloads used
                </p>
              </div>
            );
          })}
        </div>

        {blockedDownloads.length > 0 ? (
          <div className="border border-amber-500/30 bg-amber-500/10 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-foreground">
              Some files have used all {deliveryPolicy.maxSuccessfulDownloads} secure downloads and now require manual resend support.
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {blockedDownloads.map((download) => (
                <li key={download.key}>{download.label}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="border-t border-border pt-4 space-y-2 text-center">
          <p className="text-xs text-muted-foreground">
            Each issued file link stays active for {deliveryPolicy.signedUrlTtlSeconds / 3600} hours and is limited to {deliveryPolicy.maxSuccessfulDownloads} successful downloads per file.
          </p>
          <p className="text-xs text-muted-foreground">
            If that limit is exhausted, contact support for a manual resend.
          </p>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to AI Cloud Base
        </Link>
      </div>
    </div>
  );
}

function ManualResendCard({ message }: { message: string }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-amber-500/15 rounded-full mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Manual resend required
        </h1>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Your order has reached the limit of 4 successful secure downloads for this file.
        </p>
        <p className="text-sm text-muted-foreground">
          Contact us at{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-primary underline underline-offset-2"
          >
            {SUPPORT_EMAIL}
          </a>{" "}
          and we will help with a manual resend.
        </p>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to AI Cloud Base
        </Link>
      </div>
    </div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/15 rounded-full mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          We couldn't prepare your download yet
        </h1>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          If your payment went through, don't worry. We can resend fresh secure download links to your email.
        </p>
        <p className="text-sm text-muted-foreground">
          Each file link stays active for 24 hours after it is issued and supports up to 4 successful downloads.
        </p>
        <p className="text-sm text-muted-foreground">
          You can also contact us at{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-primary underline underline-offset-2"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>

      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to AI Cloud Base
        </Link>
      </div>
    </div>
  );
}

export default DownloadPage;