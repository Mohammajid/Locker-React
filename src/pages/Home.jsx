import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <button className="home-button" onClick={() => navigate("/deposita")}>
        Deposita
      </button>
      <button className="home-button" onClick={() => navigate("/ritira")}>
        Ritira
      </button>
    </div>
  );
}
