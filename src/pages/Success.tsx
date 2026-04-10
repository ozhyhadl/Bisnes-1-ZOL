import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Download, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

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

function triggerBrowserDownload(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

const Success = () => {
  const [searchParams] = useSearchParams();
  const txnId = searchParams.get("_ptxn");
  const [state, setState] = useState<FulfillmentState>({ phase: "loading" });

  useEffect(() => {
    document.title = "Payment Successful — AI Cloud Base";
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
    if (!txnId) {
      setState({
        phase: "error",
        message:
          "No transaction found. If you just completed a purchase, please check your email for download instructions.",
      });
      return;
    }

    let cancelled = false;

    async function fetchDownloads() {
      try {
        const res = await fetch(
          `/api/fulfill?txn=${encodeURIComponent(txnId!)}`,
        );

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            (body as { error?: string }).error ??
              `Request failed (${res.status})`,
          );
        }

        const data = (await res.json()) as { downloads: DownloadLink[] };
        if (cancelled) return;

        setState({ phase: "ready", downloads: data.downloads });

        if (data.downloads.length > 0) {
          setTimeout(() => {
            if (!cancelled) triggerBrowserDownload(data.downloads[0].url);
          }, 800);

          data.downloads.slice(1).forEach((_dl: DownloadLink, i: number) => {
            setTimeout(() => {
              if (!cancelled) triggerBrowserDownload(data.downloads[i + 1].url);
            }, (i + 1) * 2500 + 800);
          });
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setState({ phase: "error", message });
      }
    }

    fetchDownloads();
    return () => {
      cancelled = true;
    };
  }, [txnId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        {state.phase === "loading" && <LoadingCard />}
        {state.phase === "ready" && (
          <ReadyCard downloads={state.downloads} />
        )}
        {state.phase === "error" && <ErrorCard message={state.message} />}
      </div>
    </div>
  );
};

/* ── Substates ───────────────────────────────────────────────────── */

function LoadingCard() {
  return (
    <div className="text-center space-y-6">
      <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
      <h1 className="text-2xl font-bold text-foreground">
        Verifying your payment…
      </h1>
      <p className="text-muted-foreground text-sm">
        This may take a moment. Please don't close this page.
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
          Payment Successful
        </h1>
        <p className="text-muted-foreground">
          Thank you for your purchase! Your files are ready.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <p className="text-sm text-muted-foreground text-center">
          Your download should start automatically.
        </p>

        <div className="space-y-3">
          {downloads.map((dl) => (
            <a
              key={dl.key}
              href={dl.url}
              download={dl.filename}
              className="flex items-center gap-3 w-full px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium truncate">{dl.label}</span>
            </a>
          ))}
        </div>

        <div className="border-t border-border pt-4 space-y-2 text-center">
          <p className="text-xs text-muted-foreground">
            If your download didn't start,{" "}
            {downloads.length === 1 ? (
              <a
                href={downloads[0].url}
                download={downloads[0].filename}
                className="text-primary underline underline-offset-2"
              >
                click here
              </a>
            ) : (
              "use the buttons above"
            )}
            .
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
          Something went wrong
        </h1>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          If you completed a payment, don't worry — a backup copy of your files
          will be sent to your email.
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

export default Success;
