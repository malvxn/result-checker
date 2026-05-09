import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

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

  const average =
    results.reduce((acc, r) => {
      const total =
        (r.ca ?? 0) + (r.exam ?? r.score ?? 0);

      return acc + total;
    }, 0) / (results.length || 1);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* TOP BAR */}
      <div className="bg-white border-b border-slate-200 print:hidden">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

          <div>
            <h1 className="font-bold text-slate-900">
              School Academy
            </h1>

            <p className="text-sm text-slate-500">
              Student Result Portal
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => window.print()}
              className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
            >
              Print Result
            </button>

            <button
              onClick={handleLogout}
              className="h-10 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-sm font-medium transition"
            >
              Logout
            </button>

          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 lg:p-8">

        {/* HERO */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <p className="text-sm font-medium text-blue-600">
                Academic Session 2024/2025
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {student.name}
              </h2>

              <p className="mt-2 text-slate-500">
                {student.class} • First Term Result Summary
              </p>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4">

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-w-35">
                <p className="text-sm text-slate-500">
                  Subjects
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {results.length}
                </h3>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 min-w-35">
                <p className="text-sm text-slate-500">
                  Average
                </p>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  {average.toFixed(1)}
                </h3>
              </div>

            </div>

          </div>

        </div>

        {/* RESULTS */}
        <div className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              Academic Performance
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Student term performance breakdown
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">
              Loading results...
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No results available
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr className="text-sm text-slate-500">

                    <th className="text-left font-medium px-6 py-4">
                      Subject
                    </th>

                    <th className="font-medium px-4 py-4">
                      CA
                    </th>

                    <th className="font-medium px-4 py-4">
                      Exam
                    </th>

                    <th className="font-medium px-4 py-4">
                      Total
                    </th>

                    <th className="font-medium px-4 py-4">
                      Grade
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {results.map((r) => {
                    const ca = r.ca ?? 0;
                    const exam = r.exam ?? r.score ?? 0;
                    const total = ca + exam;

                    return (
                      <tr
                        key={r.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {r.subject}
                        </td>

                        <td className="text-center text-slate-600">
                          {ca}
                        </td>

                        <td className="text-center text-slate-600">
                          {exam}
                        </td>

                        <td className="text-center font-semibold text-slate-900">
                          {total}
                        </td>

                        <td className="text-center">
                          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                            {r.grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}