import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import SkillsListSection from "@/components/SkillsListSection";
import { skillsCategoryCount, skillsCount } from "@/data/skillsDirectory";
import { skillsMetadata } from "@/data/skillsMetadata";

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

  it("opens a second detail popup for a skill and returns to the directory state on close", async () => {
    render(<SkillsListSection />);

    fireEvent.click(screen.getByRole("button", { name: "Browse All 501 Skills" }));

    const search = await screen.findByLabelText("Search categories or skill slugs");
    fireEvent.change(search, { target: { value: "nda-template" } });

    const skillTrigger = await screen.findByRole("button", { name: "Open details for NDA Template" });
    fireEvent.click(skillTrigger);

    await waitFor(() => {
      expect(screen.getByText("NDA Template")).toBeInTheDocument();
      expect(screen.getByText(skillsMetadata["nda-template"].shortDescription)).toBeInTheDocument();
    });

    expect(screen.getAllByText("Legal & Compliance").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Back to directory" }));

    await waitFor(() => {
      expect(screen.queryByText(skillsMetadata["nda-template"].shortDescription)).not.toBeInTheDocument();
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Search categories or skill slugs")).toHaveValue("nda-template");
    expect(screen.getAllByText("Legal & Compliance").length).toBeGreaterThan(0);
    expect(screen.getByText("nda-template")).toBeInTheDocument();
  });
});