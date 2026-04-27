import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

type Student = {
  id: string;
  name: string;
  class: string;
};

type Result = {
  id: string;
  subject: string;
  score?: number;
  grade: string;
  ca?: number;
  exam?: number;
};

export default function Dashboard() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedStudent = localStorage.getItem('student');

    if (!storedStudent) {
      navigate('/');
      return;
    }

    const parsedStudent: Student = JSON.parse(storedStudent);
    setStudent(parsedStudent);

    const fetchResults = async () => {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('student_id', parsedStudent.id);

      if (error) {
        console.error(error);
      }

      setResults(data || []);
      setLoading(false);
    };

    fetchResults();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('student');
    navigate('/');
  };

  if (!student) return null;

  // Average
  const average =
    results.reduce((acc, r) => {
      const total =
        (r.ca ?? 0) + (r.exam ?? r.score ?? 0);
      return acc + total;
    }, 0) / (results.length || 1);

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Hide header when printing */}
      <div className="print:hidden">
        <Header title="Results" />
      </div>

      <div className="p-4 max-w-3xl mx-auto space-y-4 print:space-y-2">

        {/* Top Actions */}
        <div className="flex justify-between items-center print:hidden">
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
          >
            Logout
          </button>

          <button
            onClick={() => window.print()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Print / Download
          </button>
        </div>

        {loading ? (
          <div className="bg-white p-6 rounded-xl border shadow-sm text-center text-sm">
            Loading results...
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border shadow-sm text-center text-gray-500 text-sm">
            No results available
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl border shadow-sm print:shadow-none print:border-none">

            {/* School Header (PRINT VIEW) */}
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold">
                  School Academy
              </h1>
              <p className="text-sm text-gray-500">
                Student Report Sheet
              </p>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <p><span className="font-medium">Name:</span> {student.name}</p>
              <p><span className="font-medium">Class:</span> {student.class}</p>
              <p><span className="font-medium">Term:</span> First Term</p>
              <p><span className="font-medium">Session:</span> 2024/2025</p>
            </div>

            {/* Results Table */}
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Subject</th>
                  <th className="border p-2">CA</th>
                  <th className="border p-2">Exam</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Grade</th>
                </tr>
              </thead>

              <tbody>
                {results.map((r) => {
                  const ca = r.ca ?? 0;
                  const exam = r.exam ?? r.score ?? 0;
                  const total = ca + exam;

                  return (
                    <tr key={r.id}>
                      <td className="border p-2">{r.subject}</td>
                      <td className="border p-2 text-center">{ca}</td>
                      <td className="border p-2 text-center">{exam}</td>
                      <td className="border p-2 text-center font-medium">{total}</td>
                      <td className="border p-2 text-center">{r.grade}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Summary */}
            <div className="mt-6 text-sm">
              <p>
                <span className="font-medium">Average:</span>{' '}
                {average.toFixed(1)}
              </p>

              <p className="mt-2">
                <span className="font-medium">Remark:</span>{' '}
                Good performance
              </p>
            </div>

            {/* Signature */}
            <div className="mt-10 text-sm flex justify-between">
              <p>____________________<br />Class Teacher</p>
              <p>____________________<br />Principal</p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}