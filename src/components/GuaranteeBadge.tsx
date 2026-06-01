import { ShieldCheck } from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import { salesCopy } from "@/i18n/salesCopy";

const GuaranteeBadge = () => {
  const { t } = useLanguage();

  return (
    <div className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-[11px] font-medium text-emerald-100 sm:text-xs">
      <ShieldCheck className="h-4 w-4 text-emerald-300" />
      <span>{t(salesCopy.common.guarantee)}</span>
    </div>
  );
};

export default GuaranteeBadge;
