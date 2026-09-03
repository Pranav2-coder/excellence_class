import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, User, Lock, Eye, EyeOff, ArrowLeft, BookOpen, Clock, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function StudentLogin() {
  const navigate = useNavigate();
  const { loginStudent } = useApp();

  const [studentId, setStudentId] = useState(localStorage.getItem('student_id_cache') || '');
  const [password,  setPassword]  = useState(localStorage.getItem('student_pwd_cache') || '');
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
      localStorage.setItem('student_id_cache', studentId.trim().toUpperCase());
      localStorage.setItem('student_pwd_cache', password);
      navigate('/student/dashboard');
    } else {
      setError('Invalid Student ID or password.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-navy flex">
      {/* Left panel (visuals & text) */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="relative text-center max-w-md z-10">
          <div className="w-20 h-20 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-glow animate-float">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4">Student Portal</h2>
          <p className="text-white text-lg leading-relaxed mb-8">
            Access your fee details, download receipts, and track your payment history seamlessly.
          </p>
          
          <div className="grid grid-cols-1 gap-4 text-left mt-8">
            <div className="glass rounded-xl p-4 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-accent-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Download Receipts</h4>
                <p className="text-white text-xs mt-0.5">Instant access to past payment receipts</p>
              </div>
            </div>
            
            <div className="glass rounded-xl p-4 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Clock size={20} className="text-[#84cc16]" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Track Dues</h4>
                <p className="text-white text-xs mt-0.5">Stay updated with upcoming and pending fees</p>
              </div>
            </div>
            
            <div className="glass rounded-xl p-4 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <BookOpen size={20} className="text-violet-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Course Details</h4>
                <p className="text-white text-xs mt-0.5">View your enrolled batches and courses</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel (form) */}
      <div className="flex-1 flex items-center justify-center p-6 lg:bg-silver-100 lg:rounded-l-3xl relative z-10">
        <div className="w-full max-w-md">
          {/* Back button */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-silver-500 hover:text-navy-950 mb-8 transition-colors lg:text-navy-700 font-medium">
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="lg:card animate-slide-up bg-white p-8 lg:p-10 rounded-2xl shadow-2xl lg:shadow-card-hover border border-silver-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center shadow-glow lg:hidden">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-navy-950">Welcome Back</h1>
                <p className="text-sm text-silver-500 mt-1">Sign in to your student account</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="label text-navy-800">Student ID</label>
                <div className="relative group">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-400 group-focus-within:text-accent-500 transition-colors" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. STU001"
                    className="input pl-11 uppercase py-3.5 text-base border-silver-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="label text-navy-800">Password</label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-400 group-focus-within:text-accent-500 transition-colors" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="input pl-11 pr-11 py-3.5 text-base border-silver-300 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-silver-400 hover:text-navy-800 transition-colors p-1"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-[#84cc16] border border-[#84cc16] text-[#84cc16] text-sm px-4 py-3 rounded-xl flex items-start gap-2">
                  <div className="mt-0.5">⚠️</div>
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3.5 text-base shadow-glow hover:shadow-lg transition-all duration-300 mt-4"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-silver-200">
              <div className="bg-silver-50 border border-silver-200 rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-navy-800">
                  Student ID and Password are provided by the Admin.
                </p>
                <p className="text-xs text-silver-500 mt-1">
                  Please use these credentials to sign in to your account.
                </p>
              </div>
              <p className="text-center mt-4 text-xs text-silver-400">
                Contact your institute administrator if you have forgotten your password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
