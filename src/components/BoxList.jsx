import React, { useEffect, useState } from "react";
import { getAllBoxes, deposita, ritira } from "../services/api";
import "../App.css"; // se serve lo stile anche qui

export default function LockerGrid() {
  // Qui dichiari gli useState
  const [boxes, setBoxes] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [depositoInfo, setDepositoInfo] = useState(null);

  // Funzione per caricare i box
  const loadBoxes = () => {
    getAllBoxes()
      .then(setBoxes)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadBoxes();
  }, []);

  // Questa funzione usa setDepositoInfo che è stato definito sopra con useState
const handleDeposita = () => {
  deposita()
    .then((res) => {
      console.log("DEPOSITO RES:", res); // DEBUG
      setDepositoInfo(res); // imposta l'oggetto con pin e numberBox
      loadBoxes(); // aggiorna visivamente lo stato dei box
    })
    .catch((err) => {
      console.error(err);
      alert("Errore durante il deposito");
    });
};


  // Funzione per ritiro
  const handleRitira = async () => {
  const pin = prompt("Inserisci il pin per il ritiro:");
  if (!pin) return;

  try {
    const msg = await ritira(pin);
    setMessage(msg);
    setError(null);
    setDepositoInfo(null);
    loadBoxes();
  } catch (err) {
    console.error("Errore nel ritiro:", err);
    setError(err.message || "Errore generico");
    setMessage("");
  }
};


  return (
    <div>
      
      <h2>Locker</h2>
      <button onClick={handleDeposita}>Deposita</button>
      <button onClick={handleRitira} style={{ marginLeft: "10px" }}>
        Ritira
      </button>
   {depositoInfo && depositoInfo.data && depositoInfo.data.box && (
  <div style={{ marginTop: "15px", color: "green" }}>
    ✅ Deposito effettuato nel box <strong>{depositoInfo.data.box.numberBox}</strong>
    <br />
    🔐 Il tuo pin è: <strong>{depositoInfo.data.box.pin}</strong>
  </div>
)}


      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="locker-grid">
        {boxes.map((box) => (
          <div
            key={box.id}
            className={`locker-box ${box.used ? "occupied" : "free"}`}
          >
            <div className="locker-number">#{box.numberBox}</div>
            <div className="locker-status">{box.used ? "Occupato" : "Libero"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
