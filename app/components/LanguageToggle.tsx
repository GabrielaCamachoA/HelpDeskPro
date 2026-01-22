"use client";

import { useI18n } from "./i18n-providers";
import { Lang } from "@/i18n";



export default function LangSelector() {
  const { lang, setLang } = useI18n();

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as Lang)}
      className="border px-2 py-1 rounded"
    >
      <option value="es" className="text-black">Español</option>
      <option value="en " className="text-black">English</option>
    </select>
  );
}
