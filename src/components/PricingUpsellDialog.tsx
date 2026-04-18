import { ArrowRight, Check, Sparkles } from "lucide-react";

import pricingUpsellImage from "@/assets/n8n-workflows-upsell-optimized.jpg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PricingUpsellDialogProps = {
  open: boolean;
  isCheckoutLoading: boolean;
  isN8nAdded: boolean;
  onOpenChange: (open: boolean) => void;
  onUpsellChoice: (includeN8n: boolean) => void;
};

const PricingUpsellDialog = ({
  open,
  isCheckoutLoading,
  isN8nAdded,
  onOpenChange,
  onUpsellChoice,
}: PricingUpsellDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/80 bg-[linear-gradient(180deg,rgba(255,252,247,0.98),rgba(249,245,238,0.98))] p-0 shadow-[0_28px_90px_rgba(30,24,18,0.24)]">
        <div className="rounded-[inherit] p-6 sm:p-7">
          <DialogHeader className="space-y-3 text-left">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Exclusive Offer
            </div>
            <DialogTitle className="text-2xl font-bold leading-tight text-foreground">
              Add 1,800+ N8N workflows to this order for $10
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              Get the ready-made automation bundle as a one-click add-on before secure checkout.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 flex gap-4 rounded-2xl border border-border/70 bg-background/80 p-4">
            <img
              src={pricingUpsellImage}
              alt="1,800 plus N8N workflows bundle artwork"
              width={96}
              height={96}
              className="h-24 w-24 shrink-0 rounded-xl object-cover ring-1 ring-border/70"
              loading="lazy"
            />
            <div className="min-w-0 text-left">
              <p className="text-sm font-semibold text-foreground">N8N Integration Automation Bundle</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Add the discounted bundle now and receive it with the same secure delivery flow.
              </p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-sm font-semibold text-[#ff6a6a] line-through decoration-2 decoration-[#ff6a6a]">$15</span>
                <span className="text-3xl font-bold text-[#4fa878]">$10</span>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={() => onUpsellChoice(true)}
              disabled={isCheckoutLoading}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/70 bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isN8nAdded ? <Check className="h-4 w-4" aria-hidden="true" /> : <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              {isCheckoutLoading ? "Opening Checkout..." : "Add to Order"}
            </button>
            <button
              type="button"
              onClick={() => onUpsellChoice(false)}
              disabled={isCheckoutLoading}
              className="flex min-h-11 w-full items-center justify-center rounded-xl border border-border bg-background/92 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
            >
              Continue Without Add-On
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingUpsellDialog;