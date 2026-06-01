import { useEffect, useState } from "react";

import CTAButton from "@/components/CTAButton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCheckout } from "@/contexts/CheckoutContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { salesCopy } from "@/i18n/salesCopy";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { SALES_CONFIG } from "@/lib/sales";
import { useCountdown } from "@/hooks/useCountdown";

const ForceSalePopup = () => {
  const { openCheckout } = useCheckout();
  const { t } = useLanguage();
  const { isExpired } = useCountdown();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !isExpired) {
      return;
    }

    const wasDismissed = window.localStorage.getItem(SALES_CONFIG.storageKeys.popupDismissed) === "true";
    if (wasDismissed) {
      return;
    }

    setOpen(true);
    trackAnalyticsEvent("popup_force_sale_shown");
    trackAnalyticsEvent("offer_expired");
  }, [isExpired]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen && typeof window !== "undefined") {
      window.localStorage.setItem(SALES_CONFIG.storageKeys.popupDismissed, "true");
    }
  }

  async function handleCheckout() {
    trackAnalyticsEvent("popup_force_sale_cta_click");
    await openCheckout();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md border-border/60 bg-background/95">
        <DialogHeader>
          <DialogTitle>{t(salesCopy.popup.title)}</DialogTitle>
          <DialogDescription>{t(salesCopy.popup.body)}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:gap-2">
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            {t(salesCopy.popup.close)}
          </button>
          <CTAButton onClick={() => void handleCheckout()} analyticsLocation="force-sale-popup">
            {t(salesCopy.popup.cta)}
          </CTAButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForceSalePopup;
