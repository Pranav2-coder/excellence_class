import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, User, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DemoBadge from '../components/DemoBadge';

export default function StudentLogin() {
  const navigate = useNavigate();
  const { loginStudent } = useApp();

  const [studentId, setStudentId] = useState('');
  const [password,  setPassword]  = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!studentId || !password) { setError('Please enter your Student ID and password.'); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const success = loginStudent(studentId.trim().toUpperCase(), password);
    if (success) {
      navigate('/student/dashboard');
    } else {
      setError('Invalid Student ID or password. Check the demo credentials below.');
    }
    setLoading(false);
  };

  const fillDemo = (id, pass) => {
    setStudentId(id);
    setPassword(pass);
    setError('');
  };

  const DEMOS = [
    { id: 'STU001', pass: 'stu001', name: 'Aarav Sharma' },
    { id: 'STU002', pass: 'stu002', name: 'Priya Patel' },
    { id: 'STU003', pass: 'stu003', name: 'Rohan Mehta' },
  ];

  return (
    <div className="min-h-screen bg-gradient-navy flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-slide-up">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header strip */}
          <div className="bg-gradient-accent p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <GraduationCap size={28} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Student Portal</h1>
              <p className="text-indigo-200 text-sm mt-1">Sign in to view your fee status</p>
              <div className="mt-3 flex justify-center"><DemoBadge /></div>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Student ID</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-500" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. STU001"
                    className="input pl-10 uppercase"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-500" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="input pl-10 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-silver-500 hover:text-navy-800"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base mt-2"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : 'Sign In'}
              </button>
            </form>

            {/* Demo students */}
            <div className="mt-5 p-4 bg-accent-50 rounded-xl border border-accent-200">
              <p className="text-xs font-semibold text-accent-700 mb-3 uppercase tracking-wide">Demo Student Accounts</p>
              <div className="space-y-2">
                {DEMOS.map((d) => (
                  <div key={d.id} className="flex items-center justify-between">
                    <div className="text-xs text-navy-800">
                      <span className="font-mono font-bold">{d.id}</span>
                      <span className="text-silver-500 mx-1">—</span>
                      <span>{d.name}</span>
                    </div>
                    <button
                      onClick={() => fillDemo(d.id, d.pass)}
                      className="text-xs text-accent-500 hover:text-accent-700 font-semibold underline"
                    >
                      Use
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center mt-5 text-sm text-silver-500">
              Admin?{' '}
              <Link to="/admin/login" className="text-accent-500 font-semibold hover:underline">
                Admin Login
              </Link>
            </p>
            <p className="text-center mt-2 text-xs text-silver-400">
              No self-registration. Accounts are created by admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
