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
  const [prefisso, setPrefisso] = useState("");
  const [telefono, setTelefono] = useState("");
  const [confermaTel, setConfermaTel] = useState("");

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

    if (!prefisso || prefisso.length !== 4) {
      setError("Scegliere un prefisso valido");
      return;
    }

    if (!telefono || telefono.length !== 10) {
      setError("il numero di telefono deve essere valido a 10 cifre");
      return;
    }

    if (!confermaTel ||confermaTel !== telefono) {
      setError("il campo non puo essere vuoto e i due numeri devono essere uguali");
      return;
    }

    try {
      const { numeroBox } = await depositaInBox(selectedBox, codice, telefono); // ✅
      setMessage(`Deposito completato nel box ${numeroBox}`);

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
        <div className="locker-grid">
          {boxes.map((box) => {
            const isSelected = selectedBox === box.numeroBox;
            return (
              <button
                key={box.id}
                className={`locker-box ${
                  box.disable ? "disable" : box.used ? "occupied" : "free"
                } ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  if (!box.used && !box.disable) setSelectedBox(box.numeroBox);
                }}
                disabled={box.used || box.disable}
              >
                <div className="locker-number">Box {box.numeroBox}</div>
                <div className="locker-status">
                  {box.disable
                    ? "Disattivato"
                    : box.used
                    ? "Occupato"
                    : "Libero"}
                </div>
              </button>
            );
          })}
        </div>
        <label htmlFor="codice-input"> Inserisci codice </label>
        <input
          id="codice-input"
          type="text"
          maxLength={6}
          value={codice}
          onChange={(e) => setCodice(e.target.value)}
        />
        <div>
          <label htmlFor="prefisso-telefono">
            {" "}
            Inserisci numero di telefono
          </label>{" "}
          <input
            className="prefisso"
            maxLength={4}
            value={prefisso}
            onChange={(e) => setPrefisso(e.target.value)}
          />
          <input
            id="telefono-input"
            type="text"
            maxLength={10}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <input
            type="ConfermaTelefono"
            value={confermaTel}
            maxLength={10}
            onChange={(e) => setConfermaTel(e.target.value)}
          />
        </div>
        <button onClick={handleDepositaInBox}>
          Deposita nel box selezionato
        </button>
      </div>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
}
