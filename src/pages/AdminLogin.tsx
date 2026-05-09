import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {

  // DEMO ADMIN CREDENTIALS
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');

  const navigate = useNavigate();

  const handleLogin = () => {

    if (username === 'admin' && password === '1234') {
      localStorage.setItem('admin', 'true');
      navigate('/admin');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* BRAND */}
        <div className="text-center mb-8">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200">
            A
          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900">
            Admin Portal
          </h1>

          <p className="mt-2 text-slate-500">
            Secure access for school administrators
          </p>

        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8">

          {/* DEMO BADGE */}
          <div className="mb-6">

            <div className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1">
              Demo Credentials Pre-filled
            </div>

          </div>

          <div className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>

              <input
                type="text"
                placeholder="admin"
                value={username}
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleLogin()
                }
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="1234"
                value={password}
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && handleLogin()
                }
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
              />
            </div>

          </div>

          <button
            onClick={handleLogin}
            className="w-full h-12 mt-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Access Admin Dashboard
          </button>

          <div className="mt-6 pt-6 border-t border-slate-100">

            <p className="text-sm text-center text-slate-500">
              Demo admin access for portfolio presentation
            </p>

            <p className="text-sm text-center font-medium text-blue-600 mt-1">
              Use the pre-filled credentials to continue
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}