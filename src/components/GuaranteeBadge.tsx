import { ShieldCheck } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { salesCopy } from "@/i18n/salesCopy";

const GuaranteeBadge = () => {
  const { t } = useLanguage();

  return (
    <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(56,92,74,0.26)] bg-[linear-gradient(180deg,rgba(246,249,246,0.96),rgba(236,243,238,0.94))] px-4 py-2 text-[11px] font-semibold text-[rgb(44,72,59)] shadow-[0_10px_24px_rgba(28,44,35,0.08)] sm:text-xs">
      <ShieldCheck className="h-4 w-4 text-[rgb(58,100,79)]" />
      <span>{t(salesCopy.common.guarantee)}</span>
    </div>
  );
};

export default GuaranteeBadge;
