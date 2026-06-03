import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";

import StepsSection from "@/components/StepsSection";

vi.mock("@/components/ScrollReveal", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

describe("steps section layout", () => {
  it("keeps the setup CTA inside the terminal block as the final action", () => {
    const { container } = render(<StepsSection />);

    const terminalWindow = container.querySelector(".terminal-window");
    expect(terminalWindow).not.toBeNull();

    const setupButton = screen.getByRole("button", { name: "Get the Bundle — $15" });
    expect(terminalWindow).toContainElement(setupButton);

    const divider = screen.getByText("or");
    expect(terminalWindow).not.toContainElement(divider);

    const terminalScope = within(terminalWindow as HTMLElement);
    const buttonsInsideTerminal = terminalScope.getAllByRole("button");
    expect(buttonsInsideTerminal.at(-1)).toBe(setupButton);
  });
});