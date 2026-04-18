import { describe, expect, it, beforeEach, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import PricingSection from "@/components/PricingSection";
import UpsellOfferSection from "@/components/UpsellOfferSection";
import { CheckoutProvider } from "@/contexts/CheckoutContext";

const mockGetPaddle = vi.fn();
const mockOpenPaddleCheckout = vi.fn();
const mockTrackInitiateCheckout = vi.fn();

vi.mock("@/components/ScrollReveal", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/components/TerminalWindow", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/lib/paddle", () => ({
  getPaddle: () => mockGetPaddle(),
  openPaddleCheckout: (...args: unknown[]) => mockOpenPaddleCheckout(...args),
}));

vi.mock("@/lib/meta-events", () => ({
  trackInitiateCheckout: () => mockTrackInitiateCheckout(),
}));

function renderCheckoutFlow() {
  return render(
    <CheckoutProvider>
      <PricingSection />
      <UpsellOfferSection />
    </CheckoutProvider>,
  );
}

describe("checkout upsell flow", () => {
  beforeEach(() => {
    mockGetPaddle.mockReset();
    mockOpenPaddleCheckout.mockReset();
    mockTrackInitiateCheckout.mockReset();
    mockGetPaddle.mockResolvedValue({ Checkout: { open: vi.fn() } });
  });

  it("opens checkout immediately with the main product only when no add-on was selected", async () => {
    renderCheckoutFlow();

    fireEvent.click(screen.getByRole("button", { name: "Get Instant Access — $15" }));

    await waitFor(() => {
      expect(mockOpenPaddleCheckout).toHaveBeenCalledTimes(1);
    });

    const [, items] = mockOpenPaddleCheckout.mock.calls[0] as [unknown, Array<{ priceId: string }>];
    expect(items).toHaveLength(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("includes the add-on in checkout when it was preselected and still never reopens a modal", async () => {
    renderCheckoutFlow();

    fireEvent.click(screen.getByRole("button", { name: "Add to Order" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Remove Add-On" })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Get Instant Access — $15" }));

    await waitFor(() => {
      expect(mockOpenPaddleCheckout).toHaveBeenCalledTimes(1);
    });

    let [, items] = mockOpenPaddleCheckout.mock.calls[0] as [unknown, Array<{ priceId: string }>];
    expect(items).toHaveLength(2);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Remove Add-On" }));
    expect(screen.getByRole("button", { name: "Add to Order" })).toBeInTheDocument();

    mockOpenPaddleCheckout.mockClear();

    fireEvent.click(screen.getByRole("button", { name: "Get Instant Access — $15" }));

    await waitFor(() => {
      expect(mockOpenPaddleCheckout).toHaveBeenCalledTimes(1);
    });

    ;[, items] = mockOpenPaddleCheckout.mock.calls[0] as [unknown, Array<{ priceId: string }>];
    expect(items).toHaveLength(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
