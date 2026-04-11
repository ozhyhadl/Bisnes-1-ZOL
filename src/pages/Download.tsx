import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Download, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import { PADDLE_TRANSACTION_STORAGE_KEY } from "@/lib/paddle";

type DownloadLink = {
  key: string;
  label: string;
  filename: string;
  url: string;
};

type FulfillmentState =
  | { phase: "loading" }
  | { phase: "ready"; downloads: DownloadLink[] }
  | { phase: "error"; message: string };

async function parseFulfillmentErrorResponse(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
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

    async function fetchDownloads() {
      try {
        const res = await fetch(`/api/fulfill?txn=${encodeURIComponent(txnId)}`);

        if (!res.ok) {
          throw new Error(await parseFulfillmentErrorResponse(res));
        }

        const data = await parseFulfillmentSuccessResponse(res);
        if (cancelled) return;

        setState({ phase: "ready", downloads: data.downloads });

        if (hasTechnicalParams) {
          clearTechnicalQueryParams();
        }

        if (data.downloads.length > 0) {
          setTimeout(() => {
            if (!cancelled) triggerBrowserDownload(data.downloads[0].url);
          }, 800);

          data.downloads.slice(1).forEach((_download, index) => {
            setTimeout(() => {
              if (!cancelled) {
                triggerBrowserDownload(data.downloads[index + 1].url);
              }
            }, (index + 1) * 2500 + 800);
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
        {state.phase === "ready" && <ReadyCard downloads={state.downloads} />}
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

function ReadyCard({ downloads }: { downloads: DownloadLink[] }) {
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
          If nothing starts automatically, use the download buttons below.
        </p>

        <div className="space-y-3">
          {downloads.map((download) => (
            <a
              key={download.key}
              href={download.url}
              download={download.filename}
              className="flex items-center gap-3 w-full px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium truncate">
                {download.label}
              </span>
            </a>
          ))}
        </div>

        <div className="border-t border-border pt-4 space-y-2 text-center">
          <p className="text-xs text-muted-foreground">
            Your download links stay active for a limited time for security
            reasons.
          </p>
          <p className="text-xs text-muted-foreground">
            A backup copy will also be sent to your email.
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
            href="mailto:contact@aicldbase.com"
            className="text-primary underline underline-offset-2"
          >
            contact@aicldbase.com
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