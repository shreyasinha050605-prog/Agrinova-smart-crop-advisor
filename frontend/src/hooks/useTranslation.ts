import { useLanguage } from "@/context/LanguageContext";
import { tr } from "@/i18n/translations";
import { useCallback } from "react";

export const useTranslation = () => {
  const { lang } = useLanguage();
  const t = useCallback((key: Parameters<typeof tr>[0]) => tr(key, lang), [lang]);
  return {
    lang,
    t,
  };
};
