"use client";

import { getDictionary } from "@/i18n";
import { createContext, useState, useContext, useEffect } from "react";

interface I18nContextType {
  lang: string;
  setLang: (lang: string) => void;
  dict: Record<string, unknown>;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState("es");
  const [dict, setDict] = useState<Record<string, unknown>>({});

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