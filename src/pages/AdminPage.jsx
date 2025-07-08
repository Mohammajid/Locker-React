import React, { useEffect, useState } from "react";
import { useApi } from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function AdminPage() {
  const api = useApi();
  const [boxes, setBoxes] = useState([]);
  const [liberi, setLiberi] = useState([]);
  const [occupati, setOccupati] = useState([]);
  const [disattivati, setDisattivati] = useState([]);
  const [error, setError] = useState(null);

  const [newBoxNumero, setNewBoxNumero] = useState("");
  const [selectedBox, setSelectedBox] = useState("");
  const [message, setMessage] = useState(null);

  const [depositInfo, setDepositInfo] = useState({
    box: "",
    codice: "",
    telefono: "",
  });
  const [ritiroInfo, setRitiroInfo] = useState({ codice: "", telefono: "" });

  const fetchAll = async () => {
    try {
      setError(null);
      const [all, lib, occ] = await Promise.all([
        api.getAllBoxesAdmin(),
        api.getBoxLiberiAdmin(),
        api.getBoxOccupatiAdmin(),
      ]);
      setBoxes(
        all.map((box) => ({
          ...box,
          numero: box.numeroBox,
          stato: box.disable ? "DISATTIVATO" : box.used ? "OCCUPATO" : "LIBERO",
        }))
      );

      setLiberi(lib);
      setOccupati(occ);
      setDisattivati(all.filter((b) => b.stato === "DISATTIVATO"));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreate = async () => {
    try {
      if (!newBoxNumero) return; //verfica che ci sia un numero
      await api.createBoxAdmin([
        { numeroBox: Number(newBoxNumero), used: false, disable: false },
      ]);
      setNewBoxNumero("");
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  };
  const handleDelete = async () => {
    if (!selectedBox) {
      alert("Seleziona un box");
      return;
    }

    try {
      if (selectedBox === "all") {
        // Chiamo la funzione API per eliminare tutti i box
        const message = await api.resetAllAdmin();
        alert(message);
      } else {
        // Trovo il box selezionato
        const box = boxes.find((b) => b.numero === Number(selectedBox));
        if (!box) throw new Error("Box non trovato");

        // Elimino il box specifico
        const message = await api.deleteBoxAdmin(box.id);
        alert(message);
      }

      setSelectedBox("");
      fetchAll(); // ricarica i dati
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeposit = async () => {
  if (!depositInfo.box) {
    setError("Seleziona il numero del box");
    return;
  }
  const boxNumber = Number(depositInfo.box);
  if (isNaN(boxNumber)) {
    setError("Numero box non valido");
    return;
  }
  if (!depositInfo.codice || depositInfo.codice.length !== 6) {
    setError("Codice non valido");
    return;
  }
  if (!depositInfo.telefono || depositInfo.telefono.length !== 10) {
    setError("Numero telefono non valido");
    return;
  }

  try {
    const { numeroBox } = await api.deposita(boxNumber, depositInfo.codice, depositInfo.telefono);
    setMessage(`Pacco depositato nel box ${numeroBox}`);
    setError("");
    fetchAll();
  } catch (err) {
    setError(`Errore nel deposito: ${err.message}`);
    setMessage("");
  }
};


  const handleRitiro = async () => {
    try {
      const { codice, telefono } = ritiroInfo;
      await api.ritira(codice, telefono);
      setRitiroInfo({ codice: "", telefono: "" });
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const { logout } = useContext(AuthContext);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Pannello Admin</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Tutti i Box */}
      <section className="mb-6 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Tutti i Box</h2>
        <div className="locker-grid grid grid-cols-4 gap-2">
          {boxes.map((box) => {
            const isSelected = selectedBox === box.numero;
            return (
              <button
                key={box.id}
                className={`
            locker-box p-2 rounded border
            ${
              box.stato === "DISATTIVATO"
                ? "bg-gray-400 cursor-not-allowed text-gray-800"
                : box.stato === "OCCUPATO"
                ? "bg-red-500 text-white"
                : "bg-blue-300 text-gray-800"
            }
            ${isSelected ? "ring-4 ring-blue-300" : ""}
          `}
                onClick={() => {
                  if (box.stato !== "OCCUPATO" && box.stato !== "DISATTIVATO")
                    setSelectedBox(box.numero);
                }}
                disabled={
                  box.stato === "OCCUPATO" || box.stato === "DISATTIVATO"
                }
              >
                <div className="locker-number font-bold">Box {box.numero}</div>
                <div className="locker-status">
                  {box.stato === "DISATTIVATO"
                    ? "Disattivato"
                    : box.stato === "OCCUPATO"
                    ? "Occupato"
                    : "Libero"}
                </div>
              </button>
            );
          })}
        </div>
      </section>
      <div className="absolute top-4 right-4">
        <button
          onClick={logout}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>

      {/* Statistiche Box */}
      <section className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Liberi</h3>
          <p className="break-words">
            {" "}
            {/** questo adegua le righe in base allo schermo */}
            N°:{" "}
            {boxes
              .filter((b) => !b.used && !b.disable)
              .map((b) => b.numeroBox)
              .join(",") || "nessuno"}
          </p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Occupati</h3>
          <p>
            N°:{" "}
            {boxes
              .filter((b) => b.used && !b.disable)
              .map((b) => b.numero)
              .join(",") || "nessuno"}
          </p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Disattivati</h3>
          <p>
            N°:{" "}
            {boxes
              .filter((b) => b.disable)
              .map((b) => b.numero)
              .join(", ") || "Nessuno"}
          </p>
        </div>
      </section>

      {/* Crea Box */}
      <section className="mb-6">
        <h2 className="text-lg mb-2">Crea Box</h2>
        <input
          type="number"
          placeholder="Numero"
          value={newBoxNumero}
          onChange={(e) => setNewBoxNumero(e.target.value)}
          className="border p-1 mr-2"
        />
        <button
          onClick={handleCreate}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Crea
        </button>
      </section>

      {/* Elimina Box */}
      <section className="mb-6">
        <h2 className="text-lg mb-2">Elimina Box</h2>
        <select
          value={selectedBox}
          onChange={(e) => setSelectedBox(e.target.value)}
          className="border p-1 mr-2"
        >
          <option value="">Seleziona Box</option>
          <option value="all">Seleziona tutto</option>
          {boxes.map((b) => (
            <option key={b.id} value={b.numero}>
              {`Box ${b.numero}`}
            </option>
          ))}
        </select>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Elimina
        </button>
      </section>

      {/* Deposita Pacco */}
      <section className="mb-6">
        <h2 className="text-lg mb-2">Deposita Pacco</h2>
        <input
          type="number"
          placeholder="Numero Box"
          value={depositInfo.box}
          
          onChange={(e) =>
            setDepositInfo({ ...depositInfo, box: e.target.value })
          }
          className="border p-1 mr-2"
        />
        <input
          type="text"
          placeholder="Codice"
          value={depositInfo.codice}
          maxLength={6}
          onChange={(e) =>
            setDepositInfo({ ...depositInfo, codice: e.target.value })
          }
          className="border p-1 mr-2"
        />
        <input
          type="text"
          placeholder="Telefono"
          value={depositInfo.telefono}
          maxLength={10}
          onChange={(e) =>
            setDepositInfo({ ...depositInfo, telefono: e.target.value })
          }
          className="border p-1 mr-2"
        />
        <button
          onClick={handleDeposit}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Deposita
        </button>
        {message && <div className="text-green-600 mb-4">{message}</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}
      </section>

      {/* Ritira Pacco */}
      <section className="mb-6">
        <h2 className="text-lg mb-2">Ritira Pacco</h2>
        <input
          type="text"
          placeholder="Codice"
          value={ritiroInfo.codice}
          onChange={(e) =>
            setRitiroInfo({ ...ritiroInfo, codice: e.target.value })
          }
          className="border p-1 mr-2"
        />
        <input
          type="text"
          placeholder="Telefono"
          value={ritiroInfo.telefono}
          onChange={(e) =>
            setRitiroInfo({ ...ritiroInfo, telefono: e.target.value })
          }
          className="border p-1 mr-2"
        />
        <button
          onClick={handleRitiro}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Ritira
        </button>
      </section>
    </div>
  );
}
