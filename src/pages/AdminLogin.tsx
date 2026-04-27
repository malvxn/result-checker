import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // SIMPLE AUTH (MVP)
    if (username === 'admin' && password === '1234') {
      localStorage.setItem('admin', 'true');
      navigate('/admin');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white p-6 rounded-2xl border shadow-sm">

          <h2 className="text-xl font-semibold text-center mb-4">
            Admin Login
          </h2>

          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border rounded-lg mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-3 rounded-lg"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}