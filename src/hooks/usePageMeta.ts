import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
}

const DEFAULTS: PageMeta = {
  title: "500+ Claude AI Skills Bundle — Automate Your Business",
  description:
    "Get 500+ pre-built Claude AI skills that handle content, marketing, finance, legal, and operations. One-time $15 purchase. Instant download. 7-day guarantee.",
  canonical: "https://aicldbase.com/",
};

function setMetaContent(selector: string, value: string) {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = value;
}

export function usePageMeta({ title, description, canonical }: PageMeta) {
  useEffect(() => {
    document.title = title;

    const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (link) link.href = canonical;

    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', canonical);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);

    return () => {
      document.title = DEFAULTS.title;
      if (link) link.href = DEFAULTS.canonical;
      setMetaContent('meta[name="description"]', DEFAULTS.description);
      setMetaContent('meta[property="og:title"]', DEFAULTS.title);
      setMetaContent('meta[property="og:description"]', DEFAULTS.description);
      setMetaContent('meta[property="og:url"]', DEFAULTS.canonical);
      setMetaContent('meta[name="twitter:title"]', DEFAULTS.title);
      setMetaContent('meta[name="twitter:description"]', DEFAULTS.description);
    };
  }, [title, description, canonical]);
}
