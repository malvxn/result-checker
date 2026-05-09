import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';

type Result = {
  id: string;
  subject: string;
  score: number;
  grade: string;
};

export default function Admin() {
  const [studentId, setStudentId] = useState('');
  const [searchId, setSearchId] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [grade, setGrade] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin');

    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin-login');
  };

  const fetchResults = async () => {
    if (!searchId) {
      setResults([]);
      return;
    }

    const { data: studentData } = await supabase
      .from('students')
      .select('id')
      .eq('student_id', searchId.trim())
      .limit(1);

    const student = studentData?.[0];

    if (!student) {
      setResults([]);
      return;
    }

    const { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('student_id', student.id);

    if (error) {
      console.error(error);
      return;
    }

    setResults(data || []);
  };

  useEffect(() => {
    if (searchId) {
      fetchResults();
    }
  }, [searchId]);

  const handleAddResult = async () => {
    if (!studentId || !subject || !score || !grade) {
      alert('Fill all fields');
      return;
    }

    setLoading(true);

    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('id')
      .eq('student_id', studentId.trim())
      .limit(1);

    if (studentError) {
      console.error(studentError);
      alert('Error finding student');
      setLoading(false);
      return;
    }

    const student = studentData?.[0];

    if (!student) {
      alert('Student not found');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('results').insert([
      {
        student_id: student.id,
        subject,
        score: Number(score),
        grade,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert('Error adding result');
      return;
    }

    alert('Result added');

    setSubject('');
    setScore('');
    setGrade('');

    fetchResults();
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Delete this result?');
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('results')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      alert('Error deleting');
      return;
    }

    fetchResults();
  };

  const handleUpdate = async (id: string) => {
    const newScore = prompt('Enter new score:');
    const newGrade = prompt('Enter new grade:');

    if (!newScore || !newGrade) return;

    const { error } = await supabase
      .from('results')
      .update({
        score: Number(newScore),
        grade: newGrade,
      })
      .eq('id', id);

    if (error) {
      console.error(error);
      alert('Error updating');
      return;
    }

    fetchResults();
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: any) => {
        const rows = results.data;

        for (const row of rows) {
          const studentId = row.student_id?.trim();

          const { data: studentData } = await supabase
            .from('students')
            .select('id')
            .eq('student_id', studentId)
            .limit(1);

          const student = studentData?.[0];

          if (!student) {
            console.warn(`Student not found: ${studentId}`);
            continue;
          }

          await supabase.from('results').insert([
            {
              student_id: student.id,
              subject: row.subject,
              score: Number(row.score),
              grade: row.grade,
            },
          ]);
        }

        setUploading(false);
        alert('CSV upload complete');
        fetchResults();
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* TOP BAR */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          <div>
            <h1 className="font-bold text-slate-900">
              School Academy
            </h1>

            <p className="text-sm text-slate-500">
              School Management Portal
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-slate-800">
                Administrator
              </p>

              <p className="text-xs text-slate-500">
                System Access
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="h-10 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-sm font-medium transition"
            >
              Logout
            </button>

          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-8">

        {/* PAGE HEADER */}
        <div className="mb-8">

          <p className="text-sm font-medium text-blue-600">
            Administration Dashboard
          </p>

          <p className="mt-2 text-slate-500">
            Manage student academic records and uploads
          </p>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Results Loaded
            </p>

            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {results.length}
            </h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Upload Status
            </p>

            <h3 className="mt-2 text-lg font-semibold text-green-600">
              System Active
            </h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Current Session
            </p>

            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              2024/2025
            </h3>
          </div>

        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="lg:col-span-1 space-y-6">

            {/* ADD RESULT */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

              <div className="mb-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  Add Result
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Create a new student result entry
                </p>
              </div>

              <div className="space-y-4">

                <input
                  type="text"
                  placeholder="Student ID"
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-3">

                  <input
                    type="number"
                    placeholder="Score"
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Grade"
                    className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  />

                </div>

                <button
                  onClick={handleAddResult}
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Result'}
                </button>

              </div>

            </div>

            {/* CSV */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">

              <div className="mb-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  Bulk Upload
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Upload student results using CSV
                </p>
              </div>

              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
                id="csvUpload"
              />

              <label
                htmlFor="csvUpload"
                className="flex items-center justify-center h-12 rounded-xl bg-slate-900 hover:bg-black text-white text-sm font-medium cursor-pointer transition"
              >
                Choose CSV File
              </label>

              {uploading && (
                <p className="text-sm text-slate-500 mt-3">
                  Uploading results...
                </p>
              )}

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2">

            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">

              {/* HEADER */}
              <div className="p-6 border-b border-slate-200">

                <h3 className="text-lg font-semibold text-slate-900">
                  Student Results
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Search and manage student records
                </p>

                <input
                  type="text"
                  placeholder="Search by Student ID"
                  className="w-full mt-4 h-12 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />

              </div>

              {/* RESULTS */}
              <div className="p-6">

                {results.length === 0 ? (
                  <div className="text-center py-10">

                    <p className="text-slate-500">
                      No results found
                    </p>

                  </div>
                ) : (
                  <div className="space-y-3">

                    {results.map((r) => (
                      <div
                        key={r.id}
                        className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50 transition"
                      >

                        <div>

                          <p className="font-semibold text-slate-900">
                            {r.subject}
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            Score: {r.score} • Grade: {r.grade}
                          </p>

                        </div>

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() => handleUpdate(r.id)}
                            className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(r.id)}
                            className="h-10 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition"
                          >
                            Delete
                          </button>

                        </div>

                      </div>
                    ))}

                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}