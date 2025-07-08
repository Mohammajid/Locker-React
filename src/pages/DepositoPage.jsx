import React, { useEffect, useState } from "react";
import { useApi } from "../services/api"; 
import "../styles/App.css";
import "../styles/Style-deposito.css";
import { useTranslation } from "react-i18next";

export default function LockerGrid() {
  const { getAllBoxes, deposita } = useApi(); 
  const [boxes, setBoxes] = useState([]);
  const [selectedBox, setSelectedBox] = useState(null);
  const [codice, setCodice] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [prefisso, setPrefisso] = useState("");
  const [telefono, setTelefono] = useState("");
  const [confermaTel, setConfermaTel] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    loadBoxes();
  }, []);

  const loadBoxes = async () => {
    try {
      const allBoxes = await getAllBoxes();
      setBoxes(allBoxes);
      setError("");
    } catch (err) {
      setError(t("deposito.error_fetch", { message: err.message }));
    }
  };

  const handleDepositaInBox = async () => {
    if (!selectedBox) {
      setError(t("deposito.select_box_error"));
      return;
    }

    if (!codice || codice.length !== 6) {
      setError(t("deposito.error_code"));
      return;
    }

    if (!prefisso || prefisso.length !== 4) {
      setError(t("depositaInBox.error_prefix"));
      return;
    }

    if (!telefono || telefono.length !== 10) {
      setError(t("deposito.error_phone"));
      return;
    }

    if (!confermaTel || confermaTel !== telefono) {
      setError(t("deposito.error_confirm_phone"));
      return;
    }

    try {
      const { numeroBox } = await deposita(selectedBox, codice, telefono); 
      setMessage(t("deposito.succes", { numeroBox }));
      setError("");
      loadBoxes();
    } catch (err) {
      setError(t("deposito.error_deposit", { message: err.message }));
      setMessage("");
    }
  };

  return (
    <div className="locker-container">
      <h1>{t("deposito.title")}</h1>

      <div className="controls">
        <div className="locker-grid">
          {boxes.map((box) => {
            const isSelected = selectedBox === box.numeroBox;
            return (
              <button
                key={box.id}
                className={`locker-box ${
                  box.disable
                    ? t("deposito.status.disable")
                    : box.used
                    ? t("deposito.status.occupied")
                    : t("deposito.status.free")
                } ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  if (!box.used && !box.disable) setSelectedBox(box.numeroBox);
                }}
                disabled={box.used || box.disable}
              >
                <div className="locker-number">Box {box.numeroBox}</div>
                <div className="locker-status">
                  {box.disable
                    ? t("deposito.status.disable")
                    : box.used
                    ? t("deposito.status.occupied")
                    : t("deposito.status.free")}
                </div>
              </button>
            );
          })}
        </div>

        <label htmlFor="codice-input">{t("ritira.title")}</label>
        <input
          id="codice-input"
          type="text"
          maxLength={6}
          value={codice}
          onChange={(e) => setCodice(e.target.value)}
          placeholder={t("ritira.placeholder_code")}
        />

        <div>
          <label htmlFor="prefisso-telefono">{t("ritira.phoneLable")}</label>
          <input
            id="prefisso-telefono"
            className="prefisso"
            maxLength={4}
            value={prefisso}
            onChange={(e) => setPrefisso(e.target.value)}
            placeholder="+39"
          />
          <input
            id="telefono-input"
            type="text"
            maxLength={10}
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder={t("ritira.placeholder_phone")}
          />
          <input
            id="conferma-telefono-input"
            type="text"
            value={confermaTel}
            maxLength={10}
            onChange={(e) => setConfermaTel(e.target.value)}
            placeholder={t("ritira.placeholder_phone")}
          />
        </div>

        <button onClick={handleDepositaInBox}>
          {t("deposito.button")}
        </button>
      </div>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
}
