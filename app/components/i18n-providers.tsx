"use client";

import { getDictionary, Lang } from "@/i18n";
import { createContext, useState, useContext, useEffect } from "react";
import { Dictionary } from "@/libs/types";

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  dict: Dictionary;
}

const I18nContext = createContext<I18nContextType>({
  lang: "es",
  setLang: () => {},
  dict: {} as Dictionary,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");
  const [dict, setDict] = useState<Dictionary>({} as Dictionary);

  useEffect(() => {
    getDictionary(lang).then(setDict);
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, dict }}>
      {children}
    </I18nContext.Provider>
  );
}


export const useI18n = () => useContext(I18nContext);