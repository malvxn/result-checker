import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {

  // DEMO LOGIN DETAILS
  const [studentId, setStudentId] = useState('ST001');
  const [pin, setPin] = useState('1234');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {

    if (!studentId || !pin) {
      alert('Enter Student ID and PIN');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_id', studentId.trim())
      .eq('pin', pin.trim())
      .limit(1);

    setLoading(false);

    if (error) {
      console.error(error);
      alert('Something went wrong');
      return;
    }

    const user = data?.[0];

    if (!user) {
      alert('Invalid login');
      return;
    }

    localStorage.setItem('student', JSON.stringify(user));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-blue-700 text-white p-12 flex-col justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">
              S
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                School Academy
              </h1>

              <p className="text-blue-100 text-sm">
                Student Result Portal
              </p>
            </div>
          </div>

          <div className="mt-16 max-w-md">
            <h2 className="text-4xl font-bold leading-tight">
              Digital Result Management For Modern Schools
            </h2>

            <p className="mt-5 text-blue-100 leading-7">
              Students can securely access their academic
              records online while administrators manage
              results efficiently from a centralized portal.
            </p>
          </div>
        </div>

        <div className="text-sm text-blue-100">
          © 2026 School Academy
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">

        <div className="w-full max-w-md">

          {/* Mobile Branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              S
            </div>

            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              School Academy
            </h1>

            <p className="text-sm text-gray-500">
              Student Result Portal
            </p>
          </div>

          {/* LOGIN CARD */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/40 p-8">

            <div className="mb-8">

              <div className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 mb-4">
                Demo Credentials Pre-filled
              </div>

              <p className="text-gray-500 mt-2 text-lg">
                Login to access your academic results
              </p>

            </div>

            {/* Inputs */}
            <div className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID
                </label>

                <input
                  type="text"
                  placeholder="ST001"
                  value={studentId}
                  autoComplete="off"
                  onChange={(e) => setStudentId(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleLogin()
                  }
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN
                </label>

                <input
                  type="password"
                  placeholder="1234"
                  value={pin}
                  autoComplete="off"
                  onChange={(e) => setPin(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleLogin()
                  }
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition"
                />
              </div>

            </div>

            {/* Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-12 mt-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login to Portal'}
            </button>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Demo portal for portfolio presentation
              </p>

              <p className="text-sm font-medium text-blue-600 mt-1">
                Use the pre-filled credentials to continue
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}