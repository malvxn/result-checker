import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Login() {
  const [studentId, setStudentId] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Student Login</h1>
              
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Student ID"
                className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />

              <input
                type="password"
                placeholder="PIN"
                className="w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {/* Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {/* Footer */}
            <p className="text-xs text-gray-400 text-center mt-4">
              Contact school admin if you cannot log in
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}