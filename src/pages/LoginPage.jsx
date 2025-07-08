
import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
  const [user, setUser] = useState({ username:'', password:'' });
  const [error, setError] = useState();
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || '/admin';

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(user.username, user.password);
      nav(from, { replace: true });
    } catch(err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl mb-4">Admin Login</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Username"
          value={user.username}
          onChange={e=>setUser(u=>({ ...u, username:e.target.value }))}
          required
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={e=>setUser(u=>({ ...u, password:e.target.value }))}
          required
          className="border p-2"
        />
        <button type="submit" className="mt-4 bg-blue-600 text-white p-2 rounded">
          Accedi
        </button>
      </form>
    </div>
  );
}
