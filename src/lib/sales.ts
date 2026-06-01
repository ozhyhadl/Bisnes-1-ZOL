export const SALES_CONFIG = {
  bundlePrice: 15,
  bundleAnchorMin: 155,
  bundleAnchorMax: 155,
  n8nPrice: 10,
  n8nOriginalPrice: 15,
  countdownMinutes: 10,
  checkoutSectionId: "pricing",
  stickyHeaderOffset: 88,
  storageKeys: {
    offerDeadline: "aicldbase_offer_deadline",
    popupDismissed: "aicldbase_popup_dismissed",
    exitIntentShown: "aicldbase_exit_intent_shown",
  },
} as const;

export const SALES_COPY = {
  anchorRange: SALES_CONFIG.bundleAnchorMin === SALES_CONFIG.bundleAnchorMax
    ? `$${SALES_CONFIG.bundleAnchorMin}`
    : `$${SALES_CONFIG.bundleAnchorMin}-$${SALES_CONFIG.bundleAnchorMax}`,
  bundlePriceLabel: `$${SALES_CONFIG.bundlePrice}`,
  n8nPriceLabel: `$${SALES_CONFIG.n8nPrice}`,
  n8nOriginalPriceLabel: `$${SALES_CONFIG.n8nOriginalPrice}`,
} as const;

export function formatUsd(value: number): string {
  return `$${value}`;
}

export function getBundlePlusUpsellTotal(includeN8n: boolean): number {
  return SALES_CONFIG.bundlePrice + (includeN8n ? SALES_CONFIG.n8nPrice : 0);
}
