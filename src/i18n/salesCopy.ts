import type { LocalizedText } from "@/i18n/translations";

const englishEverywhere = (en: string): LocalizedText => ({
  en,
  es: en,
  fr: en,
  de: en,
  it: en,
  pt: en,
  pl: en,
  hi: en,
  uk: en,
  ru: en,
});

export const salesCopy = {
  hero: {
    outcomeChips: [
      englishEverywhere("Blog posts"),
      englishEverywhere("Contracts"),
      englishEverywhere("Sales emails"),
    ],
    platformsLabel: englishEverywhere("Works with"),
    stickyCta: englishEverywhere("Get the Bundle — $15"),
  },
  pricing: {
    anchor: englishEverywhere("Regular price: $155. Today only: $15 for the full bundle."),
    includedLabel: englishEverywhere("What you get"),
    highlights: [
      englishEverywhere("500+ ready-to-run Claude Skills"),
      englishEverywhere("Content, sales, legal, finance, and ops workflows"),
      englishEverywhere("Instant download with lifetime access"),
    ],
    totalLabel: englishEverywhere("Order total"),
    upsellLabel: englishEverywhere("+ Add 1,800 N8N Workflows for $10 (save $5)"),
    upsellHelper: englishEverywhere("N8N add-on at $10 only with the bundle today. Not sold separately."),
  },
  common: {
    guarantee: englishEverywhere("7-day money-back guarantee · No questions asked"),
  },
  countdown: {
    label: englishEverywhere("Offer ends in"),
  },
  popup: {
    title: englishEverywhere("Last chance — offer expires now."),
    body: englishEverywhere("The discounted $15 price is closing. After this session it returns to the regular $155 price."),
    cta: englishEverywhere("Buy Now — $15"),
    close: englishEverywhere("Close"),
  },
  exitIntent: {
    title: englishEverywhere("Wait — before you go."),
    body: englishEverywhere("Take the bundle for $15 before it returns to the regular $155 price. 7-day money-back guarantee."),
    cta: englishEverywhere("Buy Now — $15"),
    close: englishEverywhere("Close"),
  },
  finalCta: {
    priceReason: englishEverywhere("$15 is the current discounted price. Regular price: $155."),
  },
  testimonials: {
    title: englishEverywhere("Used by operators who need finished work, not drafts."),
    subtitle: englishEverywhere("Proof section is wired and waiting for verified customer quotes."),
    emptyState: englishEverywhere("Add 3-5 verified testimonials to unlock this section in production."),
  },
  sampleOutputs: {
    title: englishEverywhere("See the kind of output the bundle is built to produce."),
    subtitle: englishEverywhere("Representative deliverables, shown in the same terminal style as the rest of the page."),
    contractTitle: englishEverywhere("Sample: SaaS contract output"),
    contractBody: englishEverywhere("Master Services Agreement\n- Term: 12 months\n- Billing: Net 14\n- Liability cap: fees paid in previous 3 months\n- Data processing addendum required\n- Signature block included for both parties"),
    postTitle: englishEverywhere("Sample: launch post output"),
    postBody: englishEverywhere("Launch angle: turn Claude into a working department, not a chat box.\nHook: Stop starting from blank pages.\nCTA: Get the bundle, drop the skills into Claude, and ship deliverables today."),
  },
  demo: {
    title: englishEverywhere("60-second walkthrough"),
    body: englishEverywhere("This slot is ready for a short screen recording: drop a skill into Claude, answer a few prompts, get a finished deliverable."),
    placeholder: englishEverywhere("Demo asset placeholder — add public/demo.mp4 to activate the video block."),
  },
} as const;
