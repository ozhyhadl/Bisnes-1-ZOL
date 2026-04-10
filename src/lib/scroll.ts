const PRICING_SECTION_ID = "pricing";
const STICKY_HEADER_OFFSET = 88;

export function scrollToPricingSection(): void {
  const pricingSection = document.getElementById(PRICING_SECTION_ID);

  if (!pricingSection) {
    return;
  }

  const top = pricingSection.getBoundingClientRect().top + window.scrollY - STICKY_HEADER_OFFSET;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: "smooth",
  });
}
