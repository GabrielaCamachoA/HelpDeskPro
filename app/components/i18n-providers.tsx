"use client";

import { getDictionary } from "@/i18n";
import { createContext, useState, useContext, useEffect } from "react";


const I18nContext = createContext<any>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState("es");
  const [dict, setDict] = useState<any>({});

  useEffect(() => {
    getDictionary(lang as any).then(setDict);
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, dict }}>
      {children}
    </I18nContext.Provider>
  );
}


export const useI18n = () => useContext(I18nContext);