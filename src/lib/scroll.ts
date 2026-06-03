import { trackAnalyticsEvent } from "@/lib/analytics";
import { SALES_CONFIG } from "@/lib/sales";

export function scrollToPricingSection(source?: string): void {
  const pricingSection = document.getElementById(SALES_CONFIG.checkoutSectionId);

  if (!pricingSection) {
    return;
  }

  const buyNowButton = pricingSection.querySelector<HTMLButtonElement>("[data-buy-now-cta='true']");
  const scrollTarget = buyNowButton ?? pricingSection;
  const targetRect = scrollTarget.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const top = targetRect.top + window.scrollY - (viewportHeight * 0.48) + (targetRect.height * 0.5);

  trackAnalyticsEvent("scroll_to_pricing", { source: source ?? "unknown" });

  window.scrollTo({
    top: Math.max(top - SALES_CONFIG.stickyHeaderOffset, 0),
    behavior: "smooth",
  });

  if (!buyNowButton) {
    return;
  }

  window.setTimeout(() => {
    buyNowButton.focus({ preventScroll: true });
    buyNowButton.classList.remove("buy-now-scroll-focus");
    void buyNowButton.offsetWidth;
    buyNowButton.classList.add("buy-now-scroll-focus");
  }, 760);
}
