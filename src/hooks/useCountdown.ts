import { useEffect, useMemo, useState } from "react";

import { SALES_CONFIG } from "@/lib/sales";

function ensureDeadline(): number | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storageKey = SALES_CONFIG.storageKeys.offerDeadline;
  const existingValue = window.localStorage.getItem(storageKey);
  const existingTimestamp = existingValue ? Number(existingValue) : NaN;

  if (Number.isFinite(existingTimestamp)) {
    return existingTimestamp;
  }

  const nextTimestamp = Date.now() + SALES_CONFIG.countdownMinutes * 60 * 1000;
  window.localStorage.setItem(storageKey, String(nextTimestamp));
  return nextTimestamp;
}

export function useCountdown() {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setDeadline(ensureDeadline());
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const remainingMs = useMemo(() => {
    if (!deadline) {
      return SALES_CONFIG.countdownMinutes * 60 * 1000;
    }

    return Math.max(deadline - now, 0);
  }, [deadline, now]);

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.max(totalSeconds % 60, 0)
    .toString()
    .padStart(2, "0");

  return {
    deadline,
    minutes,
    seconds,
    isExpired: remainingMs <= 0,
  };
}
