import { Clock3 } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { salesCopy } from "@/i18n/salesCopy";
import { useCountdown } from "@/hooks/useCountdown";

const OfferCountdown = ({ className = "" }: { className?: string }) => {
  const { t } = useLanguage();
  const { minutes, seconds, isExpired } = useCountdown();

  return (
    <div className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-xs ${isExpired ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-primary/20 bg-primary/10 text-foreground"} ${className}`.trim()}>
      <Clock3 className="h-4 w-4" />
      <span className="font-medium">{t(salesCopy.countdown.label)}</span>
      <span className="font-mono text-sm font-semibold tracking-[0.18em]">{minutes}:{seconds}</span>
    </div>
  );
};

export default OfferCountdown;
