import { describe, expect, it } from "vitest";

import { formatTwoDigits, getNextFullHourDeadline, getRemainingTime } from "@/hooks/useCountdown";

describe("useCountdown helpers", () => {
  it("calculates the next full hour deadline from arbitrary local times", () => {
    const firstDeadline = new Date(getNextFullHourDeadline(new Date(2026, 5, 1, 19, 20, 0)));
    expect(firstDeadline.getHours()).toBe(20);
    expect(firstDeadline.getMinutes()).toBe(0);

    const secondDeadline = new Date(getNextFullHourDeadline(new Date(2026, 5, 1, 19, 59, 0)));
    expect(secondDeadline.getHours()).toBe(20);
    expect(secondDeadline.getMinutes()).toBe(0);

    const thirdDeadline = new Date(getNextFullHourDeadline(new Date(2026, 5, 1, 23, 20, 0)));
    expect(thirdDeadline.getDate()).toBe(2);
    expect(thirdDeadline.getHours()).toBe(0);
    expect(thirdDeadline.getMinutes()).toBe(0);

    const exactHourDeadline = new Date(getNextFullHourDeadline(new Date(2026, 5, 1, 19, 0, 0)));
    expect(exactHourDeadline.getHours()).toBe(20);
    expect(exactHourDeadline.getMinutes()).toBe(0);
  });

  it("returns zero-padded time segments", () => {
    expect(formatTwoDigits(0)).toBe("00");
    expect(formatTwoDigits(1)).toBe("01");
    expect(formatTwoDigits(9)).toBe("09");
    expect(formatTwoDigits(12)).toBe("12");
  });

  it("breaks remaining time into days, hours, minutes, and seconds", () => {
    const deadline = Date.UTC(2026, 5, 1, 20, 0, 0);
    const now = Date.UTC(2026, 5, 1, 19, 20, 18);

    expect(getRemainingTime(deadline, now)).toEqual({
      remainingMs: 2382000,
      days: 0,
      hours: 0,
      minutes: 39,
      seconds: 42,
    });
  });
});