import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Papa from 'papaparse';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

type Result = {
  id: string;
  subject: string;
  score: number;
  grade: string;
};

export default function Admin() {
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState('');
  const [grade, setGrade] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const fetchResults = async () => {
    const { data, error } = await supabase.from('results').select('*');

    if (error) {
      console.error('Error fetching results:', error);
      return;
    }

    setResults(data || []);
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin');

    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }

    fetchResults();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin-login');
  };

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
    if (!newScore) return;

    const { error } = await supabase
      .from('results')
      .update({ score: Number(newScore) })
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
    <div className="min-h-screen bg-gray-100">
      <Header title="Admin Panel" />

      <div className="p-4 max-w-3xl mx-auto space-y-4">

        {/* Logout */}
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Add Result */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-semibold mb-4">Add Result</h3>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Student ID"
              className="w-full p-3 border rounded-lg"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />

            <input
              type="text"
              placeholder="Subject"
              className="w-full p-3 border rounded-lg"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <input
              type="number"
              placeholder="Score"
              className="w-full p-3 border rounded-lg"
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />

            <input
              type="text"
              placeholder="Grade"
              className="w-full p-3 border rounded-lg"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
          </div>

          <button
            onClick={handleAddResult}
            disabled={loading}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Add Result'}
          </button>
        </div>

        {/* CSV Upload */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-semibold mb-3">Upload CSV</h3>

          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
          />

          {uploading && (
            <p className="text-sm text-gray-500 mt-2">
              Uploading...
            </p>
          )}
        </div>

        {/* Results List */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-semibold mb-4">All Results</h3>

          {results.length === 0 ? (
            <p className="text-sm text-gray-500">
              No results yet
            </p>
          ) : (
            <div className="space-y-2">
              {results.map((r) => (
                <div
                  key={r.id}
                  className="border p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{r.subject}</p>
                    <p className="text-sm text-gray-500">
                      {r.score} ({r.grade})
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(r.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(r.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded-lg"
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
  );
}