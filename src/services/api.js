const API_URL = "http://localhost:8080/api"; // cambia se hai una porta diversa

export async function getAllBoxes() {
  const response = await fetch(`${API_URL}/all`);
  if (!response.ok) throw new Error("Errore nel recupero dei box");
  return response.json();
}

export async function deposita() {
  const response = await fetch("http://localhost:8080/api/deposita", {
    method: "POST",
  });

  const text = await response.text(); // leggo la risposta grezza
  console.log("Raw deposito response:", text);

  if (!response.ok) {
    throw new Error(`Errore deposito: ${text}`)
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Errore parsing JSON: ${text}`);
  }
}





export async function ritira(codice){
  const response = await fetch(`${API_URL}/ritira`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({codice}),
  });

  if (!response.ok) throw new ErrorEvent("Errore nel ritiro")
;
return response.text();
}