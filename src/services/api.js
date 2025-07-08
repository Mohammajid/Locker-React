import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function useFetchJson() {
  const { getAuthHeader } = useContext(AuthContext);

  return async function fetchJson(url, options = {}, withAuth = false) {
    const headers = {
      "Content-Type": "application/json",
      ...(withAuth ? getAuthHeader() : {}),
      ...(options.headers || {}),
    };
    const finalOptions = { ...options, headers };

    if( options.body && typeof options.body === "object") {
      finalOptions.body = JSON.stringify(options.body);
    }
  

     const res = await fetch(url, finalOptions);

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Errore nella richiesta");
    }

    return data;
  };
}

export function useApi() {
  const fetchJson = useFetchJson();
  const USER_API = "http://localhost:8080/api/user";
  const ADMIN_API = "http://localhost:8080/api/admin";

  return {
    // ==== USER ====

    getAllBoxes: () =>
      fetchJson(`${USER_API}/all`, {}, false).then((j) => j.data),

    deposita: (box, codice, telefono) =>
      fetchJson(
        `${USER_API}/deposita/${box}`,
        {
          method: "POST",
          body: { codice, telefono },
        },
        false
      ).then((j) => j.data),

    ritira: (codice, telefono) =>
      fetchJson(
        `${USER_API}/ritira`,
        {
          method: "POST",
          body: { codice, telefono },
        },
        false
      ).then((j) => j.message),

    // ==== ADMIN ====

    getAllBoxesAdmin: () =>
      fetchJson(`${ADMIN_API}/all`, {}, true).then((j) => j.data),

    getBoxLiberiAdmin: () =>
      fetchJson(`${ADMIN_API}/liberi`, {}, true).then((j) => j.data),

    getBoxOccupatiAdmin: () =>
      fetchJson(`${ADMIN_API}/occupati`, {}, true).then((j) => j.data),

    getBoxDisattivatiAdmin: () =>
      fetchJson(`${ADMIN_API}/disattivati`, {}, true).then((j) => j.data),

    createBoxAdmin: (list) =>
      fetchJson(
        `${ADMIN_API}/addAll`,
        {
          method: "POST",
          body: JSON.stringify(list),
        },
        true
      ).then((j) => j.data),

    updateBoxAdmin: (id, data) =>
      fetchJson(
        `${ADMIN_API}/${id}`,
        {
          method: "PUT",
          body: data,
        },
        true
      ).then((j) => j.data),

    deleteBoxAdmin: (id) =>
      fetchJson(
        `${ADMIN_API}/${id}`,
        {
          method: "DELETE",
        },
        true
      ).then((j) => j.message),

    resetAllAdmin: () =>
      fetchJson(
        `${ADMIN_API}/resetAll`,
        {
          method: "DELETE",
        },
        true
      ).then((j) => j.message),
  };
}
