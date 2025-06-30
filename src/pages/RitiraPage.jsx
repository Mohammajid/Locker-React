import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ritira } from "../services/api";
import "../App.css";

export default function RitiraPage() {
  const [codice, setCodice] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [telefono, setTelefono] = useState("");

  const handleRitiro = async () => {
    const trimmedCodice = codice.trim();
    const trimmedTelefono = telefono.trim();

    if (!/^\d{6}$/.test(trimmedCodice)) {
      setError("Inserisci un codice valido di 6 cifre.");
      setMessage("");
      return;
    }

    if (!/^\d{10}$/.test(trimmedTelefono)) {
      setError("Inserisci un numero di telefono valido di 10 cifre.");
      setMessage("");
      return;
    }

    try {
      const resultMessage = await ritira(trimmedCodice, telefono);
      setMessage(resultMessage);
      setError("");
      setTimeout(() => navigate("/"), 3000); // Torna alla pagina principale dopo 3 secondi
    } catch (err) {
      setError("Errore durante il ritiro: " + err.message);
      setMessage("");
    }
  };

  return (
    <div className="ritira-container">
      <h1>Inserisci il Codice per il Ritiro</h1>
      <input
        type="text"
        value={codice}
        onChange={(e) => setCodice(e.target.value)}
        placeholder="Codice di 6 cifre"
        maxLength={6}
        className="input-code"
      />

      <h1>inserisci anche il numero di telefono</h1>
      <input
        type="text"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        maxLength={10}
      />

      <button onClick={handleRitiro}>Conferma</button>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
}
