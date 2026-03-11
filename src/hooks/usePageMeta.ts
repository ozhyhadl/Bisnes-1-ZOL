import { useEffect } from "react";

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  image?: string;
}

const DEFAULTS: PageMeta = {
  title: "500+ Claude AI Skills Bundle — Automate Your Business",
  description:
    "Get 500+ pre-built Claude AI skills that handle content, marketing, finance, legal, and operations. One-time $15 purchase. Instant download. 7-day guarantee.",
  canonical: "https://aicldbase.com/",
  image: "https://aicldbase.com/og-image.png",
};

function setMetaContent(selector: string, value: string, attrName: string, attrValue: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.content = value;
}

export function usePageMeta({ title, description, canonical, image = DEFAULTS.image }: PageMeta) {
  useEffect(() => {
    document.title = title;

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;

    setMetaContent('meta[name="description"]', description, "name", "description");
    setMetaContent('meta[property="og:title"]', title, "property", "og:title");
    setMetaContent('meta[property="og:description"]', description, "property", "og:description");
    setMetaContent('meta[property="og:url"]', canonical, "property", "og:url");
    setMetaContent('meta[property="og:image"]', image ?? DEFAULTS.image ?? "", "property", "og:image");
    setMetaContent('meta[name="twitter:card"]', "summary_large_image", "name", "twitter:card");
    setMetaContent('meta[name="twitter:title"]', title, "name", "twitter:title");
    setMetaContent('meta[name="twitter:description"]', description, "name", "twitter:description");
    setMetaContent('meta[name="twitter:image"]', image ?? DEFAULTS.image ?? "", "name", "twitter:image");

    return () => {
      document.title = DEFAULTS.title;
      if (link) link.href = DEFAULTS.canonical;
      setMetaContent('meta[name="description"]', DEFAULTS.description, "name", "description");
      setMetaContent('meta[property="og:title"]', DEFAULTS.title, "property", "og:title");
      setMetaContent('meta[property="og:description"]', DEFAULTS.description, "property", "og:description");
      setMetaContent('meta[property="og:url"]', DEFAULTS.canonical, "property", "og:url");
      setMetaContent('meta[property="og:image"]', DEFAULTS.image ?? "", "property", "og:image");
      setMetaContent('meta[name="twitter:card"]', "summary_large_image", "name", "twitter:card");
      setMetaContent('meta[name="twitter:title"]', DEFAULTS.title, "name", "twitter:title");
      setMetaContent('meta[name="twitter:description"]', DEFAULTS.description, "name", "twitter:description");
      setMetaContent('meta[name="twitter:image"]', DEFAULTS.image ?? "", "name", "twitter:image");
    };
  }, [title, description, canonical, image]);
}
