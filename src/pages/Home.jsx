import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../i18n"; // Assicurati di avere questa importazione corretta
import "../styles/App.css";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const languages = [
    { code: "it", label: "🇮🇹 Italiano" },
    { code: "en", label: "🇬🇧 English" },
    { code: "es", label: "🇪🇸 Español" },
    { code: "de", label: "🇩🇪 Deutsch" },
    { code: "ru", label: "🇷🇺 Русский" },
    { code: "zh", label: "🇨🇳 中文" },
    { code: "ja", label: "🇯🇵 日本語" },
    { code: "fa", label: "🇮🇷 فارسی" },
    { code: "ar", label: "🇸🇦 العربية" },
    { code: "fr", label: "🇫🇷 Français" }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  return (
    <div className="home-container">
      {/* Selettore lingua */}
      <div className="lang-selector" style={{ marginBottom: 16 }}>
        <select
          onChange={(e) => changeLanguage(e.target.value)}
          defaultValue={i18n.language || "it"}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Pulsanti principali */}
      <button className="home-button" onClick={() => navigate("/deposita")}>
        {t("home.deposit")}
      </button>
      <button className="home-button" onClick={() => navigate("/ritira")}>
        {t("home.withdraw")}
      </button>
      <button className="home-button-admin" onClick={() => navigate("/admin")}>
        {t("home.administration")}
      </button>
    </div>
  );
}
