import { Check } from "lucide-react";

import { useCheckout } from "@/contexts/CheckoutContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { landingCopy } from "@/i18n/translations";
import ScrollReveal from "./ScrollReveal";
import n8nImage from "@/assets/n8n-workflows-upsell-optimized.jpg";

const UpsellOfferSection = () => {
  const { isN8nAdded, toggleN8nInOrder } = useCheckout();
  const { t } = useLanguage();

  const buttonClassName = isN8nAdded
    ? "border-[rgba(51,90,71,0.42)] bg-[linear-gradient(180deg,rgba(231,240,234,1),rgba(214,229,220,1))] text-[rgb(36,63,51)] shadow-[0_0_0_1px_rgba(96,128,111,0.22),0_18px_34px_rgba(41,74,60,0.14)]"
    : "upsell-cta-attention border-[rgba(121,39,31,0.58)] bg-[linear-gradient(180deg,rgba(184,74,54,1),rgba(143,49,38,1))] text-primary-foreground shadow-[0_0_0_1px_rgba(164,61,45,0.22),0_14px_30px_rgba(115,39,31,0.24)] hover:shadow-[0_0_0_1px_rgba(164,61,45,0.28),0_18px_36px_rgba(115,39,31,0.28)]";

  return (
    <section className="py-10 px-4" aria-label={t(landingCopy.upsell.title)}>
      <ScrollReveal>
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_15.5rem] md:items-start">
            <div className="min-w-0">
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
                <img
                  src={n8nImage}
                  alt={t(landingCopy.upsell.imageAlt)}
                  loading="lazy"
                  width={96}
                  height={96}
                  className="w-full sm:w-24 sm:h-24 h-40 rounded-xl object-cover shrink-0 ring-1 ring-border/70"
                />

                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center bg-primary/15 text-primary text-[10px] md:text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                    {t(landingCopy.upsell.badge)}
                  </span>
                  <h3 className="font-bold text-base md:text-lg text-foreground mb-2">
                    {t(landingCopy.upsell.title)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                    {t(landingCopy.upsell.body)}
                  </p>
                </div>
              </div>
            </div>

            <aside className="w-full rounded-2xl border border-border/80 bg-background/65 p-5 md:p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-full rounded-xl border border-border/70 bg-card/90 px-4 py-4">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
                    {t(landingCopy.upsell.cardLabel)}
                  </div>
                  <div className="flex items-end justify-center gap-3">
                    <span className="text-base font-semibold text-foreground/45 line-through decoration-2 decoration-foreground/30">
                      $15
                    </span>
                    <div className="flex flex-col items-center leading-none">
                      <span className="mb-1 text-[10px] uppercase tracking-[0.24em] text-[rgb(69,120,95)]">
                        {t(landingCopy.upsell.nowLabel)}
                      </span>
                      <span className="text-4xl font-bold text-[rgb(50,104,82)] drop-shadow-[0_10px_24px_rgba(38,82,64,0.18)] md:text-[2.75rem]">
                        $10
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleN8nInOrder}
                  aria-pressed={isN8nAdded}
                  className={`w-full min-w-[13rem] px-8 py-3.5 text-xs uppercase tracking-[0.24em] font-semibold rounded-xl border transition-all duration-300 ${isN8nAdded ? "scale-[1.01]" : ""} ${buttonClassName}`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isN8nAdded ? <Check className="h-4 w-4" /> : null}
                    {isN8nAdded ? t(landingCopy.upsell.removeButton) : t(landingCopy.upsell.addButton)}
                  </span>
                </button>

                <div className={`w-full rounded-xl px-4 py-3 text-xs leading-relaxed shadow-[0_10px_24px_rgba(15,23,42,0.05)] ${isN8nAdded ? "border border-emerald-300/70 bg-[linear-gradient(180deg,rgba(244,251,247,0.98),rgba(235,246,239,0.96))] text-slate-950" : "border border-border/70 bg-card/70 text-muted-foreground"}`}>
                  {isN8nAdded
                    ? t(landingCopy.upsell.addedHelper)
                    : t(landingCopy.upsell.notAddedHelper)}
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
