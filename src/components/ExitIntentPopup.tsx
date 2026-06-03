import { useEffect, useState } from "react";

import CTAButton from "@/components/CTAButton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCheckout } from "@/contexts/CheckoutContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { salesCopy } from "@/i18n/salesCopy";
import { trackAnalyticsEvent } from "@/lib/analytics";

const SESSION_KEY = "aicldbase_exit_intent_shown";

const ExitIntentPopup = () => {
  const { openCheckout } = useCheckout();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) {
      return;
    }

    if (window.sessionStorage.getItem(SESSION_KEY) === "true") {
      return;
    }

    const handleMouseLeave = (event: MouseEvent) => {
      if (event.clientY > 0) {
        return;
      }

      window.sessionStorage.setItem(SESSION_KEY, "true");
      setOpen(true);
      trackAnalyticsEvent("exit_intent_shown");
    };

    document.addEventListener("mouseout", handleMouseLeave);
    return () => document.removeEventListener("mouseout", handleMouseLeave);
  }, []);

  async function handleCheckout() {
    await openCheckout();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md border-border/60 bg-background/95">
        <DialogHeader>
          <DialogTitle>{t(salesCopy.exitIntent.title)}</DialogTitle>
          <DialogDescription>{t(salesCopy.exitIntent.body)}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            {t(salesCopy.exitIntent.close)}
          </button>
          <CTAButton onClick={() => void handleCheckout()} analyticsLocation="exit-intent-popup">
            {t(salesCopy.exitIntent.cta)}
          </CTAButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
