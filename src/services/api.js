const API_URL = "http://localhost:8080/api/user/user/admin";

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

function getAuthHeader() {
  return {
    Authorization: "Basic " + btoa(`${ADMIN_USER}:${ADMIN_PASS}`),
  };
}

async function fetchJson(url, options = {}, withAuth = false) {
  const headers = {
    "Content-Type": "application/json",
    ...(withAuth ? getAuthHeader() : {}),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  let json;
  try {
    json = await res.json();
  } catch {
    // Se la risposta non è JSON valido
    throw new Error("Risposta non valida dal server");
  }

  if (!res.ok) {
    throw new Error(json.message || "Errore nella richiesta");
  }

  return json;
}

// UTENTI (anonimi)
export async function getAllBoxes() {
  const json = await fetchJson(`${API_URL}/all`);
  return json.data;
}

export async function depositaInBox(numeroBox, codice, telefono) {
  const json = await fetchJson(
    `${API_URL}/deposita/${numeroBox}`,
    {
      method: "POST",
      body: JSON.stringify({ codice, telefono }),
    }
  );
  return json.data;
}

export async function ritira(codice, telefono) {
  const json = await fetchJson(
    `${API_URL}/ritira`,
    {
      method: "POST",
      body: JSON.stringify({ codice: Number(codice), telefono: Number(telefono) }),
    }
  );
  return json.message;
}

// ADMIN (con autenticazione Basic Auth)
export async function getAllBoxesAdmin() {
  const json = await fetchJson(`${API_URL}/all`, {}, true);
  return json.data;
}

export async function getBoxLiberiAdmin() {
  const json = await fetchJson(`${API_URL}/liberi`, {}, true);
  return json.data;
}

export async function getBoxOccupatiAdmin() {
  const json = await fetchJson(`${API_URL}/occupati`, {}, true);
  return json.data;
}

export async function createBoxAdmin(boxData) {
  const json = await fetchJson(
    `${API_URL}/create`,
    {
      method: "POST",
      body: JSON.stringify(boxData),
    },
    true
  );
  return json.data;
}

export async function updateBoxAdmin(numeroBox, boxData) {
  const json = await fetchJson(
    `${API_URL}/update/${numeroBox}`,
    {
      method: "PUT",
      body: JSON.stringify(boxData),
    },
    true
  );
  return json.data;
}

export async function deleteBoxAdmin(numeroBox) {
  const json = await fetchJson(
    `${API_URL}/delete/${numeroBox}`,
    {
      method: "DELETE",
    },
    true
  );
  return json.message;
}
