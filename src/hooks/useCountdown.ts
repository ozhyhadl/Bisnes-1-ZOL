import { useEffect, useMemo, useState } from "react";

import { SALES_CONFIG } from "@/lib/sales";

const offerDeadlineStorageKey = SALES_CONFIG.storageKeys.offerDeadline;

function isFullHourDeadline(timestamp: number): boolean {
  const deadline = new Date(timestamp);
  return deadline.getMinutes() === 0 && deadline.getSeconds() === 0 && deadline.getMilliseconds() === 0;
}

export function getNextFullHourDeadline(baseTime = new Date()): number {
  const deadline = new Date(baseTime);
  deadline.setHours(deadline.getHours() + 1, 0, 0, 0);
  return deadline.getTime();
}

export function formatTwoDigits(value: number): string {
  return value.toString().padStart(2, "0");
}

export function getRemainingTime(deadline: number, now = Date.now()) {
  const remainingMs = Math.max(deadline - now, 0);
  const totalSeconds = Math.floor(remainingMs / 1000);

  return {
    remainingMs,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function readStoredDeadline(): number | null {
  if (typeof window === "undefined") {
    return null;
  }

  const existingValue = window.localStorage.getItem(offerDeadlineStorageKey);
  const existingTimestamp = existingValue ? Number(existingValue) : NaN;

  return Number.isFinite(existingTimestamp) ? existingTimestamp : null;
}

function persistDeadline(timestamp: number): number {
  window.localStorage.setItem(offerDeadlineStorageKey, String(timestamp));
  return timestamp;
}

function resolveActiveDeadline(now = Date.now(), currentDeadline?: number | null): number | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedDeadline = readStoredDeadline();
  const candidates = [currentDeadline, storedDeadline];

  for (const candidate of candidates) {
    if (candidate && candidate > now && isFullHourDeadline(candidate)) {
      return candidate;
    }
  }

  return persistDeadline(getNextFullHourDeadline(new Date(now)));
}

export function useCountdown() {
  const [deadline, setDeadline] = useState<number | null>(() => resolveActiveDeadline(Date.now()));
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const currentNow = Date.now();
      setNow(currentNow);
      setDeadline((currentDeadline) => resolveActiveDeadline(currentNow, currentDeadline));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const remaining = useMemo(() => {
    return getRemainingTime(deadline ?? getNextFullHourDeadline(new Date(now)), now);
  }, [deadline, now]);

  return {
    deadline,
    days: formatTwoDigits(remaining.days),
    hours: formatTwoDigits(remaining.hours),
    minutes: formatTwoDigits(remaining.minutes),
    seconds: formatTwoDigits(remaining.seconds),
    isExpired: remaining.remainingMs <= 0,
  };
}
