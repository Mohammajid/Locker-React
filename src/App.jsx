// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/Home';
import Ritira from "./pages/RitiraPage";
import DepositoBox from './pages/DepositoPage'; // <-- Assicurati che il file esista

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="/ritira" element={<Ritira />} /> 
          <Route 
            path="admin" 
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          <Route path="deposita" element={<DepositoBox />} /> {/* <-- Aggiunta */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
