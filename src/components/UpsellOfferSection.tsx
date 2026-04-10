import { useCheckout } from "@/contexts/CheckoutContext";
import ScrollReveal from "./ScrollReveal";
import n8nImage from "@/assets/n8n-workflows.webp";

const UpsellOfferSection = () => {
  const { addN8nToOrder, isN8nAdded } = useCheckout();

  const buttonClassName = isN8nAdded
    ? "bg-primary text-primary-foreground cursor-default border-primary/70 shadow-[0_0_0_1px_rgba(200,112,70,0.22),0_14px_30px_rgba(191,101,61,0.18)]"
    : "upsell-cta-attention bg-primary text-primary-foreground border-primary/70 shadow-[0_0_0_1px_rgba(200,112,70,0.2),0_14px_30px_rgba(191,101,61,0.24)] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(215,126,81,0.28),0_18px_36px_rgba(191,101,61,0.34)]";

  return (
    <section className="py-10 px-4" aria-label="Upsell offer">
      <ScrollReveal>
        <div className="max-w-2xl mx-auto">
          <div
            className="bg-card border border-border rounded-xl p-6 md:p-8 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start"
          >
            {/* Thumbnail */}
            <img
              src={n8nImage}
              alt="1,800+ N8N automation workflow templates preview"
              loading="lazy"
              width={96}
              height={96}
              className="w-full sm:w-24 sm:h-24 h-40 rounded-lg object-cover shrink-0"
            />

            {/* Content */}
            <div className="flex-1 min-w-0 w-full">
              <span className="inline-block bg-primary/15 text-primary text-[10px] md:text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                Exclusive Offer
              </span>
              <h3 className="font-bold text-base md:text-lg mb-2">
                Add 1,800+ N8N Workflows to my order
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-0">
                Over 1,800 ready-to-go automation templates for N8N, for a huge range of tasks. Just search a keyword, download template, and upload to your N8N workspace.
              </p>
            </div>

            {/* Price & Button */}
            <div className="flex flex-col w-full sm:w-auto items-center sm:items-end gap-3 shrink-0 sm:self-center">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground line-through">$15</span>
                <span className="text-xl md:text-2xl font-bold text-foreground">$10</span>
              </div>
              <button
                type="button"
                onClick={addN8nToOrder}
                disabled={isN8nAdded}
                aria-pressed={isN8nAdded}
                className={`w-full sm:w-auto min-w-[13rem] px-8 py-3.5 text-xs uppercase tracking-[0.24em] font-semibold rounded-xl border transition-all duration-300 ${buttonClassName}`}
              >
                {isN8nAdded ? "Added to Order" : "Add to Order"}
              </button>
              {isN8nAdded ? (
                <p className="text-[10px] text-primary text-center sm:text-right font-medium">
                  N8N Integrations Bundle will be included in checkout.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default UpsellOfferSection;
