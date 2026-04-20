import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { siteCopy } from "@/i18n/siteCopy";

const NotFound = () => {
  const location = useLocation();
  const { currentLanguage } = useLanguage();
  const copy = siteCopy[currentLanguage];

  useEffect(() => {
    document.title = `${copy.notFound.metaTitle} — AI Cloud Base`;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex";
    return () => {
      document.title = "AI Cloud Base";
      if (meta) meta.content = "index, follow";
    };
  }, [copy.notFound.metaTitle, location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-2 text-xl text-foreground">{copy.notFound.title}</p>
        <p className="mb-4 text-muted-foreground">{copy.notFound.body}</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          {copy.notFound.cta}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
