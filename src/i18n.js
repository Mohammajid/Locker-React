import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationIT from "./locales/it/translation.json";
import translationRU from "./locales/ru/translation.json";
import translationZH from "./locales/zh/translation.json";
import translationJA from "./locales/ja/translation.json";
import translationFA from "./locales/fa/translation.json";
import translationAR from "./locales/ar/translation.json";
import translationDE from "./locales/de/translation.json";
import translationES from "./locales/es/translation.json";
import translationFr from "./locales/fr/translation.json";

const resources = {
  en: { translation: translationEN },
  it: { translation: translationIT },
  ru: { translation: translationRU },
  zh: { translation: translationZH },
  ja: { translation: translationJA },
  fa: { translation: translationFA },
  ar: { translation: translationAR },
  de: { translation: translationDE },
  es: { translation: translationES },
  fr: { translation: translationFr },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "it", // Lingua predefinita
  fallbackLng: "en", // Se la traduzione manca

  interpolation: {
    escapeValue: false, // React già protegge da XSS
  },
});

export default i18n;
