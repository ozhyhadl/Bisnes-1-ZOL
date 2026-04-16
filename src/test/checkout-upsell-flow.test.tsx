import { describe, expect, it, beforeEach, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

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

  it("shows the modal only before selection and keeps checkout as main product only when user continues without add-on", async () => {
    renderCheckoutFlow();

    fireEvent.click(screen.getByRole("button", { name: "Get Instant Access — $15" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "Continue Without Add-On" })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: "Continue Without Add-On" }));

    await waitFor(() => {
      expect(mockOpenPaddleCheckout).toHaveBeenCalledTimes(1);
    });

    const [, items] = mockOpenPaddleCheckout.mock.calls[0] as [unknown, Array<{ priceId: string }>];
    expect(items).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Get Instant Access — $15" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("persists the selected add-on, skips the modal on repeat checkout, and allows removing the add-on again", async () => {
    renderCheckoutFlow();

    fireEvent.click(screen.getByRole("button", { name: "Get Instant Access — $15" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Add to Order" }));

    await waitFor(() => {
      expect(mockOpenPaddleCheckout).toHaveBeenCalledTimes(1);
    });

    let [, items] = mockOpenPaddleCheckout.mock.calls[0] as [unknown, Array<{ priceId: string }>];
    expect(items).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Remove Add-On" })).toBeInTheDocument();

    mockOpenPaddleCheckout.mockClear();

    fireEvent.click(screen.getByRole("button", { name: "Get Instant Access — $15" }));

    await waitFor(() => {
      expect(mockOpenPaddleCheckout).toHaveBeenCalledTimes(1);
    });

    ;[, items] = mockOpenPaddleCheckout.mock.calls[0] as [unknown, Array<{ priceId: string }>];
    expect(items).toHaveLength(2);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Remove Add-On" }));
    expect(screen.getByRole("button", { name: "Add to Order" })).toBeInTheDocument();

    mockOpenPaddleCheckout.mockClear();

    fireEvent.click(screen.getByRole("button", { name: "Get Instant Access — $15" }));
    const reopenedDialog = await screen.findByRole("dialog");
    fireEvent.click(within(reopenedDialog).getByRole("button", { name: "Continue Without Add-On" }));

    await waitFor(() => {
      expect(mockOpenPaddleCheckout).toHaveBeenCalledTimes(1);
    });

    ;[, items] = mockOpenPaddleCheckout.mock.calls[0] as [unknown, Array<{ priceId: string }>];
    expect(items).toHaveLength(1);
  });
});
