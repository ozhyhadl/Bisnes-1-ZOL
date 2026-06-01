import { trackAnalyticsEvent } from "@/lib/analytics";
import { SALES_CONFIG } from "@/lib/sales";

export function scrollToPricingSection(source?: string): void {
  const pricingSection = document.getElementById(SALES_CONFIG.checkoutSectionId);

  if (!pricingSection) {
    return;
  }

  const top = pricingSection.getBoundingClientRect().top + window.scrollY - SALES_CONFIG.stickyHeaderOffset;

  trackAnalyticsEvent("scroll_to_pricing", { source: source ?? "unknown" });

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: "smooth",
  });
}
