export const languages = {
  es: () => import("@/locales/es.json").then(m => m.default),
  en: () => import("@/locales/en.json").then(m => m.default),
};

export type Lang = keyof typeof languages;

export async function getDictionary(lang: Lang) {
  return languages[lang]();
}