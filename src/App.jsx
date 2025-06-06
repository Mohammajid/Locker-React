// src/App.jsx
import React from "react";
import LockerGrid from "./components/BoxList"; // usa il nome del file reale
import "./App.css";

function App() {
  return (
    <div>
      <h1>Gestione Locker</h1>
      <LockerGrid />
    </div>
  );
}

export default App;
