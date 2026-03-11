import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import n8nImage from "@/assets/n8n-workflows.jpg";

const UpsellOfferSection = () => {
  const [added, setAdded] = useState(false);

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
              alt="1,900+ N8N automation workflow templates preview"
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
                Add 1,900+ N8N Workflows to my order
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-0">
                Over 1,900 ready-to-go automation templates for N8N, for a huge range of tasks. Just search a keyword, download template, and upload to your N8N workspace.
              </p>
            </div>

            {/* Price & Button */}
            <div className="flex flex-col w-full sm:w-auto items-center sm:items-end gap-3 shrink-0 sm:self-center">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground line-through">$15</span>
                <span className="text-xl md:text-2xl font-bold text-foreground">$10</span>
              </div>
              <button
                onClick={() => setAdded(!added)}
                className={`w-full sm:w-auto px-8 py-3 text-xs uppercase tracking-wider font-semibold rounded-lg transition-all duration-300 ${
                  added
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {added ? "Added ✓" : "Add to Order"}
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default UpsellOfferSection;
