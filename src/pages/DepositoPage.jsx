import React, { useEffect, useState } from "react";
import { getAllBoxes, depositaInBox } from "../services/api";
import "../App.css";
import "../styles/Style-deposito.css";

export default function LockerGrid() {
  const [boxes, setBoxes] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [codice, setCodice] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    loadBoxes();
  }, []);

  const loadBoxes = async () => {
    try {
      const allBoxes = await getAllBoxes();
      setBoxes(allBoxes);
      setError("");
    } catch (err) {
      setError("Errore nel recupero dei box: " + err.message);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////

  const handleDepositaInBox = async () => {
    if (!selectedBox) {
      setError("Seleziona un box!");
      return;
    }

    if (!codice || codice.length !== 6) {
      setError("Inserisci un codice di 6 cifre");
      return;
    }

    if (!telefono || telefono.length !== 10) {
      setError("il numero di telefono deve essere valido a 10 cifre");
      return;
    }

    try {
      const { numeroBox } = await depositaInBox(selectedBox, codice, telefono); // ✅
      setMessage(`Deposito completato nel box ${numeroBox}. PIN: ${codice}`);

      setError("");
      loadBoxes();
    } catch (err) {
      setError("Errore durante il deposito: " + err.message);
      setMessage("");
    }
  };

  return (
    <div className="locker-container">
      <h1>Gestione Box</h1>

      <div className="controls">
        <label htmlFor="box-select">Seleziona un box libero:</label>
        <select
          id="box-select"
          value={selectedBox || ""}
          onChange={(e) => setSelectedBox(parseInt(e.target.value))}
        >
          <option value="">-- Scegli un box --</option>
          {boxes
            .filter((b) => !b.used)
            .map((box) => (
              <option key={box.numeroBox} value={box.numeroBox}>
                Box {box.numeroBox}
              </option>
            ))}
        </select>

        <label htmlFor="codice-input"> Inserisci codice zzzaaaa</label>
        <input
          id="codice-input"
          type="text"
          maxLength={6}
          value={codice}
          onChange={(e) => setCodice(e.target.value)}
        />

        <label htmlFor="numero-telefono">Inserisci un numero di telefono</label>
        <input
          id="telefono-input"
          type="text"
          maxLength={10}
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <button onClick={handleDepositaInBox}>
          Deposita nel box selezionato
        </button>
      </div>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <div className="locker-grid">
        {boxes.map((box) => (
          <div
            key={box.id}
            className={`locker-box ${
              box.disable ? "disable" : box.used ? "occupied" : "free"
            }`}
          >
            <div className="locker-number">Box {box.numeroBox}</div>
            <div className="locker-status">
              {box.disable ? "Disattivato" : box.used ? "Occupato" : "Libero"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
