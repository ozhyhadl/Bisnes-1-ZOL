import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Download, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import { SUPPORT_EMAIL } from "@/config/links";
import { PADDLE_TRANSACTION_STORAGE_KEY } from "@/lib/paddle";

type DownloadLink = {
  key: string;
  label: string;
  filename: string;
  url: string;
  status: "download_allowed" | "manual_resend_required";
  remainingSuccessfulDownloads: number;
};

type SignedDownload = {
  key: string;
  label: string;
  filename: string;
  url: string;
};

type FulfillmentState =
  | { phase: "loading" }
  | { phase: "ready"; downloads: DownloadLink[] }
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
): Promise<{ downloads: DownloadLink[] }> {
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

  return (await res.json()) as { downloads: DownloadLink[] };
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

function readTransactionId(searchParams: URLSearchParams): string | null {
  const queryTxnId =
    searchParams.get("txn") ??
    searchParams.get("_ptxn") ??
    searchParams.get("transaction_id");

  if (queryTxnId) {
    window.sessionStorage.setItem(PADDLE_TRANSACTION_STORAGE_KEY, queryTxnId);
    return queryTxnId;
  }

  return window.sessionStorage.getItem(PADDLE_TRANSACTION_STORAGE_KEY);
}

function clearTechnicalQueryParams() {
  window.history.replaceState(window.history.state, "", "/download");
}

const DownloadPage = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<FulfillmentState>({ phase: "loading" });

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
    const txnId = readTransactionId(searchParams);
    const hasTechnicalParams =
      searchParams.has("txn") ||
      searchParams.has("_ptxn") ||
      searchParams.has("transaction_id");

    if (!txnId) {
      setState({
        phase: "error",
        message:
          "We couldn't find your purchase details on this page. If you completed payment, check your email for the backup download link or contact support.",
      });
      return;
    }

    let cancelled = false;

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

    async function fetchDownloads() {
      try {
        const res = await fetch(`/api/fulfill?txn=${encodeURIComponent(txnId)}`);

        if (!res.ok) {
          const body = await parseApiErrorBody(res);
          if (isManualResendError(body)) {
            setState({
              phase: "manual-resend",
              message: body.error ?? "Automatic download limit reached. Please contact support for a manual resend.",
            });
            return;
          }

          throw new Error(body.error ?? `Request failed (${res.status})`);
        }

        const data = await parseFulfillmentSuccessResponse(res);
        if (cancelled) return;

        setState({ phase: "ready", downloads: data.downloads });

        if (hasTechnicalParams) {
          clearTechnicalQueryParams();
        }

        const allowedDownloads = data.downloads.filter((download) =>
          download.status === "download_allowed"
        );

        if (allowedDownloads.length > 0) {
          allowedDownloads.forEach((download, index) => {
            setTimeout(() => {
              if (!cancelled) {
                void requestDelivery(download).catch((error: unknown) => {
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
                });
              }
            }, index * 2500 + 800);
          });
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
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        {state.phase === "loading" && <LoadingCard />}
        {state.phase === "ready" && (
          <ReadyCard
            downloads={state.downloads}
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
        We are verifying your payment and generating secure file links. Please
        keep this page open.
      </p>
    </div>
  );
}

function ReadyCard(
  {
    downloads,
    onManualResend,
    onError,
  }: {
    downloads: DownloadLink[];
    onManualResend: (message: string) => void;
    onError: (message: string) => void;
  },
) {
  const availableDownloads = downloads.filter((download) => download.status === "download_allowed");
  const blockedDownloads = downloads.filter((download) => download.status === "manual_resend_required");

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
          Thanks for your order. Your files are prepared and should start
          downloading automatically.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <p className="text-sm text-muted-foreground text-center">
          If nothing starts automatically, use the secure download buttons below.
        </p>

        <div className="space-y-3">
          {availableDownloads.map((download) => (
            <button
              key={download.key}
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
              <span className="text-sm font-medium truncate flex-1 text-left">
                {download.label} • {download.remainingSuccessfulDownloads} secure retry
                {download.remainingSuccessfulDownloads === 1 ? "" : "ies"} left
              </span>
            </button>
          ))}
        </div>

        {blockedDownloads.length > 0 ? (
          <div className="border border-amber-500/30 bg-amber-500/10 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-foreground">
              Some files now require manual resend support.
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
            Each secure delivery is short-lived and tightly limited to reduce
            link sharing.
          </p>
          <p className="text-xs text-muted-foreground">
            If your automatic limit is exhausted, contact support for a manual resend.
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
          Your automatic secure download limit has been reached for this order.
        </p>
        <p className="text-sm text-muted-foreground">
          Contact us at{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-primary underline underline-offset-2"
          >
            {SUPPORT_EMAIL}
          </a>{" "}
          and we will manually resend access.
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
          If your payment went through, don't worry. We will send a backup copy
          of your files to your email.
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