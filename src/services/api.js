// src/services/api.js
const API_URL = "http://localhost:8080/api/user";

// Ottieni tutti i box
export async function getAllBoxes() {
  const response = await fetch(`${API_URL}/all`);
  if (!response.ok) throw new Error("Errore nel recupero dei box");
  const json = await response.json();
  if (json.success && Array.isArray(json.data)) return json.data;
  throw new Error("Struttura dati non valida per i box");
}

// Deposita in un box specifico
export async function depositaInBox(numeroBox, codice, telefono) {
  const response = await fetch(`${API_URL}/deposita/${numeroBox}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codice, telefono }),
  });

  const json = await response.json();

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || "Errore durante il deposito");
  }
  return json.data; // { numeroBox, codice }
}

// Ritira un pacco
export async function ritira(codice, telefono) {
  const response = await fetch(`${API_URL}/ritira`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      codice: Number(codice),
      telefono: Number(telefono),
    })
  });
  const json = await response.json();
  if (!response.ok || json.success === false) {
    throw new Error(json.message || "Errore nel ritiro");
  }
  return json.message;
}
