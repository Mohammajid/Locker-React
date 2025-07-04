import React from "react";
import Home from "./pages/Home";
import LockerGrid from "./pages/DepositoPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import RitiraPage from "./pages/RitiraPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deposita" element={<LockerGrid />} />
        <Route path="/ritira" element={<RitiraPage />} />
        <Route path="admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
