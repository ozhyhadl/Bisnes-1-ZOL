import { Check } from "lucide-react";

import { useCheckout } from "@/contexts/CheckoutContext";
import ScrollReveal from "./ScrollReveal";
import n8nImage from "@/assets/n8n-workflows-upsell.png";

const UpsellOfferSection = () => {
  const { addN8nToOrder, isN8nAdded } = useCheckout();

  const buttonClassName = isN8nAdded
    ? "bg-emerald-500 text-emerald-950 border-emerald-300 shadow-[0_0_0_1px_rgba(96,212,164,0.36),0_18px_34px_rgba(31,161,116,0.18)]"
    : "upsell-cta-attention bg-primary text-primary-foreground border-primary/70 shadow-[0_0_0_1px_rgba(200,112,70,0.2),0_14px_30px_rgba(191,101,61,0.24)] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(215,126,81,0.28),0_18px_36px_rgba(191,101,61,0.34)]";

  return (
    <section className="py-10 px-4" aria-label="Upsell offer">
      <ScrollReveal>
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_15.5rem] md:items-start">
            <div className="min-w-0">
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
                <img
                  src={n8nImage}
                  alt="1,800+ N8N workflows bundle artwork preview"
                  loading="lazy"
                  width={96}
                  height={96}
                  className="w-full sm:w-24 sm:h-24 h-40 rounded-xl object-cover shrink-0 ring-1 ring-border/70"
                />

                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center bg-primary/15 text-primary text-[10px] md:text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                    Exclusive Offer
                  </span>
                  <h3 className="font-bold text-base md:text-lg text-foreground mb-2">
                    Add 1,800+ N8N Workflows to my order
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                    Over 1,800 ready-to-go automation templates for N8N, for a huge range of tasks. Just search a keyword, download template, and upload to your N8N workspace.
                  </p>
                </div>
              </div>
            </div>

            <aside className="w-full rounded-2xl border border-border/80 bg-background/65 p-5 md:p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-full rounded-xl border border-border/70 bg-card/90 px-4 py-4">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
                    Bundle Add-On
                  </div>
                  <div className="flex items-end justify-center gap-3">
                    <span className="text-base font-semibold text-[#ff5c5c] line-through decoration-2 decoration-[#ff5c5c]">
                      $15
                    </span>
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-[#62b287] mb-1">
                        Now
                      </span>
                      <span className="text-4xl md:text-[2.75rem] font-bold text-[#4fa878] drop-shadow-[0_8px_24px_rgba(60,138,97,0.24)]">
                        $10
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addN8nToOrder}
                  disabled={isN8nAdded}
                  aria-pressed={isN8nAdded}
                  className={`w-full min-w-[13rem] px-8 py-3.5 text-xs uppercase tracking-[0.24em] font-semibold rounded-xl border transition-all duration-300 ${isN8nAdded ? "scale-[1.01]" : ""} ${buttonClassName}`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isN8nAdded ? <Check className="h-4 w-4" /> : null}
                    {isN8nAdded ? "Added to Order" : "Add to Order"}
                  </span>
                </button>

                <div className={`w-full rounded-xl px-4 py-3 text-xs leading-relaxed shadow-[0_10px_24px_rgba(15,23,42,0.05)] ${isN8nAdded ? "border border-emerald-300/70 bg-[linear-gradient(180deg,rgba(244,251,247,0.98),rgba(235,246,239,0.96))] text-slate-950" : "border border-border/70 bg-card/70 text-muted-foreground"}`}>
                  {isN8nAdded
                    ? "This add-on is now included in your order and will be delivered with your purchase."
                    : "Add this now to lock in the discounted bundle price before checkout."}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default UpsellOfferSection;
