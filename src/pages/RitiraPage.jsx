import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../services/api";
import { useTranslation } from "react-i18next";

export default function RitiraPage() {
  const [codice, setCodice] = useState("");
  const [prefisso, setPrefisso] = useState(""); // ← prefisso
  const [telefono, setTelefono] = useState(""); // ← telefono
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRitiro = async () => {
    const trimmedCodice = codice.trim();
    const trimmedPrefisso = prefisso.trim().replace(/^00/, "+"); // supporta anche "0039"
    const trimmedTelefono = telefono.trim();

    if (!/^\d{6}$/.test(trimmedCodice)) {
      setError(
        t("ritira.error_code") || "Inserisci un codice valido di 6 cifre."
      );
      setMessage("");
      return;
    }

    if (!/^\+?\d{1,4}$/.test(trimmedPrefisso)) {
      setError("Prefisso non valido. Usa formati come +39 o 0039.");
      setMessage("");
      return;
    }

    if (!/^\d{10}$/.test(trimmedTelefono)) {
      setError(
        t("ritira.error_phone") ||
          "Inserisci un numero di telefono valido di 10 cifre."
      );
      setMessage("");
      return;
    }

    try {
      const fullTelefono = trimmedPrefisso + trimmedTelefono;
      const resultMessage = await ritira(trimmedCodice, fullTelefono);
      setMessage(resultMessage);
      setError("");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(
        (t("ritira.error_generic") || "Errore durante il ritiro:") +
          " " +
          err.message
      );
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

      <h2>{t("ritira.phone_title") || "Inserisci numero di telefono"}</h2>

      <div>
        <input
          type="text"
          value={prefisso}
          onChange={(e) => setPrefisso(e.target.value)}
          placeholder="+39"
          maxLength={4}
          className="w-20 p-1 border rounded"
        />

        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder={
            t("ritira.placeholder_phone") || "Numero (es: 3471234567)"
          }
          maxLength={10}
          className="input-phone"
        />
      </div>

      <button onClick={handleRitiro}>{t("ritira.submit") || "Conferma"}</button>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
}
