import React, { useEffect, useState } from 'react';
import {
  getAllBoxesAdmin,
  getBoxLiberiAdmin,
  getBoxOccupatiAdmin,
  createBoxAdmin,
  updateBoxAdmin,
  deleteBoxAdmin,
  depositaInBox,
  ritira
} from '../services/api';

export default function AdminPage() {
  const [boxes, setBoxes] = useState([]);
  const [liberi, setLiberi] = useState([]);
  const [occupati, setOccupati] = useState([]);
  const [disattivati, setDisattivati] = useState([]);
  const [error, setError] = useState(null);

  // Form state
  const [newBox, setNewBox] = useState({ numero: '', capienza: '' });
  const [selectedBox, setSelectedBox] = useState('');
  const [updateData, setUpdateData] = useState({ capienza: '' });
  const [depositInfo, setDepositInfo] = useState({ box: '', codice: '', telefono: '' });
  const [ritiroInfo, setRitiroInfo] = useState({ codice: '', telefono: '' });

  const fetchAll = async () => {
    try {
      setError(null);
      const [all, lib, occ] = await Promise.all([
        getAllBoxesAdmin(),
        getBoxLiberiAdmin(),
        getBoxOccupatiAdmin(),
      ]);
      setBoxes(all);
      setLiberi(lib);
      setOccupati(occ);
      setDisattivati(all.filter(b => b.stato === 'DISATTIVATO'));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreate = async () => {
    try {
      await createBoxAdmin({ numero: Number(newBox.numero), capienza: Number(newBox.capienza) });
      setNewBox({ numero: '', capienza: '' });
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async () => {
    if (!selectedBox) return;
    try {
      await updateBoxAdmin(selectedBox, { capienza: Number(updateData.capienza) });
      setUpdateData({ capienza: '' });
      setSelectedBox('');
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedBox) return;
    try {
      await deleteBoxAdmin(selectedBox);
      setSelectedBox('');
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeposit = async () => {
    try {
      const { box, codice, telefono } = depositInfo;
      await depositaInBox(box, codice, telefono);
      setDepositInfo({ box: '', codice: '', telefono: '' });
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRitiro = async () => {
    try {
      const { codice, telefono } = ritiroInfo;
      await ritira(codice, telefono);
      setRitiroInfo({ codice: '', telefono: '' });
      fetchAll();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Pannello Admin</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Tutti i Box */}
      <section className="mb-6">
        <h2 className="text-xl">Tutti i Box</h2>
        <ul className="grid grid-cols-4 gap-2 mt-2">
          {boxes.map(b => (
            <li key={b.numero} className="p-2 border rounded">
              <p><strong>Box {b.numero}</strong></p>
              <p>Stato: {b.stato}</p>
              <p>Capienza: {b.capienza}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Statistiche Box */}
      <section className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Liberi</h3>
          <p>{liberi.map(b => b.numero).join(', ') || 'Nessuno'}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Occupati</h3>
          <p>{occupati.map(b => b.numero).join(', ') || 'Nessuno'}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Disattivati</h3>
          <p>{disattivati.map(b => b.numero).join(', ') || 'Nessuno'}</p>
        </div>
      </section>

      {/* Crea Box */}
      <section className="mb-6">
        <h2 className="text-lg mb-2">Crea Box</h2>
        <input
          type="number"
          placeholder="Numero"
          value={newBox.numero}
          onChange={e => setNewBox({ ...newBox, numero: e.target.value })}
          className="border p-1 mr-2"
        />
        <input
          type="number"
          placeholder="Capienza"
          value={newBox.capienza}
          onChange={e => setNewBox({ ...newBox, capienza: e.target.value })}
          className="border p-1 mr-2"
        />
        <button onClick={handleCreate} className="px-3 py-1 bg-blue-600 text-white rounded">
          Crea
        </button>
      </section>

      {/* Aggiorna / Elimina Box */}
      <section className="mb-6">
        <h2 className="text-lg mb-2">Aggiorna / Elimina Box</h2>
        <select
          value={selectedBox}
          onChange={e => setSelectedBox(e.target.value)}
          className="border p-1 mr-2"
        >
          <option value="">Seleziona Box</option>
          {boxes.map(b => (
            <option key={b.numero} value={b.numero}>{`Box ${b.numero}`}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Nuova Capienza"
          value={updateData.capienza}
          onChange={e => setUpdateData({ capienza: e.target.value })}
          className="border p-1 mr-2"
        />
        <button onClick={handleUpdate} className="px-3 py-1 bg-green-600 text-white rounded mr-2">
          Aggiorna
        </button>
        <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded">
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
          onChange={e => setDepositInfo({ ...depositInfo, box: e.target.value })}
          className="border p-1 mr-2"
        />
        <input
          type="text"
          placeholder="Codice"
          value={depositInfo.codice}
          onChange={e => setDepositInfo({ ...depositInfo, codice: e.target.value })}
          className="border p-1 mr-2"
        />
        <input
          type="text"
          placeholder="Telefono"
          value={depositInfo.telefono}
          onChange={e => setDepositInfo({ ...depositInfo, telefono: e.target.value })}
          className="border p-1 mr-2"
        />
        <button onClick={handleDeposit} className="px-3 py-1 bg-blue-600 text-white rounded">
          Deposita
        </button>
      </section>

      {/* Ritira Pacco */}
      <section className="mb-6">
        <h2 className="text-lg mb-2">Ritira Pacco</h2>
        <input
          type="text"
          placeholder="Codice"
          value={ritiroInfo.codice}
          onChange={e => setRitiroInfo({ ...ritiroInfo, codice: e.target.value })}
          className="border p-1 mr-2"
        />
        <input
          type="text"
          placeholder="Telefono"
          value={ritiroInfo.telefono}
          onChange={e => setRitiroInfo({ ...ritiroInfo, telefono: e.target.value })}
          className="border p-1 mr-2"
        />
        <button onClick={handleRitiro} className="px-3 py-1 bg-blue-600 text-white rounded">
          Ritira
        </button>
      </section>
    </div>
  );
}
