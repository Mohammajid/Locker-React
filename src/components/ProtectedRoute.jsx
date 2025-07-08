import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { auth } = useContext(AuthContext);
  const loc = useLocation();

  if (auth.loading) {
    return <div>Controllo credenziali..</div>;
  }

  if (!auth.token) {
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  }
  return children;
}
