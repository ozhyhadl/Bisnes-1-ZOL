import { Clock3 } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { salesCopy } from "@/i18n/salesCopy";
import { useCountdown } from "@/hooks/useCountdown";
import { cn } from "@/lib/utils";

type OfferCountdownProps = {
  className?: string;
  variant?: "hero" | "pricing";
};

const formatTimerValue = (value: number | string) => String(value).padStart(2, "0");

const OfferCountdown = ({ className, variant = "hero" }: OfferCountdownProps) => {
  const { t, currentLanguage } = useLanguage();
  const { deadline, days, hours, minutes, seconds, isExpired } = useCountdown();
  const numericDays = Number(days);
  const numericHours = Number(hours);
  const numericMinutes = Number(minutes);
  const numericSeconds = Number(seconds);
  const totalRemainingSeconds = (numericDays * 86400) + (numericHours * 3600) + (numericMinutes * 60) + numericSeconds;
  const isLastMinute = totalRemainingSeconds > 0 && totalRemainingSeconds < 60;
  const isUnderTenMinutes = totalRemainingSeconds > 0 && totalRemainingSeconds < 600;

  const deadlineLabel = deadline
    ? new Intl.DateTimeFormat(currentLanguage, {
      weekday: "short",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(deadline))
    : "--";

  const timerUnits = [
    { id: "days", value: days, label: t(salesCopy.countdown.days), accent: false },
    { id: "hours", value: hours, label: t(salesCopy.countdown.hours), accent: false },
    { id: "minutes", value: minutes, label: t(salesCopy.countdown.minutes), accent: true },
    { id: "seconds", value: seconds, label: t(salesCopy.countdown.seconds), accent: true },
  ];

  return (
    <div
      className={cn(
        "offer-countdown rounded-[18px] border text-center",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_18px_44px_rgba(239,68,43,0.14)]",
        isExpired
          ? "border-destructive/45 bg-[linear-gradient(180deg,rgba(166,44,38,0.18),rgba(103,31,29,0.14))] text-destructive"
          : "border-[rgba(219,92,65,0.34)] bg-[linear-gradient(180deg,rgba(177,53,40,0.18),rgba(104,32,28,0.12))] text-terminal-foreground",
        variant === "pricing" ? "px-3 py-3 sm:px-4" : "px-5 py-5 sm:px-6 sm:py-6",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em]",
          variant === "pricing" ? "text-[rgba(229,225,216,0.82)]" : "text-[rgb(139,43,34)] sm:text-[11px]",
        )}
      >
        <Clock3 className={cn("h-4 w-4", variant === "hero" && "text-[rgb(166,49,39)]")} />
        <span>{t(salesCopy.countdown.label)}</span>
      </div>
      <div
        className={cn(
          "mt-3 grid grid-cols-4",
          variant === "pricing" ? "mx-auto max-w-[23rem] gap-1.5 sm:gap-2" : "mx-auto max-w-[29rem] gap-2 sm:gap-3",
        )}
        aria-live="polite"
      >
        {timerUnits.map((unit) => (
          <div
            key={unit.id}
            className={cn(
              "min-w-0 rounded-xl border px-1.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_16px_rgba(61,34,29,0.18)] sm:px-2.5",
              variant === "hero"
                ? "min-h-[4.9rem] border-[rgba(30,22,19,0.1)] bg-[linear-gradient(180deg,rgb(54,48,43),rgb(37,33,30))] sm:min-h-[5.35rem] sm:py-3"
                : isLastMinute
                  ? "border-[rgba(255,128,104,0.44)] bg-[rgba(101,24,22,0.54)]"
                  : isUnderTenMinutes
                    ? "border-[rgba(239,112,82,0.34)] bg-[rgba(75,25,21,0.48)]"
                    : "border-[rgba(255,219,198,0.14)] bg-[rgba(44,22,18,0.3)]",
            )}
          >
            <span
              key={`${unit.id}-${unit.value}`}
              className={cn(
                "offer-countdown-value block font-mono font-black leading-none tracking-normal",
                variant === "hero"
                  ? unit.accent ? "text-[2rem] text-[rgb(255,74,43)] sm:text-[2.45rem]" : "text-[2rem] text-[rgb(255,252,248)] sm:text-[2.45rem]"
                  : isLastMinute
                    ? "text-lg text-[rgb(255,151,126)] sm:text-2xl"
                    : isUnderTenMinutes
                      ? "text-lg text-[rgb(255,184,164)] sm:text-2xl"
                      : "text-lg text-[rgb(255,238,225)] sm:text-2xl",
              )}
            >
              {formatTimerValue(unit.value)}
            </span>
            <span
              className={cn(
                "mt-1 block font-semibold uppercase leading-tight tracking-[0.04em] text-[rgba(255,250,246,0.9)]",
                variant === "hero" ? "text-[10px] sm:text-xs sm:tracking-[0.08em]" : "text-[8px] sm:text-[10px] sm:tracking-[0.12em]",
              )}
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>
      <p
        className={cn(
          "mx-auto mt-3 font-medium leading-relaxed",
          variant === "pricing" ? "max-w-[25rem] text-[11px] text-[rgba(229,225,216,0.76)]" : "max-w-none text-[10px] text-[rgba(72,32,27,0.78)] sm:text-[11px]",
        )}
      >
        {t(salesCopy.countdown.validUntil)} {deadlineLabel}
      </p>
    </div>
  );
};

export default OfferCountdown;
