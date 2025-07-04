import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ritira } from "../services/api";
import { useTranslation } from "react-i18next";

export default function RitiraPage() {
  const [codice, setCodice] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [telefono, setTelefono] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();  // ← qui

  const handleRitiro = async () => {
    const trimmedCodice = codice.trim();
    const trimmedTelefono = telefono.trim();

    if (!/^\d{6}$/.test(trimmedCodice)) {
      setError(t("ritira.error_code") || "Inserisci un codice valido di 6 cifre.");
      setMessage("");
      return;
    }

    if (!/^\d{10}$/.test(trimmedTelefono)) {
      setError(t("ritira.error_phone") || "Inserisci un numero di telefono valido di 10 cifre.");
      setMessage("");
      return;
    }

    try {
      const resultMessage = await ritira(trimmedCodice, trimmedTelefono);
      setMessage(resultMessage);
      setError("");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError((t("ritira.error_generic") || "Errore durante il ritiro:") + " " + err.message);
      setMessage("");
    }
  };

  return (
    <div className="ritira-container">
      <h1>{t("ritira.title")}</h1>
      <input
        type="text"
        value={codice}
        onChange={(e) => setCodice(e.target.value)}
        placeholder={t("ritira.placeholder_code") || "Codice di 6 cifre"}
        maxLength={6}
        className="input-code"
      />

      <h2>{t("ritira.phone_title") || "Inserisci anche il numero di telefono"}</h2>
      <input
        type="text"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder={t("ritira.placeholder_phone") || "Numero di telefono"}
        maxLength={10}
        className="input-phone"
      />

      <button onClick={handleRitiro}>{t("ritira.submit") || "Conferma"}</button>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
}
