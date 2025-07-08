import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: null,
    loading: true,
  });

    useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verifica se il token è ancora valido
      fetch('http://localhost:8080/api/admin/all', {
        headers: { Authorization: 'Basic ' + token },
      })
        .then((res) => {
          if (res.ok) {
            setAuth({ token, loading: false });
          } else {
            localStorage.removeItem('authToken');
            setAuth({ token: null, loading: false });
          }
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          setAuth({ token: null, loading: false });
        });
    } else {
      setAuth({ token: null, loading: false });
    }
  }, []);


  const login = async (username, password) => {
    const token = btoa(`${username}:${password}`);
    // Prova a richiedere un endpoint protetto
    const res = await fetch("http://localhost:8080/api/admin/all", {
      headers: { Authorization: "Basic " + token },
    });
    if (!res.ok) {
      throw new Error("Credenziali non valide");
    }
    // Salva il token
    localStorage.setItem("authToken", token);
    setAuth({ token, loading: false });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuth({ token: null, loading:false });
  };

  const getAuthHeader = () => {
    return auth.token ? { Authorization: "Basic " + auth.token } : {};
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}
