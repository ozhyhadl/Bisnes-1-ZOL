import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import SkillsListSection from "@/components/SkillsListSection";
import { skillsCategoryCount, skillsCount } from "@/data/skillsDirectory";

vi.mock("@/components/ScrollReveal", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

describe("skills directory modal", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders real counts and opens the full directory dialog", async () => {
    render(<SkillsListSection />);

    expect(screen.getByText(`20 categories. ${skillsCount} skills. Pick a folder, run a skill, get a deliverable. Browse the full directory below.`)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Browse All 501 Skills" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Claude Skills Directory")).toBeInTheDocument();
    expect(screen.getByText(`${skillsCategoryCount} categories · ${skillsCount} skills`)).toBeInTheDocument();
  });

  it("filters categories and skills by search query and closes cleanly", async () => {
    render(<SkillsListSection />);

    fireEvent.click(screen.getByRole("button", { name: "Browse All 501 Skills" }));

    const search = await screen.findByLabelText("Search categories or skill slugs");
    fireEvent.change(search, { target: { value: "nda-template" } });

    await waitFor(() => {
      expect(screen.getByText("Legal & Compliance")).toBeInTheDocument();
      expect(screen.getByText("nda-template")).toBeInTheDocument();
    });

    expect(screen.queryByText("instagram-carousel")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});