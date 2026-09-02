import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ADMIN_CREDENTIAL } from '../data/mockData';
import DemoBadge from '../components/DemoBadge';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin } = useApp();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 900)); // Simulate async

    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIAL.email &&
      password === ADMIN_CREDENTIAL.password
    ) {
      loginAdmin();
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials.');
    }
    setLoading(false);
  };



  return (
    <div className="min-h-screen bg-gradient-navy flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorations */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl" />

        <div className="relative text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-glow animate-float">
            <GraduationCap size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4">Excellence Coaching</h2>
          <p className="text-white text-lg leading-relaxed mb-8">
            The premium fee management system for modern coaching institutes.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            {['Track all payments', 'Student management', 'Analytics dashboard', 'Mobile responsive'].map((item) => (
              <div key={item} className="glass rounded-xl p-3 flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-accent-400 flex-shrink-0" />
                <span className="text-white text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:bg-silver-100 lg:rounded-l-3xl">
        <div className="w-full max-w-md">
          {/* Back */}
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-silver-500 hover:text-navy-950 mb-8 transition-colors lg:text-navy-700">
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="lg:card animate-slide-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center shadow-glow lg:hidden">
                <GraduationCap size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white lg:text-navy-950">Admin Login</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-sm text-silver-500">Sign in to your admin panel</p>
                  <DemoBadge />
                </div>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="label text-black lg:text-navy-800">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-silver-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="input pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="label text-black lg:text-navy-800">Password</label>
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
                <div className="bg-[#84cc16] border border-[#84cc16] text-[#84cc16] text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : 'Sign In to Admin Panel'}
              </button>
            </form>



            <p className="text-center mt-5 text-sm text-silver-500">
              Are you a student?{' '}
              <Link to="/student/login" className="text-accent-500 font-semibold hover:underline">
                Student Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
